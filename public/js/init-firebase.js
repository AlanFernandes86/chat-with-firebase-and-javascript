
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js';
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-analytics.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxfaihYZ9EluzBQHG6sFSkKpzVArFYtug",
  authDomain: "marmitando-caee3.firebaseapp.com",
  databaseURL: "https://marmitando-caee3-default-rtdb.firebaseio.com",
  projectId: "marmitando-caee3",
  storageBucket: "marmitando-caee3.appspot.com",
  messagingSenderId: "203707805462",
  appId: "1:203707805462:web:969c8ee7bbce619fa86a37",
  measurementId: "G-DPV8YYRQZ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const database = getDatabase(app);