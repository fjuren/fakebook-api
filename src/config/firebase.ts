import * as admin from 'firebase-admin';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Need to initialize Firebase
const app = initializeApp(firebaseConfig);

// need to initialize Auth (from firebase I think)
const auth = getAuth(app);

// need to initialize firebase storage
const storage = getStorage();
// const analytics = getAnalytics(app);

// need to initialize firebase-admin for creating a custom token
const serviceAccount = require('../config/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Below is for generating a custom token for authed users and it will be used within firebase's security rules. This is because I don't user firebase authentication in this project, I use passport instead.
export async function firebaseCustomToken(
  uid: string,
  email: string,
  password: string
): Promise<string> {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    const customToken = await admin.auth().createCustomToken(uid);
    return customToken;
  } catch (error: any) {
    console.error('Error generating custom token:', error);
    throw new Error('Internal Server Error');
  }
}

export { storage, admin };
