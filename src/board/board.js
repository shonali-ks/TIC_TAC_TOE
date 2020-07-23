import React, { Component } from 'react';
import nexthuman from '../utils/humanvshuman';
import checkwinner from '../utils/winner';
import findBestMove from '../utils/minmax';
import Stack from '../utils/stack';
import Queue from '../utils/queue';

import * as UndoRedo from '../utils/UndoRedo';
import alphabeta_move from '../utils/alphabeta';
import firebase from '../firebase/firebase';

import soundfile from '../sounds/humanFail.mp3'
import soundfile1 from '../sounds/humanPass.mp3'
import soundfile2 from '../sounds/multi.mp3'

import './board.css'
import { Button } from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup'

const db = firebase.firestore();

//score and match
var scores=0;
var matchplayed=0;
var username;
var isGuest=false;

export const ini=(s,m,name)=>
      {
        scores=s;
        matchplayed=m;
        username=name;
      }

export const guest=(boo)=>{
  isGuest=boo;
}

var object={
    icon : 'X',
    squares:null,
    player:true,
    computer:false,

}

var stack_undo = new Stack();
var stack_redo = new Stack();
var queue =new Queue();
var i=1;

//check if user selected AI
var isAi=true;
var count=0; 
var isGameOver = 0;

//check the depth chosen
var level=-1;
//two algorithms are used in this game
//alpha-beta pruning algorithm and minimax algorithm
//a variable algo is declared and is assigned 0 for minimax algorithm and 1 for alpha-beta pruning algorithm
var minimax = false;
var alphaBeta = false;
var algo = 1;

//Make squares
class Square extends React.Component {
    
    render() {
      return (
        
        <Button variant="outline-light" className="square" onClick={()=>this.props.onClick()} >
          {this.props.value}
        </Button>
       
        //onclick calls onclick in rendersquare
      );
    }
  }

  //Make Board
  class Board extends React.Component {
    constructor(props) {
        super(props);
        this.click=this.click.bind(this);
        this.state = {
          squares: Array(9).fill(null),
          player: true,
          checkAi : false,
          checkHuman:false,
        };
        
      }
     
      trackScore(s)
      {
        if(level==-1)
        {scores+=s;
        db.collection('user').where('username','==',username).get().then(doc=>{
          
        
            doc.docs.forEach(doc=>{
              if(doc.data().username==username)
              {var id=doc.id;}
              db.collection("user").doc(id.toString()).update({matches:matchplayed+1,score:scores})
              
            })
            
            
          })
        }
       
    }
      
    //saving states in square
      handleClick(i)
       {    
          //slice to copy the curernt state instead od modifying the exisiting array
           const squares = this.state.squares.slice();
           if (checkwinner(squares) || squares[i])
             return;

        //human vs human
         object=nexthuman(squares,this.state.player,i,isAi,object.computer);
         count++;
           //console.log(object.squares);
           const square=object.squares;
           //console.log(i);
           stack_undo.push(i);
           stack_undo.print();
           queue.push(i);
           this.setState({
               squares: square,
               player : object.player,
               
            }
            ,()=>{

              //AI vs human
              const squares2 = this.state.squares.slice();
                    if (checkwinner(squares2))
                      return;
            if(object.computer)
                {
                  count++; 
                  let j;
                   /*minmax algo
                   let j=findBestMove(this.state.squares,'O',level);

                   /alphabeta algo
                   let j=alphabeta_move(this.state.squares,'O',level);*/
                   if(algo == 1) {j=findBestMove(this.state.squares,'O',level);}
                   else if(algo == -1) {j=alphabeta_move(this.state.squares,'O',level);}
                  
                  squares[j] = 'O'; 
                 
                  stack_undo.push(j);
                  queue.push(j);
                  stack_undo.print();
                  this.setState({
                      squares: squares,
                      player : !this.state.player,
                    });
                    object.computer=!object.computer;
                    const squares1 = this.state.squares.slice();
                    if (checkwinner(squares1) || squares1[j])
                      return;

                }
              }  
            ); 
            
        }
        //play music after winning or losing for AI
        playAudio(winner) {
          if(winner==='O')
          {
            const audioEl = document.getElementsByClassName("audio-element")[0];
            audioEl.play();}
            else{
              const audioEl1 = document.getElementsByClassName("audio-element1")[0];
            audioEl1.play();
            }
        } 
        //play music after winning or loosing for human vs human
        play() {
          
            const win = document.getElementsByClassName("audio-element2")[0];
            win.play();}
            
        
  //to render each square
    renderSquare(i) {
      return <Square 
      value={this.state.squares[i]} 
      onClick={() => this.handleClick(i)} />;
    }

    click=(square)=>{
      
     this.setState(function() {
      return { squares:square };
      },()=>console.log(this.state.squares))
     
    
    }
  

  
    render() {
      //declare winner
        const winner = checkwinner(this.state.squares); 
          
        let status;    
         if(winner)
            {  
              isGameOver = 1;     
               
              if(!isAi)
             {status = 'Winner: ' + winner; this.play()}
             else if(winner==='O')
             {status = 'Winner: ' + 'Ai';this.playAudio(winner);if(!isGuest)this.trackScore(-100)}
             else  {status = 'Winner: ' + 'human';this.playAudio(winner);}
               } 
        
        else { 
          //console.log(count);
          if(count >=9 && isAi==true)
            {status = 'It\'s a tie';if(!isGuest)this.trackScore(100)}
            else if(count == 9 )
            status = 'It\'s a tie';
            
            else if(!isAi)
            status = 'Next player: ' + (this.state.player ? 'X' : 'O');  
            else  {status = 'Next player: ' + (this.state.player ? 'Human' : 'Ai');}
         }  

      return (
        <div >
          <audio className="audio-element">
          <source src={soundfile}></source>
          <source src={soundfile1}></source>
        </audio>
        <audio className="audio-element1">
           <source src={soundfile1}></source>
        </audio>
        <audio className="audio-element2">
            <source src={soundfile2}></source>
        </audio>
        
          {/* Buttons to choose */}
          <div>
            
            {/* to play againt AI */}
            <Button variant="outline-light" disabled={this.state.checkAi} className="checkAi" onClick={()=> 
            {
              isAi=true;
              
              this.setState({checkHuman:true})}}>vs Ai</Button>

              {/* to play human vs human */}
              <Button variant="outline-light" disabled= {this.state.checkHuman} className="checkhuman" onClick={()=> 
            {
              isAi=false;
              
              this.setState({checkAi:true})}}>vs Human</Button>

              {/* reset button */}
              <Button variant="outline-light" className="reset" onClick={()=>window.location.reload()}>Reset</Button>

            
            {/* hints playing against AI */}
            <Button variant="outline-light" className="suggestion" onClick={()=>{
              let i;
              if(algo == 1){
              i=findBestMove(this.state.squares,'O',-1);
              if(isAi)
              scores-=20;
              let row=(i-(i%3))/3+1;
              let col=(i%3)+1;
              alert(`Try row number ${row} and column number ${col} minimax`);}
              else if(algo == -1){
              i=alphabeta_move(this.state.squares,'O',-1);
              if(isAi)
              scores-=20;
              let row=(i-(i%3))/3+1;
              let col=(i%3)+1;
              alert(`Try row number ${row} and column number ${col} alpha-beta`);
              }
            }}>Hints</Button>
            

            {/* display the board */}
        </div>
        <div>
        <Button variant="outline-light" disabled={minimax} className="algo-checker" onClick={()=>
              {
                algo = 1;
                alphaBeta=true;
              }}>Minimax</Button>
        <Button variant="outline-light" disabled={alphaBeta} className="algo-checker" onClick={()=>
              {
                algo = -1;
                minimax=true;
              }}>alpha-beta</Button>
        </div>
        <div className="board">
          <div className="status" >{status}</div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
          </div>
          <div>
          <Button variant="outline-light" className = "undo_button" onClick={()=>
            {
              if(isAi == true){
              count = UndoRedo.undo_function(isAi, isGameOver, count, stack_undo, stack_redo, this.state.squares);
              this.setState({
                squares: this.state.squares,
              })
              scores-=10;
            }
              else{
                count = UndoRedo.undo_function(isAi, isGameOver, count, stack_undo, stack_redo, this.state.squares);
                this.setState({
                  squares: this.state.squares,
                  player: !this.state.player,
                })
              } 
            }}>Undo</Button>
            <Button variant="outline-light" className ="redo_button" onClick={()=>
            {
              if(isAi == true){
                count = UndoRedo.redo_function(isAi, stack_redo, stack_undo, count, this.state.squares, this.state.player);
                this.setState({
                  squares: this.state.squares,
                })
              }
              else{
                count = UndoRedo.redo_function(isAi, stack_redo, stack_undo, count, this.state.squares, this.state.player);
                this.setState({
                  squares: this.state.squares,
                  player: !this.state.player,
                })
              }
            }}>Redo</Button>
            <Button variant="outline-light" className="replay_button" onClick={()=>
            {
              var itemList = queue.returnItems();
              
              console.log(itemList);
              if(itemList.length == 0) alert("Play for Replay");
              var playerState = true;
              if(i==1)
              {itemList.reverse();this.setState({
                squares: Array(9).fill(null),
              },()=>{
              
              
              var square=this.state.squares.slice();
              if(itemList.length)
              {
                
                this.click(square);
                 
              console.log(this.state.squares);
                square[itemList[itemList.length-1]] = playerState?'X':'O';
                if(playerState == true) playerState = false;
                else playerState = true;
                itemList.pop();
                i++;
                
                     
          }             
            })}
            else{
              var square=this.state.squares.slice();
              if(itemList.length)
              {
                
                this.click(square);
                 
              console.log(this.state.squares);
                square[itemList[itemList.length-1]] = i%2?'X':'O';
                if(playerState == true) playerState = false;
                else playerState = true;
                itemList.pop();
                i++;
            }
            }}}>{i==1?"Replay":"Click for move "+i}</Button>
          </div>
        </div>
      );
    }
  }

  
  
  export default  class Game extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <h1 className="depth">Depth </h1>
            <p className="depth">If against Ai</p>
          <ButtonGroup className="mr-2" aria-label="First group">
          <Button variant="outline-light" className="level" onClick={()=>level=1}>1</Button>
          <Button variant="outline-light" className="level" onClick={()=>level=2}>2</Button>          
          <Button variant="outline-light" className="level" onClick={()=>level=3}>3</Button>          
          <Button variant="outline-light" className="level" onClick={()=>level=4}>4</Button>         
          <Button variant="outline-light" className="level" onClick={()=>level=-1}>Unlimited</Button>
          </ButtonGroup> 
          
                    
          </div>
        </div>
      );
    }
  }
 