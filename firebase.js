// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyCiChdKGroUFvaKEMu2ZJVyWlqM9PP3rVM",
	authDomain: "flashcard-saas-d5e55.firebaseapp.com",
	projectId: "flashcard-saas-d5e55",
	storageBucket: "flashcard-saas-d5e55.appspot.com",
	messagingSenderId: "999981212790",
	appId: "1:999981212790:web:602fed16e65f37be40eb57",
	measurementId: "G-ZTMCZ5LJF4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
