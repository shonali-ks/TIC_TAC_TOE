import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyCEJV_LZwa3PnJQ02BJ2vhd7BtiN4dRvwQ",
    authDomain: "tic-tac-toe-282408.firebaseapp.com",
    databaseURL: "https://tic-tac-toe-282408.firebaseio.com",
    projectId: "tic-tac-toe-282408",
    storageBucket: "tic-tac-toe-282408.appspot.com",
    messagingSenderId: "1063627955333",
    appId: "1:1063627955333:web:fa45668ba47769c7089dec",
    measurementId: "G-SH0LB3YEWX"
  };
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();

  export default firebase;