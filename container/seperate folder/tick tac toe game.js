const board = document.getElementById("board");
const winnermessage = document.getElementById("winner-message");
const resetButton = document.getElementById("reset-button");
const displayXscore = document.getElementById("X-score");
const displayOscore = document.getElementById("O-score");
const displaydrawscore = document.getElementById("draw-score");
const turnDisplay = document.getElementById("turn-display");

resetButton.addEventListener("click", resetGame);

const boardState = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
]

let currentPlayer = "X";
let isgameover = false;
let Xscore = 0;
let Oscore = 0;
let drawscore = 0;
let iscomputermove = true;
function renderboard(boardState){
    board.innerHTML = "";
    for(let row = 0; row < 3; row++){
        for(let col = 0; col < 3; col++){
    const square = document.createElement("div");
    square.textContent = boardState[row][col]
    square.classList.add("square")
     square.dataset.row = row;
     square.dataset.col = col;
     square.addEventListener("click", (event)=>{
        handlesquareclick(event)
     })
        board.append(square);
        }
       
    }

}
function showgameover(message){
    winnermessage.textContent = message;
    winnermessage.classList.remove("hidden")
    resetButton.classList.remove("hidden1")
}
function handlesquareclick(event){
    const {row, col} = event.target.dataset
    const rows = Number(row);
    const cols = Number(col);
    
    if(isgameover){
        return;
    }
    if(currentPlayer !== "X"){
        return;
    }
    if(boardState[rows][cols] !== ""){
        return;
    }
    
    
        boardState[rows][cols] = currentPlayer;
        renderboard(boardState);
    
   
    if(checkwinnerfor("X")){
        isgameover = true;
       
             Xscore++;
        
        
        updatescoreboard();
         showgameover(`${currentPlayer} wins🥰 wow potential man!`);
         

         return;
    }
    if(checkdraw()){
        isgameover = true;
        drawscore++;
        updatescoreboard();
        showgameover("draw! bro can't even win in tick tac toe loser");
         
        return; 
    }
     switchturns();
    updateTurndisplay();

     setTimeout(() =>{
     if(iscomputermove){
        makecomputermove();
       if(checkwinnerfor("O")){
        isgameover = true;
       
        
             Oscore++;
        
        updatescoreboard();
         showgameover(`${currentPlayer} wins🥰 wow potential man!`);
         

         return;
    }
    if(checkdraw()){
        isgameover = true;
        drawscore++;
        updatescoreboard();
        showgameover("draw! bro can't even win in tick tac toe loser");
         
        return; 
    }
    }

   switchturns();
    updateTurndisplay();
    },1000)
     
     
}

function switchturns(){
     currentPlayer = (currentPlayer === "X") ? "O" : "X";
}

function updateTurndisplay(){
    turnDisplay.textContent = (currentPlayer === "X") ? "X turn" : "O turn";
}
function checkwinnerfor(player){
 

   for(let row = 0; row < 3; row++){
   if(boardState[row][0] === player &&
   boardState[row][1] === player &&
   boardState[row][2] === player){
   return player;
}
}

for(let col = 0; col < 3; col++){
    if(boardState[0][col] === player &&
       boardState[1][col] === player &&
       boardState[2][col] === player){
        return player;
    }
}

if(boardState[0][0] === player &&
   boardState[1][1] === player &&
   boardState[2][2] ===player){
    return player;
}

if(boardState[0][2] ===player &&
   boardState[1][1] === player &&
   boardState[2][0] === player){
    return player;
}
return null;
  }

function checkwinner(){
      const Xwinner = checkwinnerfor("X")

      if(Xwinner){
        return Xwinner;
      }

      const Owinner = checkwinnerfor("O")

      if(Owinner){
        return Owinner;
      }
   
    return null;
}
function checkdraw(){
    for(let row = 0; row < 3; row++){
        for(let col = 0; col < 3; col++){
            if(boardState[row][col] === ""){
                return false;
            }
        }
    }
    return true;
}
function updatescoreboard(){
    displayXscore.textContent = "scoreX: " + Xscore;
    displayOscore.textContent = "scoreO: " + Oscore;
    displaydrawscore.textContent = "scoredraw: " + drawscore;
}
function initializeGame(){
  renderboard(boardState);
  updatescoreboard();
  updateTurndisplay();
}
initializeGame();


function resetGame(){
    isgameover = false;
    currentPlayer = "X";
for(let row = 0; row < 3; row++){
    for(let col = 0; col < 3; col++){
     
        boardState[row][col] = "";
    
}
}
winnermessage.classList.add("hidden");
resetButton.classList.add("hidden1");
renderboard(boardState);
updateTurndisplay();
updatescoreboard();

}

function getavailablemoves(){
    const moves = []
    for(let row = 0; row < 3 ; row++){
        for(let col = 0; col < 3; col++){
            if(boardState[row][col] === ""){
                moves.push({row: row, col: col})
            }
        }
    }
 return moves
}

function findwinningmove(){
    const moves = getavailablemoves();
    if(moves.length === 0){
        return null;
    }
for(const move of moves){
 boardState[move.row][move.col] = "O";
 if(checkwinner()){
   boardState[move.row][move.col] = "";
   return move;
 }
 else{
      boardState[move.row][move.col] = "";
    continue;
 }
}
    return null;
}

function findblockingmove(){
    const moves = getavailablemoves();
    if(moves.length === 0){
        return null;
    }
    for(const move of moves){
      boardState[move.row][move.col] = "X";
      if(checkwinner()){
        boardState[move.row][move.col] = "";
        return move;
      }
      else{
        boardState[move.row][move.col] = "";
        continue;
      }
    }
    return null;
}


function makecomputermove(depth = 2){
    
    const moves = getavailablemoves();
     if(moves.length === 0){
        return null;
    }
   const ismaximizing = true;
    let bestscore = ismaximizing ? -Infinity : Infinity;
let bestmove = null;

for (const move of moves) {

    boardState[move.row][move.col] = "O";

    const score = minimax(
        depth - 1,
        !ismaximizing,
        -Infinity,
        Infinity
    );

    boardState[move.row][move.col] = "";

    if (score > bestscore) {
        bestscore = score;
        bestmove = move;
    }
}

boardState[bestmove.row][bestmove.col] = "O";
renderboard(boardState);

return;
}

function evaluateposition(){
    const winner = checkwinner();

    if(winner === "X"){
        return -1;
    }

    if(winner === "O"){
        return +1;
    }

    if(checkdraw()){
        return 0;
    }
    return null;
}

function minimax(depth, ismaximizingPlayer, alpha, beta){
    const positionscore = evaluateposition();
    if(positionscore !== null){
        return positionscore;
    }
    if(depth === 0){
        return 0;
    }
    const whosplayer = ismaximizingPlayer ? "O" : "X";

    const moves = getavailablemoves();
    if(moves.length === 0){
       return 0;
    }
    
    if(ismaximizingPlayer){
        let maxeval = -Infinity;
        for(const move of moves){
            boardState[move.row][move.col] = whosplayer;
           const evalscore =  minimax(depth - 1, false, alpha, beta)
            boardState[move.row][move.col] = "";
            maxeval = Math.max(maxeval, evalscore)
            alpha = Math.max(alpha, evalscore)
            if(beta <= alpha){
            break;
            }
        }
        return maxeval;
    }
    
    else{
        let mineval = Infinity;
        for(const move of moves){
            boardState[move.row][move.col] = whosplayer;
           const evalscore =  minimax(depth - 1, true, alpha, beta)
            boardState[move.row][move.col] = "";
            mineval = Math.min(mineval, evalscore)
            beta = Math.min(beta, evalscore)
            if(beta <= alpha){
            break;
            }
        }
        return mineval;
    }
    
}









