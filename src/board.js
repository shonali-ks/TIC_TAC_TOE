
import React, { Component } from 'react';
import nexthuman from './humanvshuman';
import checkwinner from './winner';
var object={
    icon : 'X',
    squares:null,
    player:true

}
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
  
  class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          squares: Array(9).fill(null),
          player: true,
        };
      }
    //saving states in square
      handleClick(i) {    
          //slice to copy the curernt state instead od modifying the exisiting array
           const squares = this.state.squares.slice();
           if (checkwinner(squares) || squares[i])
             return;
        //    squares[i] = this.state.player? 'X':'O';  
        //    console.log(squares);
        //    console.log(this.state.player);

        //    this.setState({
        //        squares: squares,
        //        player : !this.state.player,
        //     });

        //human vs human
         object=nexthuman(squares,this.state.player,i);
         console.log(object)
            squares[i] = object.icon;
           console.log(squares);
           

           this.setState({
               squares: object.squares,
               player : object.player,
            });  
            console.log(this.state.player);
           
        }

    renderSquare(i) {
      return <Square 
      value={this.state.squares[i]} 
      onClick={() => this.handleClick(i)} />;
    }
  
    render() {
        const winner = checkwinner(this.state.squares);    
        let status;    
        if (winner) {     
             status = 'Winner: ' + winner; 
               } 
        else { 
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');   
         }  
      return (
        <div >
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
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }
 

  