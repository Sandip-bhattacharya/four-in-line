const board=document.getElementById("board") 
let isFirstPlayer = true;
const TOTAL_X =10;
const TOTAL_Y =10;
const FIRST_PLAYER_CLASS = 'player-one';
const SECOND_PLAYER_CLASS = 'player-two';
const stepsCombinations=[
  {side:'up', xStep:0 , yStep: -1, countSteps:0},
  {side:'down', xStep:0 , yStep: 1, countSteps:0},
  {side:'left', xStep: -1, yStep:0, countSteps:0},
  {side:'right', xStep: 1, yStep: 0, countSteps:0},
  {side:'up-left', xStep: -1, yStep: -1, countSteps:0},
  {side:'up-right', xStep: 1, yStep: -1, countSteps:0},
  {side:'down-left', xStep: -1, yStep: 1, countSteps:0},
  {side:'down-right', xStep: 1, yStep: 1, countSteps:0}
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
square.addEventListener("click",clickBox)
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
  if(!isValidEntry(currentOffset)){
   alert("Please fill from bottom")
   return
  }
  if(currentElement.classList.contains(FIRST_PLAYER_CLASS) ||
  currentElement.classList.contains(FIRST_PLAYER_CLASS)){
    return
  }


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
  resetSteps();
  const offssetArray = currentOffset.split(',');
  const offSetX = Number(offssetArray[0]);
  const offSetY = Number(offssetArray[1]);
  for(let i= 0; i< stepsCombinations.length; i++){
    if(validate(player,offSetX,offSetY,stepsCombinations[i])){
      return true;
    }
    if(validateMiddlePoint(stepsCombinations)){
      return true
    }
  }
  return false;
}

//validate if middle point is valid
function validateMiddlePoint(stepsCombinations){
let horizontal = 0
let vertical = 0
let diagonalLeft = 0
let diagonalRight = 0

stepsCombinations.forEach((item) => {
  if(item.side == 'left' || item.side == 'right'){
    horizontal = horizontal + item.countSteps
  }
  if(item.side == 'up' || item.side == 'down'){
    vertical = vertical + item.countSteps
  }
  if(item.side == 'up-left' || item.side == 'down-right'){
    diagonalLeft = diagonalLeft + item.countSteps
  }
  if(item.side == 'up-right' || item.side == 'down-left'){
    diagonalRight = diagonalRight + item.countSteps
  }
})
  if(horizontal >=3 || 
    vertical >=3 || 
    diagonalLeft >= 3 ||
     diagonalRight >=3){
    return true
  }
return false
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
    side.countSteps = side.countSteps + 1
  }
  return true;
}

//end the game and disable click
function endGame(player = ''){
  resetSteps();
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

//reset steps
function resetSteps(){
  stepsCombinations.map((item)=> {
    item.countSteps = 0 
  })
}

//validate fillup entry
function isValidEntry(currentOffset){
  const offssetArray = currentOffset.split(',');
  const offSetX = Number(offssetArray[0]);
  const offSetY = Number(offssetArray[1]);
  if(offSetY == 10){
    return true
  }
  for(let i = TOTAL_Y; i > offSetY; i--){
    if(!document.querySelector("[data-offset='"+offSetX+","+i+"']").classList.contains(FIRST_PLAYER_CLASS) &&
    !document.querySelector("[data-offset='"+offSetX+","+i+"']").classList.contains(SECOND_PLAYER_CLASS)){
      return false;
   }
  }
  return true  
}