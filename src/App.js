import React, { Component } from "react"
import './App.css';
import Firebase from './firebase/auth';
import Rules from './rules'
import { Button } from 'react-bootstrap';
import Game1 from '../src/board/four'

class App extends Component {
 state={
  game1:false
 }
  render(){
    return (
    <div className="App">
      <Rules/>
      
      <Firebase/> 
      <div className="but">
      <Button className="but1" variant="outline-light" onClick={()=>{this.setState({game1:!this.state.game1})}}>Play 4*4 human vs human!
        </Button>
        </div> 
        
      {this.state.game1?<div className="games"><Game1/></div>:null}
      </div>

    
    )
}
}

export default App;
