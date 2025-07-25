const board = document.getElementById ("game-board");
const scoreDisplay = document.getElementById("score");
const restartButton = document.getElementById("restart-button");

let score=0;
let tiles = [];
 
function intitializeGame(){
    hideGameOver();
    tiles = [];
    board.innerHTML='';
    for(let i=0;i<16;i++){
        let tile = document.createElement("div");
        tile.classList.add("tile");

        tile.dataset.value=0;
        tiles.push(tile);
        board.appendChild(tile);
    }
    addRandomTile();
    score=0;
    updateBoard();
    
}

function updateBoard(){
    tiles.forEach(tile => {
        const value = parseInt(tile.dataset.value);
        tile.textContent = value > 0 ? value : "";
        tile.className = 'tile';
        if (value > 0) tile.classList.add(`tile-${value}`)
        
    });
    scoreDisplay.textContent=score;

}

function move(direction){
    // console.log(direction);
    let moved = false;
    console.log(`\nMoving: ${direction}`);

    for ( let i=0;i<4;i++){
        let line = [];

        // console.log(`\nprocessing ${direction == "up" || direction == "down" ? "column" : "row"} ${i}`);


       for ( let j=0;j<4;j++){
        const index = direction=="up"||direction=="down"?i+j*4 : j+i*4
        const value = parseInt(tiles[index].dataset.value);
        if(value!==0) line.push(value);
        // line.push(value);
       }
 
       console.log(`Orginal Line: ${line}`);

       if(direction=="right"||direction=="down"){
        line.reverse();
       }

       let mergedLine = mergeLine(line);

       
       if(direction=="right"||direction=="down"){
        mergedLine.reverse();
       }


        for ( let j=0;j<4;j++){
        const index = direction=="up"||direction=="down"?i+j*4 : j+i*4
        const newValue = mergedLine[j]||0;

        if(tiles[index].dataset.value!=newValue){
            tiles[index].dataset.value = newValue;
            moved=true;
        }
        }

    }





    if(moved){
        console.log("Move Successful , adding a new tile");
        addRandomTile();
        updateBoard();
        if (checkGameOver()) {
        showGameOver();
    }
    }
    else{
        console.log("No tiles moved")
        if (checkGameOver()) {
        showGameOver();
    }
    }
}

function checkGameOver() {
    // 1. Check for any empty tile
    if (tiles.some(tile => tile.dataset.value === "0")) {
        return false; // Not game over if there is at least one empty tile
    }
    // 2. Check for possible merges horizontally or vertically
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const index = i * 4 + j;
            const currentValue = parseInt(tiles[index].dataset.value);
            // Check right neighbor
            if (j < 3) {
                const rightValue = parseInt(tiles[index + 1].dataset.value);
                if (currentValue === rightValue) return false;
            }
            // Check down neighbor
            if (i < 3) {
                const downValue = parseInt(tiles[index + 4].dataset.value);
                if (currentValue === downValue) return false;
            }
        }
    }
    return true; // No moves left and no merges possible
}


function showGameOver() {
    document.getElementById("game-over").style.display = "block";
}

function hideGameOver() {
    document.getElementById("game-over").style.display = "none";
}


// --- Burst Powerup ---

const burstButton = document.getElementById("burst-button");
let burstMode = false;

burstButton.addEventListener("click", () => {
    burstMode = true;
    burstButton.disabled = true;
    burstButton.textContent = "Select a tile...";
    board.style.cursor = "crosshair";
});

// Event listener for tiles (delegated, more robust)
board.addEventListener("click", (e) => {
    if (!burstMode) return;
    const target = e.target;
    if (target.classList.contains("tile")) {
        target.dataset.value = 0;
        updateBoard();
        burstMode = false;
        burstButton.textContent = "Burst a Tile";
        burstButton.disabled = true;     // Only one use per game
        board.style.cursor = "default";
        if (checkGameOver()) {
            showGameOver();
        }
    }
});

// OPTIONAL: Enable burst when you restart
function intitializeGame(){
    hideGameOver();
    tiles = [];
    board.innerHTML='';
    for(let i=0;i<16;i++){
        let tile = document.createElement("div");
        tile.classList.add("tile");
        tile.dataset.value=0;
        tiles.push(tile);
        board.appendChild(tile);
    }
    addRandomTile();
    score=0;
    updateBoard();
    // Enable burst again for each new game:
    burstButton.disabled = false;
    burstButton.textContent = "Burst a Tile";
    burstMode = false;
    board.style.cursor = "default";
}




function mergeLine(line){
    for(let i =0;i<line.length-1;i++){
        if(line[i]==line[i+1]){
            line[i]*=2;
            score+=line[i];
            line.splice(i+1,1);
        }
    }

    while(line.length<4){
        line.push(0);
    }

    return line;
}

document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            move("up");
            break
        case "ArrowDown":
            move("down");
            break;
        case "ArrowLeft":
            move("left");
            break;
        case "ArrowRight":
            move("right");
            break;
    }
})



function addRandomTile(){
    const emptyTiles = tiles.filter(tile => tile.dataset.value === "0");
    if(emptyTiles.length == 0 ) return ;
    const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    randomTile.dataset.value = Math.random()<0.9 ? 2 : 4 ;
}

intitializeGame();
restartButton.addEventListener("click",intitializeGame);

