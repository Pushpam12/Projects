let board = document.querySelector('.board');
let score_ele = document.querySelector('.score');
let highscore_ele = document.querySelector('.highScore');
let playArea = document.querySelector('.playArea')

let snakeArr = [{x:10,y:12}] ;
let applePos = {x:12, y:9};
let moveDirection = {x:0,y:0};
let dir = '';
let score = 0;
let speed = 9;
let lastPaintTime = 0;

let gridComputedStyle = window.getComputedStyle(board);
let noRows = gridComputedStyle.getPropertyValue('grid-template-rows').split(' ').length;
let noCols = gridComputedStyle.getPropertyValue('grid-template-columns').split(' ').length;

applePos = { x : Math.floor(noCols/2) - 3 , y: Math.floor(noRows/2) - 3 }
snakeArr = [{ x : Math.floor(noCols/2) + 2 , y: Math.floor(noRows/2) + 1 }]

let highscore = JSON.parse(localStorage.getItem('SnakeGame_highScore'));
// console.log(highscore);
if ( !highscore ){
    highscore = 0;
}
highscore_ele.textContent = highscore;

let eatingSound = new Audio('./assets/music/food.mp3');
let gameOverSound = new Audio('./assets/music/gameover.mp3');
let moveSound = new Audio('./assets/music/move.mp3');
let musicSound = new Audio('./assets/music/music.mp3');


// let game = setInterval(Snake,100);

function main(ctime) {
  window.requestAnimationFrame(main);
  // console.log(ctime)
  if((ctime - lastPaintTime)/1000 < 1/speed){
      return;
  }
  lastPaintTime = ctime;
  gameEngine();
}

let collisionCount = 0;
function gameEngine() {
    noRows = gridComputedStyle.getPropertyValue('grid-template-rows').split(' ').length;
    noCols = gridComputedStyle.getPropertyValue('grid-template-columns').split(' ').length;
    

    if (collision(noCols,noRows)){
      collisionCount++;
      if (collisionCount == 1){
        gameOverSound.play();
      }
      musicSound.pause();
      // alert(`Game Over.😵 \nScore : ${score_ele.textContent} \nPress any key to play again!`);
      myAlert(`<h2>Game Over 😵</h2>
                <b>Score : </b> ${score_ele.textContent}<br>
                Press any key to play again!`);
      moveDirection =  {x: 0, y: 0}; 
      score = 0; 
    }else{
      collisionCount = 0;
      musicSound.play();
    }
  
    // display the snake
    board.innerHTML = '';
    snakeArr.forEach((item,item_index)=>{
         let snakePart = document.createElement('div');
         snakePart.style.gridRowStart = item.y;
         snakePart.style.gridColumnStart = item.x;

         if(item_index != 0){
              snakePart.classList.add('snake')
         }
         else if(item_index == 0){
            snakePart.classList.add('head');
            snakePart.innerHTML = `<div class="eye ${dir}"><div></div><div></div></div>`
         }
         board.appendChild(snakePart)
    })

    // display apple
    let apple = document.createElement('div');
    apple.style.gridRowStart = applePos.y;
    apple.style.gridColumnStart = applePos.x;
    apple.innerHTML = '🐸';
    apple.classList.add('apple');
    board.appendChild(apple);

    if(! collision(noCols,noRows)){
         moveSnake();
    }
    
    // eat the apple -> score++, apple change, snake-> length++
    if ((snakeArr[0].x == applePos.x) && (snakeArr[0].y == applePos.y) ){
        eatingSound.play();
        score++;
        score_ele.textContent = score;
        if(score > highscore){
            highscore = score;
            localStorage.setItem('SnakeGame_highScore',JSON.stringify(highscore))
        };
        highscore_ele.textContent = highscore;
        snakeArr.unshift({x : snakeArr[0].x + moveDirection.x,
                          y : snakeArr[0].y  + moveDirection.y}); 
        let a = 3 ;
        let b = 15;
        applePos = {x: a +  Math.floor((noCols - 6) * Math.random()), 
                            y: a + Math.floor((noRows - 6) * Math.random()) };
    }
}

function moveSnake(){
    // move the snake
     for (let i = snakeArr.length - 2; i >= 0 ; i--) {
      snakeArr[i+1] = {...snakeArr[i]}
     }
     snakeArr[0].x += moveDirection.x;
     snakeArr[0].y += moveDirection.y;
}

function collision(noCols,noRows){
    // hits the wall
    if (snakeArr[0].x <= 1 || snakeArr[0].y <= 1 || snakeArr[0].x >= noCols || 
      snakeArr[0].y >= noRows ){
         return true
    }
    // hits itself
    for (let i = 2; i < snakeArr.length; i++) {
        if((snakeArr[0].x === snakeArr[i].x) && (snakeArr[0].y === snakeArr[i].y)){
          console.log(snakeArr);
            return true
        }  
    }
    return false
}

document.addEventListener('keydown',(e)=>{
     moveBtns(e.key)
})

let arrowBtns = document.querySelectorAll('.moveBtns button');
for (const btn of arrowBtns) {
  console.log(btn);
    btn.addEventListener('click'  , (e)=>{
        moveBtns(btn.value);
    })
};

function moveBtns(btn){
      moveSound.play();
      if( btn == 'ArrowUp'){
            moveDirection = { x: 0, y:-1}; dir = 'up'
      }
      else if( btn == 'ArrowDown'){
            moveDirection = { x: 0, y: 1}; dir = 'down'
      }
      else if( btn == 'ArrowLeft'){
            moveDirection = { x:-1, y: 0}; dir = 'left'
      }
      else if( btn == 'ArrowRight'){
            moveDirection = { x: 1, y: 0}; dir = 'right'
      }
}

window.requestAnimationFrame(main);
board.addEventListener('dblclick',()=>{
    //  console.log('yes');
     openFullscreen(playArea);
     if (window.innerWidth > 728 ){
          speed = 12;
     }
});

function myAlert(message) {
  let div = document.createElement("div");
  div.innerHTML = message;
  div.classList.add('msgBox');

  document.body.appendChild(div);
  moveDirection = {x:0, y:0};

  document.addEventListener('keydown',(e)=>{
      div.parentNode.removeChild(div);
      musicSound.play();
      snakeArr = [{ x : Math.floor(noCols/2) + 2 , y: Math.floor(noRows/2) + 1 }]
  })
  document.addEventListener('touchstart',()=>{
      div.parentNode.removeChild(div);
      musicSound.play();
      snakeArr = [{ x : Math.floor(noCols/2) + 2 , y: Math.floor(noRows/2) + 1 }]
  })
}

//Touch events -------------------
document.addEventListener("touchstart", handleTouchStart, { passive: false });
document.addEventListener("touchmove", handleTouchMove, { passive: false });

var xDown = null;
var yDown = null;

function getTouches(evt) {
  return (
    evt.touches || evt.originalEvent.touches // browser API
  ); // jQuery
}

function handleTouchStart(evt) {
  // evt.preventDefault();
  const firstTouch = getTouches(evt)[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

function handleTouchMove(evt) {
  // evt.preventDefault();
  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

 
  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
    //   document.querySelector("#swipeleft").classList.add("active");
          moveBtns('ArrowLeft');
    } else {
    //   document.querySelector("#swiperight").classList.add("active");
          moveBtns('ArrowRight');
    }
  } else {
    if (yDiff > 0) {
    //   document.querySelector("#swipeup").classList.add("active");
           moveBtns('ArrowUp');
    } else {
    //   document.querySelector("#swipedown").classList.add("active");
          moveBtns('ArrowDown');
    }
  }

  /* reset values */
  xDown = null;
  yDown = null;
}

//Fullscreen 
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

