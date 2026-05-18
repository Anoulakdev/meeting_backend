import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import moment from 'moment-timezone';
import { sendFCM } from '../../fcm/fcm.service';

@Injectable()
export class AssignCronService {
  private readonly logger = new Logger(AssignCronService.name);

  constructor(private readonly prisma: PrismaService) { }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkMeetingsAndNotify() {
    this.logger.log('Cronjob is running... Checking for meetings.');
    try {
      const now = moment().tz('Asia/Vientiane');
      const startOfDay = now.clone().startOf('day').toDate();
      const endOfDay = now.clone().endOf('day').toDate();

      const detailDocs = await this.prisma.detailDoc.findMany({
        where: {
          dateActive: {
            gte: startOfDay,
            lte: endOfDay,
          },
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

      this.logger.log(`Found ${detailDocs.length} detailDocs for today.`);

      let sentCount = 0;

      for (const doc of detailDocs) {
        const timeStr = doc.timeActive;
        if (!timeStr || !timeStr.includes(':')) continue;

        const [hours, minutes] = timeStr.split(':').map(Number);

        // Construct the meeting time
        const meetingTime = now.clone().hours(hours).minutes(minutes).seconds(0).milliseconds(0);

        // Calculate the difference in minutes
        const diffMinutes = Math.round(meetingTime.diff(now, 'minutes', true));

        // Check for 30, 15, or 5 minutes before
        if (diffMinutes === 30 || diffMinutes === 15 || diffMinutes === 5) {
          const tokens: string[] = [];

          for (const assign of doc.detailDocAssigns) {
            if (assign.detailAssign && assign.detailAssign.fcmtokens) {
              tokens.push(...assign.detailAssign.fcmtokens.map((t) => t.fcmtoken));
            }
          }

          const dateText = moment(doc.meetingDoc.startDate).isSame(moment(doc.meetingDoc.endDate), 'day')
            ? moment(doc.meetingDoc.startDate).format('DD/MM/YYYY')
            : `${moment(doc.meetingDoc.startDate).format('DD/MM/YYYY')} - ${moment(doc.meetingDoc.endDate).format('DD/MM/YYYY')}`;

          if (tokens.length > 0) {
            // Deduplicate tokens
            const uniqueTokens = [...new Set(tokens)];

            const title = `${doc.meetingDoc?.title}`;
            const body = `ວັນເວລາ: ${dateText} ${doc.meetingDoc.startTime} - ${doc.meetingDoc.endTime} ສະຖານທີ່: ${doc.meetingDoc.location}`;

            await sendFCM(uniqueTokens, title, body);
            this.logger.log(`[Cron] Sent FCM to ${uniqueTokens.length} devices for detailDoc ${doc.id} (${diffMinutes} mins left)`);
            sentCount++;
          }
        }
      }

      if (sentCount === 0) {
        this.logger.log('Cronjob finished: No notifications needed to be sent this minute.');
      } else {
        this.logger.log(`Cronjob finished: Successfully processed ${sentCount} notifications.`);
      }
    } catch (error) {
      this.logger.error(`Error in checkMeetingsAndNotify: ${error.message}`, error.stack);
    }
  }
}
