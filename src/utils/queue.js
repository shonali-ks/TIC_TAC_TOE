
class Queue{
    constructor(){
      this.items = [];
      this.top = 0;
      this.back=0;
    }
    push(element){
      this.items[this.back] = element;
      this.back += 1;
    }
    pop(){
      if(this.top == this.back){
        alert("Select your square before you call me");
        return -1;
      } else{
        this.top = this.top+1;
        return this.items.pop()
      }
    }
    print(){
      if(this.top == 0)
      {
        alert("enter");
      }
      for(let i = 0; i < this.back; i++){
        console.log(this.items[i]);
      }
    }
    returnItems(){
      return this.items;
    }
  };

  export default Queue;