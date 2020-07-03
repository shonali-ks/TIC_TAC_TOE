
import React, { Component } from 'react';
import nexthuman from './humanvshuman';
import checkwinner from './winner';
import findBestMove from './ai';
import './board.css'
var object={
    icon : 'X',
    squares:null,
    player:true,
    computer:false,

}

var isAi=true;
var count=0; 
// class Check extends React.Component {
    
//     render() {
//       return (
//         <div>
//             <button className="checkAi" onClick={()=> (location.reload(),isAi=true)}>Ai</button>
//             <button className="checkAi" onClick={()=> (location.reload(),isAi=false)}>Human</button>
//         </div>
        
       
//       );
//     }
//   }

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
        
        
         object=nexthuman(squares,this.state.player,i,isAi,object.computer);
         
            //squares[i] = 'X';
           console.log(object.squares);
           const square=object.squares;

           this.setState({
               squares: square,
               player : object.player,
            },()=>{
            if(object.computer)
                {
                // console.log("in ai");
                  //console.log(this.state.squares);
                  
                    let j=findBestMove(this.state.squares,'O');
                    squares[j] = 'O';  
                  //console.log(squares);
                  //console.log(this.state.player);

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
            //console.log(this.state.player);
            
           // console.log(object.computer)
        
        
           
        }

    renderSquare(i) {
      return <Square 
      value={this.state.squares[i]} 
      onClick={() => this.handleClick(i)} />;
    }
  
    render() {
        const winner = checkwinner(this.state.squares); 
          count++;
          console.log(count);
        let status;    
         if(winner)
            {     
             status = 'Winner: ' + winner; 
               } 
        
        else { 
            if(count >= 10)
            status = 'It\'s a tie';
            else if(!isAi)
            status = 'Next player: ' + (this.state.player ? 'X' : 'O');  
            else  status = 'Next player: ' + (this.state.player ? 'Human' : 'Ai');
         }  
      return (
        <div >
          <div>
            <button className="checkAi" onClick={()=> (isAi=true,this.state)}>Ai</button>
            <button className="checkAi" onClick={()=> (isAi=false,this.state)}>Human</button>
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
        </div>
      );
    }
  }
  
  export default  class Game extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
              {/* <Check/> */}
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
 

  