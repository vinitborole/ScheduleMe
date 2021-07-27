import firebase from 'firebase/app';
import 'firebase/database';

const config = {
  apiKey: 'AIzaSyBepsrqDz-ZTYVA_FUtJSYZMEVkkAP8F6Y',
  authDomain: 'pubg-fa8b8.firebaseapp.com',
  databaseURL: 'https://pubg-fa8b8.firebaseio.com',
  projectId: 'pubg-fa8b8',
  storageBucket: 'pubg-fa8b8.appspot.com',
  messagingSenderId: '243967793558',
  appId: '1:243967793558:web:059bbb640a7409a54de5b7'
};

firebase.initializeApp(config);

export default firebase.database();
