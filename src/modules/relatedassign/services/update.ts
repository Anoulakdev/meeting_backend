import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateRelatedassignDto } from '../dto/update-relatedassign.dto';
import { sendFCM } from '../../../fcm/fcm.service';
import { NotFoundException } from '@nestjs/common';

export async function updateAssign(
  prisma: PrismaService,
  id: number,
  updateAssignDto: UpdateRelatedassignDto,
) {
  const { userId } = updateAssignDto;
  const userIds = userId ?? [];
  const uniqueUserIds = [...new Set(userIds)];

  const related = await prisma.relatedDoc.findUnique({
    where: { id: Number(id) },
  });

  if (!related) {
    throw new NotFoundException('RelatedDoc not found');
  }

  // ✅ ถ้าส่ง userId เป็น array ว่าง แสดงว่าต้องการปลดผู้เข้าร่วมทั้งหมด (Unassign all)
  if (uniqueUserIds.length === 0) {
    const result = await prisma.$transaction(async (tx) => {
      await tx.relatedAssign.deleteMany({
        where: { relatedDocId: Number(id) },
      });

      return {
        message: 'All assigns removed successfully',
        relatedDocId: Number(id),
        deleted: true,
        totalUsers: 0,
      };
    });

    return {
      ...result,
      totalFCM: 0,
    };
  }

  const result = await prisma.$transaction(async (tx) => {
    // ===============================
    // 🧹 1. ลบรายการ Assign เดิมทั้งหมดของเอกสารนี้
    // ===============================
    await tx.relatedAssign.deleteMany({
      where: { relatedDocId: Number(id) },
    });

    // ===============================
    // ✅ 2. สร้างรายการ Assign ใหม่
    // ===============================
    await tx.relatedAssign.createMany({
      data: uniqueUserIds.map((uid) => ({
        relatedDocId: Number(id),
        relatedAssignId: uid,
      })),
      skipDuplicates: true,
    });

    return {
      message: 'Assign updated successfully',
      relatedDocId: Number(id),
      deleted: true,
      totalUsers: uniqueUserIds.length,
    };
  });

  // ===============================
  // 🔥 3. SEND FCM (นอก transaction)
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
    // 🔥 ส่ง FCM ในรูปแบบ Asynchronous ใน Background โดยไม่ใช้ await ขวาง thread
    sendFCM(tokens, 'ມີເອກະສານທີ່ຕິດພັນໃໝ່', related.title, prisma).catch(
      (err) => {
        console.error('Error sending background FCM:', err);
      },
    );
  }

  return {
    ...result,
    totalFCM: tokens.length,
    message: 'Assign updated successfully',
  };
}
