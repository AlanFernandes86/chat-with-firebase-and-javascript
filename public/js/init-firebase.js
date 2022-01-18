
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js';
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-analytics.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyB4Is6xtQSz12Xg2-bGSue8MkUcv1CzINM",
  authDomain: "alan-chat-web-app.firebaseapp.com",
  databaseURL: "https://alan-chat-web-app-default-rtdb.firebaseio.com",
  projectId: "alan-chat-web-app",
  storageBucket: "alan-chat-web-app.appspot.com",
  messagingSenderId: "584133101786",
  appId: "1:584133101786:web:cab866d7978cead33fbde3",
  measurementId: "G-WCPY7HCSH3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const database = getDatabase(app);