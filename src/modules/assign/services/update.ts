import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateAssignDto } from '../dto/update-assign.dto';
import { Prisma } from '../../../../generated/prisma/client';
import { sendFCM } from '../../../fcm/fcm.service';
import moment from 'moment-timezone';

export async function updateAssign(
  prisma: PrismaService,
  id: number,
  updateAssignDto: UpdateAssignDto,
) {
  const { userId } = updateAssignDto;

  if (!userId?.length) {
    throw new Error('userId is required');
  }

  const uniqueUserIds = [...new Set(userId)];

  const meeting = await prisma.meetingDoc.findUnique({
    where: { id: Number(id) },
  });

  if (!meeting) {
    throw new Error('Meeting not found');
  }

  const dates: Date[] = [];
  const current = new Date(meeting.startDate);
  const end = new Date(meeting.endDate);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const result = await prisma.$transaction(async (tx) => {
    // ===============================
    // 🧹 0. DELETE OLD DATA (IMPORTANT)
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
    await sendFCM(
      tokens,
      meeting.title,
      `ວັນເວລາ: ${dateText} ${meeting.startTime} - ${meeting.endTime}`,
    );
  }

  return {
    ...result,
    totalFCM: tokens.length,
    message: 'Assign updated successfully',
  };
}
