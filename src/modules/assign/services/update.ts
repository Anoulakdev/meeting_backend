import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateAssignDto } from '../dto/update-assign.dto';
import { Prisma } from '../../../../generated/prisma/client';
import { sendFCM } from '../../../fcm/fcm.service';
import { NotFoundException } from '@nestjs/common';
import moment from 'moment-timezone';

export async function updateAssign(
  prisma: PrismaService,
  id: number,
  updateAssignDto: UpdateAssignDto,
) {
  const { userId } = updateAssignDto;
  const userIds = userId ?? [];
  const uniqueUserIds = [...new Set(userIds)];

  const meeting = await prisma.meetingDoc.findUnique({
    where: { id: Number(id) },
  });

  if (!meeting) {
    throw new NotFoundException('Meeting not found');
  }

  // ✅ ถ้าส่ง userId เป็น array ว่าง แสดงว่าต้องการปลดผู้เข้าร่วมทั้งหมด (Unassign all)
  if (uniqueUserIds.length === 0) {
    const result = await prisma.$transaction(async (tx) => {
      await tx.detailDocAssign.deleteMany({
        where: {
          detailDoc: {
            meetingDocId: Number(id),
          },
        },
      });

      await tx.detailDoc.deleteMany({
        where: { meetingDocId: Number(id) },
      });

      await tx.assign.deleteMany({
        where: { meetingDocId: Number(id) },
      });

      return {
        message: 'All assigns removed successfully',
        meetingDocId: Number(id),
        deleted: true,
        totalUsers: 0,
        totalDays: 0,
        totalDetailAssign: 0,
      };
    });

    return {
      ...result,
      totalFCM: 0,
    };
  }

  const includeWeekend = updateAssignDto.includeWeekend ?? true;

  // ✅ คำนวณวันที่อย่างปลอดภัยโดยใช้ moment เพื่อไม่ให้เกิด timezone offset drift
  const dates: Date[] = [];
  const current = moment(meeting.startDate).startOf('day');
  const end = moment(meeting.endDate).startOf('day');

  while (current.isSameOrBefore(end, 'day')) {
    const day = current.day();
    if (includeWeekend || (day !== 0 && day !== 6)) {
      dates.push(current.toDate());
    }
    current.add(1, 'day');
  }

  const result = await prisma.$transaction(async (tx) => {
    // ===============================
    // 🧹 0. DELETE OLD DATA
    // ===============================
    await tx.detailDocAssign.deleteMany({
      where: {
        detailDoc: {
          meetingDocId: Number(id),
        },
      },
    });

    await tx.detailDoc.deleteMany({
      where: { meetingDocId: Number(id) },
    });

    await tx.assign.deleteMany({
      where: { meetingDocId: Number(id) },
    });

    // ===============================
    // ✅ 1. CREATE NEW ASSIGN
    // ===============================
    await tx.assign.createMany({
      data: uniqueUserIds.map((uid) => ({
        meetingDocId: Number(id),
        assignId: uid,
      })),
      skipDuplicates: true,
    });

    // ===============================
    // ✅ 2. CREATE DETAIL DOC
    // ===============================
    const createdDetailDocs = await Promise.all(
      dates.map((date) =>
        tx.detailDoc.create({
          data: {
            meetingDocId: Number(id),
            dateActive: date,
            timeActive: meeting.startTime,
          },
        }),
      ),
    );

    // ===============================
    // ✅ 3. CREATE DETAIL DOC ASSIGN
    // ===============================
    const detailAssignData: Prisma.DetailDocAssignCreateManyInput[] = [];

    for (const detail of createdDetailDocs) {
      for (const uid of uniqueUserIds) {
        detailAssignData.push({
          detailDocId: detail.id,
          detailAssignId: uid,
        });
      }
    }

    await tx.detailDocAssign.createMany({
      data: detailAssignData,
      skipDuplicates: true,
    });

    return {
      message: 'Assign updated successfully',
      meetingDocId: Number(id),
      deleted: true,
      totalUsers: uniqueUserIds.length,
      totalDays: dates.length,
      totalDetailAssign: detailAssignData.length,
    };
  });

  // ===============================
  // 🔥 4. SEND FCM (นอก transaction)
  // ===============================
  const fcmTokens = await prisma.fcmToken.findMany({
    where: {
      userId: { in: uniqueUserIds },
    },
    select: {
      fcmtoken: true,
    },
  });

  const tokens = Array.from(
    new Set(fcmTokens.map((t) => t.fcmtoken).filter(Boolean)),
  );

  const startD = moment(meeting.startDate);
  const endD = moment(meeting.endDate);

  const dateText = startD.isSame(endD, 'day')
    ? startD.format('DD/MM/YYYY')
    : `${startD.format('DD/MM/YYYY')} - ${endD.format('DD/MM/YYYY')}`;

  if (tokens.length > 0) {
    sendFCM(
      tokens,
      meeting.title,
      `ວັນເວລາ: ${dateText} ${meeting.startTime} - ${meeting.endTime} ສະຖານທີ່: ${meeting.location}`,
      prisma,
    ).catch((err) => {
      console.error('Error sending background FCM:', err);
    });
  }

  return {
    ...result,
    totalFCM: tokens.length,
    message: 'Assign updated successfully',
  };
}
