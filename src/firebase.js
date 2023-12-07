// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAMcGpZ0dTST7_9y02olBWL6_F5rsiW4o",
  authDomain: "pub-deepocean-dev.firebaseapp.com",
  projectId: "pub-deepocean-dev",
  storageBucket: "pub-deepocean-dev.appspot.com",
  messagingSenderId: "477223378864",
  appId: "1:477223378864:web:bd91b64ea207bfef04c075",
  measurementId: "G-K6BBH2PCDX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

export {db}
/*
* 
*/