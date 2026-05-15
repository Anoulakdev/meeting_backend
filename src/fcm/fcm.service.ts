import * as admin from 'firebase-admin';
import * as path from 'path';

let initialized = false;

export function initFirebase() {
  if (initialized) return;

  const serviceAccount = require(
    path.join(process.cwd(), '../config/firebase.service-account.json'),
  );

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  initialized = true;
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
  });

  // ✅ handle invalid token
  response.responses.forEach((res, idx) => {
    if (!res.success) {
      console.log('❌ Invalid token:', tokens[idx], res.error);
    }
  });

  return response;
}
