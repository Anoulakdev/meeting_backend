import * as admin from 'firebase-admin';
import * as path from 'path';

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
          sound: 'default',
          badge: 1,
        },
      },
      headers: {
        'apns-priority': '10', // High priority for iOS APNs
      },
    },
  });

  // ✅ handle invalid token
  response.responses.forEach((res, idx) => {
    if (!res.success) {
      console.log('❌ Invalid token:', tokens[idx], res.error);
    }
  });

  return response;
}
