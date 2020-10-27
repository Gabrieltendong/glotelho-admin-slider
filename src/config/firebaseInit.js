import firebase from "firebase/app"
import 'firebase/storage'

var firebaseConfig = {
    apiKey: "AIzaSyBUv_QmuycPI2jbaGkQ4yyfT8A9XRPG-RU",
    authDomain: "glotelho-mobile.firebaseapp.com",
    databaseURL: "https://glotelho-mobile.firebaseio.com",
    projectId: "glotelho-mobile",
    storageBucket: "glotelho-mobile.appspot.com",
    messagingSenderId: "195169320373",
    appId: "1:195169320373:web:96739c4d4c81aab322adfc"
  };
  // Initialize Firebase
 firebase.initializeApp(firebaseConfig);

 const storage = firebase.storage()

 export  {
  storage, firebase as default
}