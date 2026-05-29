import * as admin from 'firebase-admin';
import * as path from 'path';
import { PrismaService } from '../prisma/prisma.service';

const prisma = new PrismaService();

export function initFirebase() {
  if (admin.apps.length > 0) return;

  const serviceAccount = require(
    path.join(process.cwd(), 'src/config/firebase.service-account.json'),
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}

// ===============================
// 🔥 send FCM
// ===============================
export async function sendFCM(tokens: string[], title: string, body: string) {
  if (!tokens.length) return;

  initFirebase();

  const response = await admin.messaging().sendEachForMulticast({
    tokens,
    notification: {
      title,
      body,
    },
    android: {
      priority: 'high',
    },
    apns: {
      payload: {
        aps: {
          alert: {
            title,
            body,
          },
          sound: 'default',
          badge: 1,
        },
      },
      headers: {
        'apns-priority': '10', // High priority for iOS APNs
      },
    },
  });

  // ✅ handle invalid token และ ลบออกจากตาราง DB ทันทีหากหมดอายุหรือใช้งานไม่ได้
  const invalidTokens: string[] = [];

  response.responses.forEach((res, idx) => {
    if (!res.success) {
      console.log('❌ Invalid token:', tokens[idx], res.error);
      const errorCode = res.error?.code;
      if (
        errorCode === 'messaging/registration-token-not-registered' ||
        errorCode === 'messaging/invalid-argument'
      ) {
        invalidTokens.push(tokens[idx]);
      }
    }
  });

  if (invalidTokens.length > 0) {
    try {
      await prisma.fcmToken.deleteMany({
        where: {
          fcmtoken: { in: invalidTokens },
        },
      });
      console.log(
        `🧹 Cleaned up ${invalidTokens.length} unregistered FCM tokens from DB.`,
      );
    } catch (dbError) {
      console.error(
        '❌ Failed to clean up invalid FCM tokens from DB:',
        dbError,
      );
    }
  }

  return response;
}
