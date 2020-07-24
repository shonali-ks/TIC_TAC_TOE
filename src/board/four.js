import React, { Component } from 'react';
import nexthuman from '../utils/humanvshuman';
import {checkwinnerFour} from '../utils/winner';
import findBestMove from '../utils/minmax';
import Stack from '../utils/stack';
import * as UndoRedo from '../utils/UndoRedo';

import './board.css'
import { Button } from 'react-bootstrap';
import soundfile2 from '../sounds/multi.mp3'


var object={
    icon : 'X',
    squares:null,
    player:true,
    computer:false,

}

var stack_undo = new Stack();
var stack_redo = new Stack();

//check if user selected AI
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
          squares: Array(16).fill(null),
          player: true,
        };
      }

    //saving states in square
      handleClick(i)
       {    
          //slice to copy the curernt state instead od modifying the exisiting array
           const squares = this.state.squares.slice();
           if (checkwinnerFour(squares) || squares[i])
             return;

        //human vs human
         object=nexthuman(squares,this.state.player,i,false,object.computer);
         count++;
           console.log(object.squares);
           const square=object.squares;
           console.log(i);
           stack_undo.push(i);
           stack_undo.print();
           this.setState({
               squares: square,
               player : object.player,
               
            }
            ,()=>{

              //AI vs human
              const squares2 = this.state.squares.slice();
                    if (checkwinnerFour(squares2))
                      return;
              }  
            ); 
            
        }

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
        const winner = checkwinnerFour(this.state.squares); 
          
        let status;    
         if(winner)
            {  
              isGameOver = 1;     
               
             {status = 'Winner: ' + winner; this.play()}
            
               } 
        
        else { 
          console.log(count);
           if(count == 16 )
            status = 'It\'s a tie';
            
            status = 'Next player: ' + (this.state.player ? 'X' : 'O');  
         }  

      return (
        <div >
          
        <audio className="audio-element2">
            <source src={soundfile2}></source>
        </audio>
        
          {/* Buttons to choose */}
          <div>
            


              {/* reset button */}
              <Button variant="outline-light"className="reset" onClick={()=>window.location.reload()}>Reset</Button>

            {/* hints playing against AI */}
            <Button variant="outline-light" className="suggestion" onClick={()=>{
              let i=findBestMove(this.state.squares,'O',-1);
              let row=(i-(i%4))/4+1;
              let col=(i%4)+1;
              alert(`Try row number ${row} and column number ${col} `);
            }}>Hints</Button>

            

            {/* display the board */}
        </div>
          <div className="status">{status}</div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            {this.renderSquare(3)}
          </div>
          <div className="board-row">
            {this.renderSquare(4)}
            {this.renderSquare(5)}
            {this.renderSquare(6)}
            {this.renderSquare(7)}
          </div>
          <div className="board-row">
            {this.renderSquare(8)}
            {this.renderSquare(9)}
            {this.renderSquare(10)}
            {this.renderSquare(11)}
          </div>
          <div className="board-row">
            {this.renderSquare(12)}
            {this.renderSquare(13)}
            {this.renderSquare(14)}
            {this.renderSquare(15)}
          </div>
          <div>
          <Button variant="outline-light" className = "undo_button" onClick={()=>
            {
          
                count = UndoRedo.undo_function(false, isGameOver, count, stack_undo, stack_redo, this.state.squares);
                this.setState({
                  squares: this.state.squares,
                  player: !this.state.player,
                })
              
            }}>Undo</Button>
           <Button variant="outline-light" className ="redo_button" onClick={()=>
            {
              
                count = UndoRedo.redo_function(false, stack_redo, stack_undo, count, this.state.squares, this.state.player);
                this.setState({
                  squares: this.state.squares,
                  player: !this.state.player,
                })
              
            }}>Redo</Button>
          </div>
        </div>
      );
    }
  }
  
  
  export default  class Game1 extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          </div>
      );
    }
  }