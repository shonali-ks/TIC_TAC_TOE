
export function undo_function(isAi, isGameOver, count, stack_undo, stack_redo, squares){
    if(isAi===true){
        if(isGameOver === 1) alert("Game Over");
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
        if(temp1 !== -1 && temp2 != -1){
        squares[temp1]=null;
        squares[temp2]=null;
        /*this.setState({
          squares: this.state.squares,
        });*/
        count -= 2;
        }}
      }
      } else{
        if(isGameOver === 1) alert("Game Over");
        else{
        if(count >= 9) alert("Game Over");
        else{
        let temp;
        temp = stack_undo.pop();
        stack_redo.push(temp);
        //console.log(temp);
        if(temp !== -1){
        squares[temp] = null;
        //console.log(this.state.player);
        /*this.setState({
          squares: this.state.squares,
          player: !this.state.player,
        });*/
        count -= 1;
        }
      }}
    }
    return count;
};

export function redo_function(isAi, stack_redo, stack_undo, count, squares, player){
    if(isAi){
        let temp1 = stack_redo.pop();
        let temp2 = stack_redo.pop();
        if(temp1 !== -1 && temp2 !== -1){
          stack_undo.push(temp1);
          stack_undo.push(temp2);
          squares[temp1] = 'X';
          squares[temp2] = 'O';
          /*this.setState({
            squares: this.state.squares,
          })*/
          count += 2;
        }
      }
      else{
        let temp = stack_redo.pop();
        if(temp !== -1){
        stack_undo.push(temp);
        console.log(temp);
        //console.log(this.state.player);
        squares[temp] = player?'X':'O';
        /*this.setState({
          squares: this.state.squares,
          player: !this.state.player,
        });*/
       count += 1;
      }
      }
    return count;
};