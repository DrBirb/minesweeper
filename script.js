    const INPUTS  = document.querySelectorAll("input"); // GLOBAL VAR/CONST
    let isEnded = false; // GLOBAL VAR/CONST
INPUTS.forEach(inp => {
    inp.addEventListener("input", function(){
        if (inp.id == "rows") {
            document.getElementById("rows__display").innerHTML = "Rows: " + inp.value;
        }
        if (inp.id == "cols") {
            document.getElementById("cols__display").innerHTML = "Cols: " + inp.value;
        }
        if (inp.id == "mines") {
            document.getElementById("mines__display").innerHTML = "Mines: " + inp.value;
        }
        document.getElementById("mines").setAttribute("max", (document.getElementById("rows").value * document.getElementById("cols").value)*3/10);
        document.getElementById("mines__display").innerHTML = "Mines: " + document.getElementById("mines").value;
    })
});

    const ROWS = document.getElementById("rows"); // GLOBAL VAR/CONST
    const COLS = document.getElementById("cols"); // GLOBAL VAR/CONST
    const MINES = document.getElementById("mines"); // GLOBAL VAR/CONST
    const GAMEBOARD = document.querySelector(".gameboard"); // GLOBAL VAR/CONST
    const sqArray = []; // GLOBAL VAR/CONST
    let mineCounter; // GLOBAL VAR/CONST

function resetTabDisplay(mines) {
    document.querySelector(".tab__mineCounter").innerHTML = "M: " + mines;
    document.querySelector(".tab__timer").innerHTML = "T: 0";
    time = 0;
}
function resetGameState() {
    clearInterval(timerint);
    // $(".gameboard").empty();
    document.querySelector(".gameboard").innerHTML = "";
    isEnded = false;
    isStarted = false;
    sqArray.length = 0;
    mineCounter = MINES.value;
}
document.querySelector(".menu__start").addEventListener("click", start);
function start() {
    mineCounter = MINES.value;
    resetTabDisplay(MINES.value)
    setSize();
    setGrid();
    createSquareObjects();
    changeDisplay();
};
document.querySelector(".tab__exit").addEventListener("click", exit);
function exit() {
    changeDisplay();
    resetGameState();
    document.querySelector("#end").style.display = "";
    document.querySelector("#end").close();
}
document.querySelector(".tab__restart").addEventListener("click", restart);
function restart() {
    resetGameState();
    clearInterval(timerint);
    resetTabDisplay(MINES.value);
    createSquareObjects();
    document.querySelector("#end").style.display = "";
    document.querySelector("#end").close();
}
function changeDisplay() {
    const MENU = document.querySelector(".menu");
    const MAIN = document.querySelector(".main");
    if (MENU.style.display == "none") {
        MENU.style.display = "block";
        MAIN.style.display = "none";
    }else{
        MENU.style.display = "none";
        MAIN.style.display = "block";
    }
};
let size;
function setSize() {
    let gmbrd;
    window.innerHeight < 1144 ? gmbrd = innerHeight - 145 : gmbrd = 1000;
    COLS.value > ROWS.value ? size = gmbrd/COLS.value : size = gmbrd/ROWS.value;
    document.querySelector(".gameboard").style.fontSize = size * 2/3 + "px";
}

function setGrid() {
    GAMEBOARD.style.gridTemplateColumns = "repeat(" + COLS.value + "," + size +"px)";
}    
function createSquareObjects() {
    class square {
        constructor(id, content, status, ox, oy) {
            this.id = id;
            this.content = content;
            this.status = status;
            this.ox = ox;
            this.oy = oy;
        }
            get displayContent() {
                this.dpContent();
            }

            dpContent() {
                if (this.content === "mine" && this.status === "flag") {
                    document.getElementById(this.id).style.borderColor = "green";
                }
                if (this.status === "flag") {
                    return
                }
                this.status = true;
                if (this.content === "mine") {
                    document.getElementById(this.id).innerHTML = "<img src='rsc/rangeMineThumb.svg' width="+(size-(size/5))+" height="+(size-(size/5))+">";
                }else if (this.content === 0) {
                    document.getElementById(this.id).innerHTML = "";
                }else {
                    document.getElementById(this.id).innerHTML = this.content;
                    numberPaint(this);
                }
            }
        
    }

    let x = 1, y = 1, z = 1;

    for (let i = 0; i < ROWS.value; i++) {
        for (let i = 0; i < COLS.value; i++) {
            let block = document.createElement("div");
            block.id = z;
            block.style.width = size + "px";
            block.style.height = size + "px";
            block.style.borderWidth = size/10 + "px";
            block.classList.add("unrevealed");
            GAMEBOARD.appendChild(block);  
            sqArray.push(new square(z, 0, false, x, y));
            x++, z++;
        }
        y++
        x = 1;
    }

}
function numberPaint(obj) {
    if (isEnded) {
        return;
    }
    let div = document.getElementById(obj.id);
    switch (obj.content) {
        case 1:
            div.classList.add("one");
            break;
        case 2:
            div.classList.add("two");
            break;
        case 3:
            div.classList.add("three");
            break;
        case 4:
            div.classList.add("four");
            break;
        case 5:
            div.classList.add("five");
            break;
        case 6:
            div.classList.add("six");
            break;
        case 7:
            div.classList.add("seven");
            break;
        case 8:
            div.classList.add("eight");
            break;
        default:
            console.log("ERROR --- unable to paint; wrong content;")
            break;
    }
}
    let isStarted; // GLOBAL VAR/CONST
    let timerint; // GLOBAL VAR/CONST
GAMEBOARD.addEventListener("click", firstclick);
function firstclick(event) {
    if (isStarted) {
        return
    }
    let zero = sqArray.find(obj => {return obj.id == event.target.id});
    insertMines(zero);
    insertNumbers();
    isStarted = true;
    timerint = setInterval(timer, 1000);
}
    let time = 0; // GLOBAL VAR/CONST
function timer() {
    time++;
    document.querySelector(".tab__timer").innerHTML = "T: " + time;
};
function insertMines(zero) {
    let nSquares = ROWS.value * COLS.value;
    let nMines = MINES.value;
    let i;
    let x;
    let y; 
    for (y = zero.oy - 1; y < zero.oy+2; y++) {
            for (x = zero.ox - 1; x < zero.ox+2; x++) {
                if (x <= 0 || x > COLS.value) {
                    continue;
                } else if (y <= 0 || y > ROWS.value) {
                    continue;
                } else {
                    nSquares--;
                }
            }     
        }
    arrayLoop:
    for (i = 0; i < sqArray.length; i++) {
        for (y = zero.oy - 1; y < zero.oy+2; y++) {
            for (x = zero.ox - 1; x < zero.ox+2; x++) {
                if(sqArray[i].ox === x && sqArray[i].oy === y){
                    continue arrayLoop;
                }
            }     
        }
        if((nMines / nSquares) < Math.random()) {
            nSquares --;
        }
        else {   
            sqArray[i].content = "mine";
            nMines--;
            nSquares--;
        }
    }
}
function insertNumbers() {
    sqArray.forEach(el => {
        if(el.content !== "mine") {return}
        let iY = el.oy - 1;     // Sibling Y index: -1 to +1 
        for (iY; iY < el.oy+2; iY++) {
            let iX = el.ox - 1;     // Sibling X index: -1 to +1
            if (iY <= 0 || iY > ROWS.value) {continue}
            for (iX; iX < el.ox+2; iX++) {
                if(iX <= 0 || iX > COLS.value) {continue}
                let sibling = sqArray.find(obj => {return obj.ox === iX && obj.oy === iY});// Sibling found by iY and iX 
                if(sibling.content != "mine") {
                    sibling.content += 1;
                }
            }
        }
    });
}

GAMEBOARD.addEventListener('contextmenu', function(event) { // --------------- Event Listener <RMB>
    event.preventDefault();
    // console.log(instance.getTransform());
    let square = sqArray[(event.target.id - 1)];
    if (!isStarted || isEnded || square.status === true) {
        return;
    }
    
    switch (square.status) {
        case false:
            document.querySelector(".tab__mineCounter").innerHTML = "M: " + --mineCounter;
            square.status = "flag";
            event.target.innerHTML = "P";
            break;
        case "flag":
            document.querySelector(".tab__mineCounter").innerHTML = "M: " + ++mineCounter;
            square.status = "?";
            event.target.innerHTML = "?";
            break;
        case "?":
            square.status = false;
            event.target.innerHTML = "";
            break;
        default:
            event.target.innerHTML = "ER";
            break;
    }
    tracker();
    return false;
}, false);

GAMEBOARD.addEventListener("click", reveal); // --------------- Event Listener <LMB>
function reveal(event) {
    let square;
    
    if (event.id === undefined) {   // if param === onclick event 
        square = sqArray[(event.target.id - 1)]; 
        if(square.status === true) {
            fastReveal(square);
        }
    }else {
        square = event;
    }
    if (isEnded || square.status === "flag" || square.status === "?") {
        return;
    }
    if(square.status === true) {
        return;
    }
    let div = document.getElementById(square.id);

    if (square.content === "mine") {
        clearInterval(timerint);    // stop the timer
        isEnded = true;
        sqArray.forEach(element => {
            element.displayContent;
        });
        document.getElementById(square.id).style.borderColor = "red";
        openModal("You lost");
        document.querySelector("#end").style.display = "flex";
    } 
    else {
        div.classList.remove("unrevealed");
        div.classList.add("revealed");
        square.displayContent;
        document.getElementById(square.id).style.borderWidth = size/10 + "px 0px 0px " + size/10 + "px"
        if (square.content == 0) {
            revealSiblings(square);
        }
    }
    tracker();
};
function fastReveal(square) {
    const siblings = [];    // Sibling - adjecent square
    let iY = square.oy - 1;
    for (iY; iY < square.oy+2; iY++) {
        let iX = square.ox - 1;
        if (iY <= 0 || iY > ROWS.value) {continue}
        for (iX; iX < square.ox+2; iX++) {
            if(iX <= 0 || iX > COLS.value) {continue}
            siblings.push(sqArray.find(obj => {return obj.ox == iX && obj.oy == iY}));
        }
    }
    let siblingMines = siblings.filter(obj => {return obj.content === "mine"});   // Siblings with mines
    let siblingFlags = siblings.filter(obj => {return obj.status === "flag"});    // Flagged siblings
    
    if (siblingMines.length == siblingFlags.length) {
        for (let i = 0; i < siblingMines.length; i++) {
            const element = siblingMines[i];
            if (element.status != "flag") {
                reveal(element);
            }else {
                for (let i = 0; i < siblings.length; i++) {
                    const element = siblings[i];
                    if (element.content != "mine" && element.status != true) {
                        reveal(element);
                    }
                }
            }
            
        }
        
        //     for (let i = 0; i < siblings.length; i++) {
        //         console.log(`Loop`);
        //         const element = siblings[i];
        //         if (element.content != "mine" && element.status != true) {
        //             console.log(`Loop IF ELSE`);
        //             reveal(element);
        //         }else if (element.status != "flag") {
        //             console.log(`Loop IF`);
        //             reveal(element);
        //         }
            
        // }
    }
}

function revealSiblings(square) {
    let iY = square.oy - 1;
    for (iY; iY < square.oy+2; iY++) {
        let iX = square.ox - 1;     // Sibling X index: -1 to +1
        if (iY <= 0 || iY > ROWS.value) {continue}
        for (iX; iX < square.ox+2; iX++) {
            if(iX <= 0 || iX > COLS.value) {continue}
            let sibling = sqArray.find(obj => {return obj.ox == iX && obj.oy == iY});// Sibling found by iY and iX 
            reveal(sibling);
        }
    }
}
function tracker() {
    let flaggedMines = sqArray.filter(obj => {return obj.content === "mine" && obj.status === "flag"});
    let revealedSqs = sqArray.filter(obj => {return obj.content !== "mine" && obj.status === true});
    if (flaggedMines.length == MINES.value && revealedSqs.length == (COLS.value * ROWS.value) - MINES.value) {
        openModal("You won");
        clearInterval(timerint);
        isEnded = true;
    }
}
function openModal(WinLoss) {
    document.querySelector(".modal__msg").innerHTML = WinLoss;
    document.querySelector("#end").showModal();
    document.querySelector("#end").style.display = "flex";
}
document.querySelector(".modal__exit").addEventListener("click", exit);
document.querySelector(".modal__restart").addEventListener("click", restart);
// document.querySelector(".modal__view").onmouseenter = function() {
//     document.querySelector(".modal").style.visibility = "hidden";
// };
// document.querySelector(".modal").onmouseenter = function() {
//     document.querySelector(".modal").style.visibility = "visible";
// };

// let element = document.querySelector(".gameboard");
// let instance = panzoom(element, {
//     maxZoom: 10,
//     minZoom: 1,
//     bounds: true,
//     boundsPadding: 0.99,
//     beforeWheel: function(e) {
//         // allow wheel-zoom only if altKey is down. Otherwise - ignore
//         var shouldIgnore = !e.altKey;
//         return shouldIgnore;
//       },
//     beforeMouseDown: function(e) {
//         // allow mouse-down panning only if altKey is down. Otherwise - ignore
//         var shouldIgnore = !e.altKey;
//         return shouldIgnore;
//     }
//   });
  
// panzoom(element);

// const zoomElement = GAMEBOARD;
// let zoom = 1;
// const ZOOM_SPEED = 0.1;

// document.querySelector(".wrapper").addEventListener("wheel", function(e) {  
    
//     if(e.deltaY < 0){    
//         zoomElement.style.transform = `scale(${zoom += ZOOM_SPEED})`;  
//     }else{  
//         if (zoom > 1) {
//             zoomElement.style.transform = `scale(${zoom -= ZOOM_SPEED})`;
//         }  
//     }

// });