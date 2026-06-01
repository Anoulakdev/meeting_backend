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

  const CHUNK_SIZE = 500;
  const tokenChunks: string[][] = [];
  for (let i = 0; i < tokens.length; i += CHUNK_SIZE) {
    tokenChunks.push(tokens.slice(i, i + CHUNK_SIZE));
  }

  // Send in parallel for high performance
  const sendPromises = tokenChunks.map((chunk) =>
    admin.messaging().sendEachForMulticast({
      tokens: chunk,
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
    }),
  );

  const chunkResponses = await Promise.all(sendPromises);

  // Aggregate results and find invalid tokens
  let successCount = 0;
  let failureCount = 0;
  const allResponses: admin.messaging.SendResponse[] = [];
  const invalidTokens: string[] = [];

  chunkResponses.forEach((res, chunkIdx) => {
    successCount += res.successCount;
    failureCount += res.failureCount;
    allResponses.push(...res.responses);

    const chunk = tokenChunks[chunkIdx];
    res.responses.forEach((singleRes, idx) => {
      if (!singleRes.success) {
        console.log('❌ Invalid token:', chunk[idx], singleRes.error);
        const errorCode = singleRes.error?.code;
        if (
          errorCode === 'messaging/registration-token-not-registered' ||
          errorCode === 'messaging/invalid-argument'
        ) {
          invalidTokens.push(chunk[idx]);
        }
      }
    });
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

  return {
    successCount,
    failureCount,
    responses: allResponses,
  };
}
