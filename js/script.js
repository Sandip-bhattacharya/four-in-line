const board=document.getElementById("board") 
let isFirstPlayer = true;
const TOTAL_X =10;
const TOTAL_Y =10;
const FIRST_PLAYER_CLASS = 'player-one';
const SECOND_PLAYER_CLASS = 'player-two';
const stepsCombinations=[
  {side:'up', xStep:0 , yStep: -1},
  {side:'down', xStep:0 , yStep: 1},
  {side:'left', xStep: -1, yStep:0},
  {side:'right', xStep: 1, yStep: 0},
  {side:'up-left', xStep: -1, yStep: -1},
  {side:'up-right', xStep: 1, yStep: -1},
  {side:'down-left', xStep: -1, yStep: 1},
  {side:'down-right', xStep: 1, yStep: 1}
]
document.addEventListener("DOMContentLoaded", loadDOM)

//load board
function loadDOM(){ 
board.innerHTML='';
document.getElementById('won-player').innerHTML='';
isFirstPlayer = true;
createBoard(); 
let squares =document.querySelectorAll(".board div"); 
Array.from(squares).forEach(square=>{ 
square.addEventListener("click",clickBox, {once:true})
});
}

// createBoard function
function createBoard(){ 
for(let y=1;y<=TOTAL_Y;y++){ 
  for(let x=1;x<=TOTAL_X;x++){
    const div =document.createElement("div") 
    div.setAttribute("data-offset", x+','+y)
    div.className = "square"
    board.appendChild(div) 
  }
} 
}

//clickBox function
function clickBox(e){ 
 const currentElement = e.target;
 const currentOffset = currentElement.getAttribute('data-offset')
 const currentClass = (isFirstPlayer) ? FIRST_PLAYER_CLASS : SECOND_PLAYER_CLASS;
 isFirstPlayer =  !(isFirstPlayer);
 currentElement.classList.add(currentClass);
   //check if won
   if(checkWon(currentClass,currentOffset)){
     alert('won!');
     endGame(currentClass)
     return
   }
   if(isDraw()){
    alert('draw!');
    endGame()
    return
   }
}

//check own function
function checkWon(player, currentOffset){
  const offssetArray = currentOffset.split(',');
  const offSetX = Number(offssetArray[0]);
  const offSetY = Number(offssetArray[1]);
  const validateSides= ['up','down','left','right',
  'up-left','up-right','down-left','down-right'];
  for(let i= 0; i< stepsCombinations.length; i++){
    if(validate(player,offSetX,offSetY,stepsCombinations[i])){
      return true;
    }
  }
  return false;
}

//validate function 
function validate(player, offsetX, offsetY,side){
  let x = offsetX;
  let y = offsetY;
  for(i=1; i<4; i++){
    x = x + (side.xStep)
    y = y + (side.yStep)

    /**validate if the offset is less minimum 
    **value 0 or grater than maximum value 10
    */
    if(x > TOTAL_X || x < 1 || y < 1 || y > TOTAL_Y){
     return false;
    }
     //validate if current player not exist in next offset
    if(!document.querySelector("[data-offset='"+x+","+y+"']").classList.contains(player)){
       return false;
    }
  }
  return true;
}

//end the game and disable click
function endGame(player = ''){
  document.querySelectorAll(".board div").forEach(square=>{ 
    square.removeEventListener("click",clickBox)
    })
    if(player){
      document.getElementById('won-player').innerHTML = player +" won the match!";
    } 
}

//draw match
function isDraw(){
  return Array.from(document.querySelectorAll(".board div")).every(square=>
    square.classList.contains(FIRST_PLAYER_CLASS) 
    || square.classList.contains(SECOND_PLAYER_CLASS))
}