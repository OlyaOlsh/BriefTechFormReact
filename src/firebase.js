import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAvSdDCL7uT8irbe-Wj4sRpmiWEOZrhitQ",
    authDomain: "briefmarvel.firebaseapp.com",
    projectId: "briefmarvel",
    storageBucket: "briefmarvel.appspot.com",
    messagingSenderId: "1038774367718",
    appId: "1:1038774367718:web:bac64441a142b7bd305227"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);