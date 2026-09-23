import { PrismaService } from '../../../prisma/prisma.service';
import { CreateRelatedassignDto } from '../dto/create-relatedassign.dto';
import { sendFCM } from '../../../fcm/fcm.service';

import { BadRequestException, NotFoundException } from '@nestjs/common';

export async function createAssign(
  prisma: PrismaService,
  createAssignDto: CreateRelatedassignDto,
) {
  const { relatedDocId, userId } = createAssignDto;

  // ✅ validate
  if (!relatedDocId || !userId?.length) {
    throw new BadRequestException('relatedDocId and userId are required');
  }

  // 👉 กัน user ซ้ำ
  const uniqueUserIds = [...new Set(userId)];

  // ✅ หา related doc
  const related = await prisma.relatedDoc.findUnique({
    where: { id: relatedDocId },
  });

  if (!related) {
    throw new NotFoundException('RelatedDoc not found');
  }

  const result = await prisma.$transaction(async (tx) => {
    // ===============================
    // ✅ 1. Assign
    // ===============================
    await tx.relatedAssign.createMany({
      data: uniqueUserIds.map((uid) => ({
        relatedDocId,
        relatedAssignId: uid,
      })),
      skipDuplicates: true,
    });

    return {
      relatedDocId,
      totalUsers: uniqueUserIds.length,
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

  if (tokens.length > 0) {
    // 🔥 ส่ง FCM ในรูปแบบ Asynchronous ใน Background โดยไม่ใช้ await ขวาง thread เพื่อป้องกันความล่าช้าในระดับ API Response
    sendFCM(tokens, 'ມີເອກະສານທີ່ຕິດພັນໃໝ່', related.title, prisma).catch(
      (err) => {
        console.error('Error sending background FCM:', err);
      },
    );
  }

  return {
    ...result,
    totalFCM: tokens.length,
    message: 'Assign created successfully',
  };
}
