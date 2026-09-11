import { PrismaService } from '../../../prisma/prisma.service';
import { AuthUser } from '../../../interfaces/auth-user.interface';
import { UpdateMeetingdocDto } from '../dto/update-meetingdoc.dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import moment from 'moment-timezone';
import { Prisma } from '../../../../generated/prisma/client';

export async function updateMeetingDoc(
  prisma: PrismaService,
  id: number,
  user: AuthUser,
  updateMeetingdocDto: UpdateMeetingdocDto,
) {
  const meeting = await prisma.meetingDoc.findUnique({
    where: { id },
    include: {
      assigns: true,
      detailDocs: true,
    },
  });
  if (!meeting) throw new NotFoundException('meeting not found');

  if (user.roleId !== 1 && meeting.createdById !== user.id) {
    throw new ForbiddenException('You do not have permission to edit this meeting');
  }

  const oldFile = meeting.docfile || '';
  let shouldDeleteOldFile = false;

  if (updateMeetingdocDto.docfile && updateMeetingdocDto.docfile !== oldFile) {
    shouldDeleteOldFile = true;
  } else {
    // ✅ ถ้าไม่มีไฟล์ใหม่ ให้ใช้ไฟล์เดิม
    updateMeetingdocDto.docfile = oldFile;
  }

  const newStartDate = updateMeetingdocDto.startDate
    ? new Date(updateMeetingdocDto.startDate)
    : meeting.startDate;
  const newEndDate = updateMeetingdocDto.endDate
    ? new Date(updateMeetingdocDto.endDate)
    : meeting.endDate;
  const newStartTime = updateMeetingdocDto.startTime ?? meeting.startTime;
  const newEndTime = updateMeetingdocDto.endTime ?? meeting.endTime;

  const dateOrTimeChanged =
    (updateMeetingdocDto.startDate &&
      updateMeetingdocDto.startDate !== moment(meeting.startDate).format('YYYY-MM-DD')) ||
    (updateMeetingdocDto.endDate &&
      updateMeetingdocDto.endDate !== moment(meeting.endDate).format('YYYY-MM-DD')) ||
    (updateMeetingdocDto.startTime &&
      updateMeetingdocDto.startTime !== meeting.startTime);

  const updated = await prisma.$transaction(async (tx) => {
    const updatedDoc = await tx.meetingDoc.update({
      where: { id },
      data: {
        ...updateMeetingdocDto,
        startDate: updateMeetingdocDto.startDate ? newStartDate : undefined,
        endDate: updateMeetingdocDto.endDate ? newEndDate : undefined,
        startTime: newStartTime,
        endTime: newEndTime,
        docfile: updateMeetingdocDto.docfile,
      },
    });

    // ✅ [Data Sync] ถ้ามีการเปลี่ยนวันหรือเวลา และมีการ Assign/DetailDoc เดิม ให้ปรับปรุง DetailDoc ให้ตรงกัน
    if (dateOrTimeChanged && meeting.detailDocs.length > 0) {
      const hadWeekend = meeting.detailDocs.some((d) => {
        const day = moment(d.dateActive).day();
        return day === 0 || day === 6;
      });

      const dates: Date[] = [];
      const current = moment(newStartDate).startOf('day');
      const end = moment(newEndDate).startOf('day');

      while (current.isSameOrBefore(end, 'day')) {
        const day = current.day();
        if (hadWeekend || (day !== 0 && day !== 6)) {
          dates.push(current.toDate());
        }
        current.add(1, 'day');
      }

      await tx.detailDocAssign.deleteMany({
        where: { detailDoc: { meetingDocId: id } },
      });
      await tx.detailDoc.deleteMany({
        where: { meetingDocId: id },
      });

      const newDetailDocs = await Promise.all(
        dates.map((date) =>
          tx.detailDoc.create({
            data: {
              meetingDocId: id,
              dateActive: date,
              timeActive: newStartTime,
            },
          }),
        ),
      );

      const userIds = meeting.assigns.map((a) => a.assignId);
      if (userIds.length > 0) {
        const detailAssignData: Prisma.DetailDocAssignCreateManyInput[] = [];
        for (const detail of newDetailDocs) {
          for (const uid of userIds) {
            detailAssignData.push({
              detailDocId: detail.id,
              detailAssignId: uid,
            });
          }
        }
        if (detailAssignData.length > 0) {
          await tx.detailDocAssign.createMany({
            data: detailAssignData,
            skipDuplicates: true,
          });
        }
      }
    }

    return updatedDoc;
  });

  // ✅ ปลอดภัย: ลบไฟล์เก่าหลังจาก Transaction สำเร็จเท่านั้น
  if (shouldDeleteOldFile && oldFile) {
    const oldFilePath = path.resolve(
      process.env.UPLOAD_BASE_PATH || '',
      'document',
      oldFile,
    );
    fs.promises.unlink(oldFilePath).catch((err) => {
      console.error('Error deleting old document file:', err);
    });
  }

  return updated;
}
