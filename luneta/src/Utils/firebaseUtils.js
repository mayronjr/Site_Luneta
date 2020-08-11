import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage'

const config = {
    apiKey: "AIzaSyCngThCPaY1MnosBJZDKbRnkefv3pzW6hM",
    authDomain: "luneta-6a5eb.firebaseapp.com",
    databaseURL: "https://luneta-6a5eb.firebaseio.com",
    projectId: "luneta-6a5eb",
    storageBucket: "luneta-6a5eb.appspot.com",
    messagingSenderId: "1006601553983",
    appId: "1:1006601553983:web:d5472d95d2dc5f7e5d908a",
    measurementId: "G-J2792017XL"
  };

export const firebaseImpl = firebase.initializeApp(config);
export const FBDatabase = firebase.database();
export const FBStorage = firebase.storage();