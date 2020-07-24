let max_depth;
const getEmptyCells = (squares) => {
    return squares
      .map((val, idx) => [val, idx])
      .filter(item => item[0] === null);
  }
  
  const isMoveLeft = (squares) => {
    const emptyCells = getEmptyCells(squares);
    return emptyCells.length > 0;
  }
const utility = (squares, ai) => {
    const lines = [
      [0, 1, 2], 
      [3, 4, 5], 
      [6, 7, 8], 
      [0, 3, 6], 
      [1, 4, 7], 
      [2, 5, 8], 
      [0, 4, 8], 
      [2, 4, 6]  
    ];
  
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
  
      if (squares[a] !== null && squares[a] === squares[b] && squares[a] === squares[c]) {
        if (squares[a] === ai) return 10;
        return -10;
      }
    }
  
    return 0;
  }
const minimax = (squares, depth, ai, isMax) => {
    const score = utility(squares, ai);
  
    // If Maximizer has won the game return his/her evaluated score 
    if (score === 10) return score - depth;
  
    // If Minimizer has won the game return his/her evaluated score 
    if (score === -10) return score + depth;
  
    // If there are no more moves and no winner then it is a tie 
    if (!isMoveLeft(squares)) return 0;
  
    const lengthGrid = squares.length;
    let best;
  
    // If this maximizer's move 
    if (isMax) {
      best = -Infinity;
  
      for (let i = 0; i < lengthGrid; i++) {
        const cell = squares[i];
  
        if (cell === null) {
          // Make a move
          const next= squares.slice();
          next[i]=ai;
  
          // Call minimax recursively and choose the maximum value
          best = Math.max(best, minimax(next, depth + 1, ai, !isMax));
          
          if(max_depth === depth) break;
        }
      }
    } else {
      best = Infinity;
  
      for (let i = 0; i < lengthGrid; i++) {
        const cell = squares[i];
  
        if (cell === null) {
          // Make a move
          const next= squares.slice();
          next[i]='X';  
          // Call minimax recursively and choose the minimum value
          best = Math.min(best, minimax(next, depth + 1, ai, !isMax));
          if(max_depth === depth) break;
        }
      }
    }
  
    return best;
  }
 
 const findBestMove = (squares, ai, level) => {
    max_depth = level;
    let bestVal = -Infinity;
    let bestMove = null;
   
    const lengthGrid = squares.length;
  
    for (let i = 0; i < lengthGrid; i++) {
      const cell = squares[i];

      if (cell === null) {
        // Make a move
        const next= squares.slice();
        next[i]=ai; 

         
        let boo;
        if(ai==='X')
         boo=true;
        else boo = false;
        const moveVal = minimax(next, 0, ai, boo);
          if (moveVal > bestVal) {
          bestVal = moveVal;
          bestMove = i;
        }
      }
    }
  
    return bestMove;
  }
  export default findBestMove;