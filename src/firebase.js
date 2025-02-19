// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// // Firebase config
// // const firebaseConfig = {
// //   apiKey: import.meta.env.VITE_API_KEY,
// //   authDomain: import.meta.env.VITE_AUTH_DOMAIN,
// //   projectId: import.meta.env.VITE_PROJECT_ID,
// //   storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
// //   messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
// //   appId: import.meta.env.VITE_APP_ID,
// // };

// const firebaseConfig = {
//   apiKey: "AIzaSyBdM_imftB9Qxcgb67ZEfIgnsmxusZVELo",
//   authDomain: "satkriya.firebaseapp.com",
//   projectId: "satkriya",
//   storageBucket: "satkriya.firebasestorage.app",
//   messagingSenderId: "36171792594",
//   appId: "1:36171792594:web:23e21cab6d170ff713ad0b",
//   measurementId: "G-YWP5B7Y5FE",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app); // ✅ Ensure auth is initialized before use

// auth.useDeviceLanguage();

// export const db = getFirestore(app);
// // export const analytics = getAnalytics(app);

// const provider = new GoogleAuthProvider();
// provider.setCustomParameters({ prompt: "select_account" });

// export const signInWithGooglePopup = () => signInWithPopup(auth, provider); // ✅ Now auth is correctly defined

// // // ✅ Disable Auth Emulator for production
// // auth.settings.appVerificationDisabledForTesting = false;

// export default app;

// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDRhYZXcaToCW3cBvLOea7D_f50xZOi104",
  authDomain: "fir-ba682.firebaseapp.com",
  projectId: "fir-ba682",
  storageBucket: "fir-ba682.firebasestorage.app",
  messagingSenderId: "881135553628",
  appId: "1:881135553628:web:9006fe1d37e0e4c2992a99",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
