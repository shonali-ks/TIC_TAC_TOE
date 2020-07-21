import React, { Component } from "react"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import  Game  from "../board/board";
import {ini} from '../board/board';
import firebase from './firebase'
import Rules from './rules'


import '../board/board.css';
import "./auth.css";
import { Button } from 'react-bootstrap';


const db = firebase.firestore();
class Firebase extends Component {
  state= { 
    isSignedIn:false ,
    username:"",
    userData:null,
    guest:false,
    status:"Login"
  }
  uiConfig = {
    signInFlow: "popup",
    
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,      
    ],

    callbacks:{
      signInSuccessWithAuthResult:()=>false
    }
    
  }
  check(){
    this.setState({guest:!this.state.guest})
    if(this.state.guest)
    this.setState({status:"Login"})
    else
    this.setState({status:"Logout"})
  }
  componentDidMount = ()=>{
    
    firebase.auth().onAuthStateChanged(user=>{
      this.setState({isSignedIn:!!user})
      if(this.state.isSignedIn)
      {
        this.setState({username:firebase.auth().currentUser.displayName});
        db.collection('user').where('username','==',this.state.username).get().then(doc=>{
          if(doc.empty)
          {
            db.collection("user").add({
              username:this.state.username,
              matches:0,
              score:0
            }); 
          }
          else{ 
        
              doc.docs.forEach(doc=>{
                if(doc.data().username==this.state.username)
                {console.log(doc.data());ini(doc.data().score,doc.data().matches,doc.data().username);}     
              })                                 
          }            
        })         
        
      }
      console.log(this.state.isSignedIn);
      
      db.collection("user").orderBy("score","desc").get().then((snapshot)=>
      {
        const userData=[];
        snapshot.docs.forEach(doc=>{
          const data=doc.data();
          userData.push(data);
          
          
        })
        this.setState({userData:userData})
      })

    })
  }
  render(){
    return (
    <div className="top">
      {(this.state.isSignedIn) ?
       <div className="auth">
        
        <marquee>Welcome {firebase.auth().currentUser.displayName}</marquee>
         <div className="login">
           <p className="name">{firebase.auth().currentUser.displayName}</p>
            <img
              alt="profile picture"
              src={firebase.auth().currentUser.photoURL}
            />
            <Button variant="outline-light" onClick={()=>firebase.auth().signOut()}>Sign out</Button>
        </div>
        <div className="table">
         <p>Please refresh the page if you can't see your username on the board</p>
         <th>user</th>
          <th>matches</th>
          <th>score</th>

         {this.state.userData && this.state.userData.map(user=>{
           return(              
               <tr>                 
                 <td>{user.username}</td>
                 <td>{user.matches}</td>
                 <td>{user.score}</td>
               </tr>            
           )
         })}
        </div>
        <div className="game">
      <Game/>
      </div>
      </div>
      :<div className="landing-page">
        <div className="status"><Rules/></div>
        
        <StyledFirebaseAuth uiConfig={this.uiConfig}
      firebaseAuth={firebase.auth()}
    
      />    
      <div className="status">  
      <Button variant="outline-light" onClick={()=>this.check()}>{this.state.status} as guest
        </Button>
        {this.state.guest?<div  className="games"><Game/></div>:null}
        </div>
      </div> 
      
    }
    </div>
    )
}
}

export default Firebase;