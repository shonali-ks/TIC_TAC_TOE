import React, { Component } from "react"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import  Game  from "../board/board";
import {ini,guest} from '../board/board';
import firebase from './firebase'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'

import '../board/board.css';
import "./auth.css";
import { Button } from 'react-bootstrap';
import Table from 'react-bootstrap/Table'


const db = firebase.firestore();
class Firebase extends Component {
  state= { 
    isSignedIn:false ,
    username:"",
    userData:null,
    guest:false,
    status:"Login",
    
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
                if(doc.data().username===this.state.username)
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
        
         <h4><i>Scroll down the leaderboard to find your name. Refresh the page if you still don't.</i></h4>
         
         <Table striped bordered hover variant="dark">
          <thead>
          <tr>
          <th>Users</th>
          <th>Matches</th>
          <th>Score</th>
          </tr>
        </thead>
         {this.state.userData && this.state.userData.map(user=>{
           return( 
            <tbody>             
               <tr>                 
                 <td>{user.username}</td>
                 <td>{user.matches}</td>
                 <td>{user.score}</td>
               </tr>  
               </tbody>          
           )
         })}
         </Table>
        </div>
        <div className="game">
      <Game/>
      </div>
      </div>
      :<div className="landing-page">
     <div className="tip">
        <Accordion defaultActiveKey="0">
       <Card>
         <Accordion.Toggle as={Card.Header} eventKey="0">
           Pro Tip!
         </Accordion.Toggle>
         <Accordion.Collapse eventKey="0">
           <Card.Body>Sign in with Google to feature on the leaderboard and see how you fare when compared to other players
            You could also play as guest, but then you lose out on a chance to make it to the leaderboard. <StyledFirebaseAuth uiConfig={this.uiConfig}
              firebaseAuth={firebase.auth()}
              /> 
              P.S : Default settings of algo is minimax and game settings is against Ai.</Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion> 
        </div>
      <div className="but" >
      <Button className="but1" variant="outline-light"  onClick={()=>{this.check();guest(true)}}>{this.state.status} as guest
        </Button>
        </div>
      {this.state.guest?<div  className="games"><Game/></div>:null}
      </div> 
      
    }
    </div>
    )
}
}

export default Firebase;