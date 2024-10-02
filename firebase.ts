// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxw8uNhX8_i5LrqC3HcPr7MFW42CLLSTA",
  authDomain: "sxik-2068a.firebaseapp.com",
  projectId: "sxik-2068a",
  storageBucket: "sxik-2068a.appspot.com",
  messagingSenderId: "713880053446",
  appId: "1:713880053446:web:10cacdd41563df6ee599c7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
