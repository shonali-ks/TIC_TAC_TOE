import React, { Component } from "react"
import './App.css';
import Firebase from './firebase/auth';

class App extends Component {
 
  render(){
    return (
    <div className="App">
      <Firebase/>     
    </div>
    )
}
}

export default App;
