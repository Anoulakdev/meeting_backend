import { PrismaService } from '../../../prisma/prisma.service';
import { CreateAssignDto } from '../dto/create-assign.dto';
import { Prisma } from '../../../../generated/prisma/client';
import { sendFCM } from '../../../fcm/fcm.service';
import moment from 'moment-timezone';

export async function createAssign(
  prisma: PrismaService,
  createAssignDto: CreateAssignDto,
) {
  const { meetingDocId, userId } = createAssignDto;

  // ✅ validate
  if (!meetingDocId || !userId?.length) {
    throw new Error('meetingDocId and userId are required');
  }

  // 👉 กัน user ซ้ำ
  const uniqueUserIds = [...new Set(userId)];

  // ✅ หา meeting
  const meeting = await prisma.meetingDoc.findUnique({
    where: { id: meetingDocId },
  });

  if (!meeting) {
    throw new Error('Meeting not found');
  }

  // ✅ generate วันที่ (startDate → endDate)
  const dates: Date[] = [];
  const current = new Date(meeting.startDate);
  const end = new Date(meeting.endDate);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const result = await prisma.$transaction(async (tx) => {
    // ===============================
    // ✅ 1. Assign
    // ===============================
    await tx.assign.createMany({
      data: uniqueUserIds.map((uid) => ({
        meetingDocId,
        assignId: uid,
      })),
      skipDuplicates: true,
    });

    // ===============================
    // ✅ 2. DetailDoc
    // ===============================
    const createdDetailDocs = await Promise.all(
      dates.map((date) =>
        tx.detailDoc.create({
          data: {
            meetingDocId,
            dateActive: date,
            timeActive: meeting.startTime,
          },
        }),
      ),
    );

    // ===============================
    // ✅ 3. DetailDocAssign
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
      meetingDocId,
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
      `ວັນເວລາ: ${dateText} ${meeting.startTime} - ${meeting.endTime} ສະຖານທີ່: ${meeting.location}`,
    );
  }

  return {
    ...result,
    totalFCM: tokens.length,
    message: 'Assign created successfully',
  };
}
