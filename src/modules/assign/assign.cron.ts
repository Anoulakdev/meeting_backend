import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import moment from 'moment-timezone';
import { sendFCM } from '../../fcm/fcm.service';

@Injectable()
export class AssignCronService {
  private readonly logger = new Logger(AssignCronService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkMeetingsAndNotify() {
    this.logger.debug('Cronjob is running... Checking for meetings.');
    try {
      const now = moment().tz('Asia/Vientiane').seconds(0).milliseconds(0);

      // ✅ [Performance & Midnight Crossover] คำนวณวันและเวลาเป้าหมายสำหรับแต่ละช่วงนาทีแจ้งเตือนล่วงหน้า
      const intervals = [30, 15, 5];
      const targetConditions = intervals.map((mins) => {
        const target = now.clone().add(mins, 'minutes');
        const startOfTargetDay = target.clone().startOf('day').toDate();
        const endOfTargetDay = target.clone().endOf('day').toDate();
        const timeActive = target.format('HH:mm');
        return {
          dateActive: {
            gte: startOfTargetDay,
            lte: endOfTargetDay,
          },
          timeActive,
        };
      });

      // ✅ ดึงเฉพาะรายการที่ตรงกับเป้าหมายวันและเวลาอย่างแม่นยำ แม้จะข้ามเที่ยงคืน
      const detailDocs = await this.prisma.detailDoc.findMany({
        where: {
          OR: targetConditions,
        },
        include: {
          meetingDoc: true,
          detailDocAssigns: {
            include: {
              detailAssign: {
                include: {
                  fcmtokens: true,
                },
              },
            },
          },
        },
      });

      if (detailDocs.length > 0) {
        this.logger.log(
          `Found ${detailDocs.length} active detailDocs for this minute.`,
        );
      }

      let sentCount = 0;

      for (const doc of detailDocs) {
        if (!doc.meetingDoc) continue; // ✅ guard

        const timeStr = doc.timeActive;
        if (!timeStr || !timeStr.includes(':')) continue;

        // ✅ สร้าง meetingTime แบบ timezone-safe 100% ป้องกันความคลาดเคลื่อนหาก Server ใช้เวลา UTC
        const meetingTime = moment
          .tz(
            `${moment.tz(doc.dateActive, 'Asia/Vientiane').format('YYYY-MM-DD')} ${timeStr}`,
            'YYYY-MM-DD HH:mm',
            'Asia/Vientiane',
          )
          .seconds(0)
          .milliseconds(0);

        // Calculate the difference in minutes
        const diffMinutes = meetingTime.diff(now, 'minutes');

        // Check if the difference matches any of our notification intervals
        if (intervals.includes(diffMinutes)) {
          const tokens: string[] = [];

          for (const assign of doc.detailDocAssigns) {
            if (assign.detailAssign?.fcmtokens) {
              tokens.push(
                ...assign.detailAssign.fcmtokens.map((t) => t.fcmtoken),
              );
            }
          }

          // ✅ ป้องกันปัญหาเขตเวลาเคลื่อนในการตรวจสอบวันเริ่มต้นและสิ้นสุด
          const startDate = moment.tz(
            doc.meetingDoc.startDate,
            'Asia/Vientiane',
          );
          const endDate = moment.tz(doc.meetingDoc.endDate, 'Asia/Vientiane');
          const dateText = startDate.isSame(endDate, 'day')
            ? startDate.format('DD/MM/YYYY')
            : `${startDate.format('DD/MM/YYYY')} - ${endDate.format('DD/MM/YYYY')}`;

          if (tokens.length > 0) {
            // Deduplicate tokens
            const uniqueTokens = [...new Set(tokens)];

            const title = `${doc.meetingDoc.title}`;
            const body = `ວັນເວລາ: ${dateText} ${doc.meetingDoc.startTime} - ${doc.meetingDoc.endTime} ສະຖານທີ່: ${doc.meetingDoc.location}`;

            await sendFCM(uniqueTokens, title, body, this.prisma);
            this.logger.log(
              `[Cron] Sent FCM to ${uniqueTokens.length} devices for detailDoc ${doc.id} (${diffMinutes} mins left)`,
            );
            sentCount++;
          }
        }
      }

      if (sentCount === 0) {
        this.logger.debug(
          'Cronjob finished: No notifications needed to be sent this minute.',
        );
      } else {
        this.logger.log(
          `Cronjob finished: Successfully processed ${sentCount} notifications.`,
        );
      }
    } catch (error) {
      const err = error as Error;
      this.logger.error(
        `Error in checkMeetingsAndNotify: ${err.message}`,
        err.stack,
      );
    }
  }
}
