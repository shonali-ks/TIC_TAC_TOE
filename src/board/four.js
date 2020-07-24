import React from 'react';
import nexthuman from '../utils/humanvshuman';
import {checkwinnerFour} from '../utils/winner';
import findBestMove from '../utils/minmax';
import Stack from '../utils/stack';
import * as UndoRedo from '../utils/UndoRedo';
import Queue from '../utils/queue';

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
var queue =new Queue();

//check if user selected AI
var count=0; 
var isGameOver = 0;
let i=1;

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
        this.click=this.click.bind(this);
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
           queue.push(i);
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
  
    click=(square)=>{
      
      this.setState(function() {
       return { squares:square };
       },()=>console.log(this.state.squares))
      
     
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
           if(count === 16 )
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
            <Button variant="outline-light" className="replay_button" onClick={()=>
            {
              var itemList = queue.returnItems();
              
              console.log(itemList);
              if(itemList.length === 0) alert("Play for Replay");
              if(i===1)
              {itemList.reverse();this.setState({
                squares: Array(9).fill(null),
              },()=>{
              var square=this.state.squares.slice();
              if(itemList.length)
              {
                this.click(square);
                square[itemList[itemList.length-1]] = i%2?'X':'O';
                itemList.pop();
                i++;                    
          }             
            })}
            else{
              var square=this.state.squares.slice();
              if(itemList.length)
              {
                this.click(square);
                square[itemList[itemList.length-1]] = i%2?'X':'O';
                itemList.pop();
                i++;
            }
            }}}>{i===1?"Replay":"Click for move "+i}</Button>
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