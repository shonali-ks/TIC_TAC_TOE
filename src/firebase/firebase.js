import React, { Component } from "react"
import "./firebase.css";
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import  Game  from "../board/board";
import  Game1  from "../board/four";
import '../board/board.css';

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


class Firebase extends Component {
  state= { isSignedIn:false }
  uiConfig = {
    signInFlow: "popup",
    
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,      
    ],

    callbacks:{
      signInSuccessWithAuthResult:()=>false
    }
    
  }
  componentDidMount = ()=>{
    
    firebase.auth().onAuthStateChanged(user=>{
      this.setState({isSignedIn:!!user})
      console.log(this.state.isSignedIn);

    })
  }
  render(){
    return (
    <div className="top">
      {this.state.isSignedIn ?
       <span className="auth">
         <div>Signed in</div>
      <button onClick={()=>firebase.auth().signOut()}>Sign out</button>
      <h1>Welcome {firebase.auth().currentUser.displayName}</h1>
            <img
              alt="profile picture"
              src={firebase.auth().currentUser.photoURL}
            />
      <Game/>
      </span>
      :<StyledFirebaseAuth uiConfig={this.uiConfig}
      firebaseAuth={firebase.auth()}
      />
      
    }
    
     
    </div>
    )
}
}

export default Firebase;