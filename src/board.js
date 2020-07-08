import React, { Component } from 'react';
import nexthuman from './humanvshuman';
import checkwinner from './winner';
import findBestMove from './ai';
import './board.css'
import soundfile from './sounds/humanFail.mp3'
import soundfile1 from './sounds/humanPass.mp3'
import soundfile2 from './sounds/multi.mp3'

var object={
    icon : 'X',
    squares:null,
    player:true,
    computer:false,

}

class Stack{
  constructor(){
    this.items = [];
    this.top = 0;
  }
  push(element){
    this.items[this.top] = element;
    this.top += 1;
  }
  pop(){
    if(this.top == 0){
      alert("Select your square before you call me");
      return -1;
    } else{
      this.top = this.top-1;
      return this.items.pop()
    }
  }
  print(){
    if(this.top == 0)
    {
      alert("enter");
    }
    for(let i = 0; i < this.top; i++){
      console.log(this.items[i]);
    }
  }
};

var stack_undo = new Stack();
var stack_redo = new Stack();

//check if user selected AI
var isAi=true;
var count=0; 
var isGameOver = 0;

//check the depth chosen
var level=-1;

//Make squares
class Square extends React.Component {
    
    render() {
      return (
        
        <button className="square" onClick={()=>this.props.onClick()} >
          {this.props.value}
        </button>
       
        //onclick calls onclick in rendersquare
      );
    }
  }

  //Make Board
  class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          squares: Array(9).fill(null),
          player: true,
          checkAi : false,
          checkHuman:false,
         
        };
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
           console.log(object.squares);
           const square=object.squares;
           console.log(i);
           stack_undo.push(i);
           //stack_undo.print();
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
                  let j=findBestMove(this.state.squares,'O',level);
                  squares[j] = 'O'; 
                 
                  stack_undo.push(j);
                  //stack_undo.print();
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
        //play music after winning or loosing for AI
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
             {status = 'Winner: ' + 'Ai';this.playAudio(winner);}
             else  {status = 'Winner: ' + 'human';this.playAudio(winner);}
               } 
        
        else { 
          console.log(count);
          if(count >=9 && isAi==true)
            status = 'It\'s a tie';
            else if(count == 9 )
            status = 'It\'s a tie';
            
            else if(!isAi)
            status = 'Next player: ' + (this.state.player ? 'X' : 'O');  
            else  status = 'Next player: ' + (this.state.player ? 'Human' : 'Ai');
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
            <button disabled={this.state.checkAi} className="checkAi" onClick={()=> 
            {
              isAi=true;
              
              this.setState({checkHuman:true})}}>vs Ai</button>

              {/* to play human vs human */}
            <button disabled= {this.state.checkHuman} className="checkhuman" onClick={()=> 
            {
              isAi=false;
              
              this.setState({checkAi:true})}}>vs Human</button>

              {/* reset button */}
            <button className="reset" onClick={()=>window.location.reload()}>Reset</button>

            {/* hints playing against AI */}
            <button  className="suggestion" onClick={()=>{
              let i=findBestMove(this.state.squares,'O',-1);
              let row=(i-(i%3))/3+1;
              let col=(i%3)+1;
              alert(`Try row number ${row} and column number ${col} `);
            }}>Hints</button>

            {/* UNDO */}
            

            {/* display the board */}
        </div>
          <div className="status">{status}</div>
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
          <div>
            <button className="undo-button" onClick={()=>
            {
              if(isAi==true){
                if(isGameOver == 1) alert("Game Over");
                else{
                if(count >= 10) alert("Game Over");
                else{
                let temp1, temp2;
                temp1 = stack_undo.pop();
                stack_redo.push(temp1);
                temp2 = stack_undo.pop();
                stack_redo.push(temp2);
                console.log(temp1);
                console.log(temp2);
                if(temp1 != -1 && temp2 != -1){
                this.state.squares[temp1]=null;
                this.state.squares[temp2]=null;
                this.setState({
                  squares: this.state.squares,
                });
                count -= 2;}}
              }
              } else{
                if(isGameOver == 1) alert("Game Over");
                else{
                if(count >= 9) alert("Game Over");
                else{
                let temp;
                temp = stack_undo.pop();
                stack_redo.push(temp);
                //console.log(temp);
                if(temp != -1){
                this.state.squares[temp] = null;
                //console.log(this.state.player);
                this.setState({
                  squares: this.state.squares,
                  player: !this.state.player,
                });
                count -= 1;
                }
              }}
            }
            }}>Undo</button>
          </div>
          <div>
            <button className="redo-button" onClick={()=>
            {
              if(isAi){
                let temp1 = stack_redo.pop();
                let temp2 = stack_redo.pop();
                if(temp1 != -1 && temp2 != -1){
                  stack_undo.push(temp1);
                  stack_undo.push(temp2);
                  this.state.squares[temp1] = 'X';
                  this.state.squares[temp2] = 'O';
                  this.setState({
                    squares: this.state.squares,
                  })
                  count += 2;
                }
              }
              else{
                let temp = stack_redo.pop();
                if(temp != -1){
                stack_undo.push(temp);
                console.log(temp);
                console.log(this.state.player);
                this.state.squares[temp] = this.state.player?'X':'O';
                this.setState({
                  squares: this.state.squares,
                  player: !this.state.player,
                });
               count += 1;
              }
              }
            }}>Redo</button>
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
            <h1>Depth </h1>
            <p>If against Ai</p>
          <button className="level" onClick={()=>level=1}>1</button>
          <button className="level" onClick={()=>level=2}>2</button>
          <button className="level" onClick={()=>level=3}>3</button>
          <button className="level" onClick={()=>level=4}>4</button>
          <button className="level" onClick={()=>level=-1}>Unlimited</button>
            
          </div>
        </div>
      );
    }
  }