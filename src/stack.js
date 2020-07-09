import React, {Component} from 'react';

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

  export default Stack;


