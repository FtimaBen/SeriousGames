let canvas, cxt,  movePlzId, time = 2000
var startPoint = false; //check if mouse is in start position
let start = {};
let count, constCount = 20;
let countId, gameEndId;
let e = 0;
var STATIC_URL_='/static/patient/'
var star, starPos = [];
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

var p1;
var offS;
var chronAnimId;
var ss = {x: 0, y: 0};
var mouse = {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    speed: 1,
    init: function(){
        this.height = imgNameBeeGame['bee0'].height;
        this.width = imgNameBeeGame['bee0'].width;

        this.x = canvas.width / 2;
        this.y = canvas.height -  imgNameBeeGame['bee0'].height;
    },
    draw: function (){
        cxt.drawImage(
            imgNameBeeGame['bee' + e],
            Math.floor(mouse.x - mouse.width / 2), 
            Math.floor(mouse.y - mouse.height / 2)
        );
    }
}

let timeTab = [];
let path = {
    points: [],
    timeInterval: [],
    addPoint: function(x, y) {
        this.points.push({x: x, y: y});
    },
    timeBetweenPoints: function(time) {
        this.timeInterval.push(time);
    }
}

var offset = 0;
let inPath = false;
let i = 0;
let imgNameBeeGame = {
    bee0: null,
    bee1: null,
    game1: null,
    cursor: null,
    mouse: null,
    hand: null,
    correct: null,
    star: null,
};


var promises = [];
let id_time = [];
let j = 0;
var anim = 0, animId;
var off = 0;
var boundries = [];
var curr = 5;
var f1;
var hand = "left";
var leftMove = 0, rightMove = 0;
var leftId, rightId;
var currOffsetY, currOffsetX;
var flag = false;
var idMoveB;
var ratio = 0.1;
var p2, ind = 0;
var id_; 
var angle = 1;
var drawLinesId;
var currMousePos = {x: start.x, y: start.y}; 
var clockHandOffset = {x: 0, y: 0};
var eve;
var stars_game2 = {pos: [], num: 0};
var game_score = {}, my_score = {"game": "bee game", 
                                "part_1": game_score, 
                                "part_2": stars_game2}

let game_name = 'bee_game'

async function loading() {
    await loadImages(imgNameBeeGame, "bee_game");
    initGame(canvasName = "canvas_game1");

    menu()
    ///main()
}

// draw background
function setBackground() {
    cxt.clearRect(0, 0, canvas.width, canvas.height);
    cxt.drawImage(imgNameBeeGame['game1'], 
    0, 0, canvas.width, canvas.height);
}

window.onload = loading;
//window.onresize = resizeCanvas;
document.addEventListener('fullscreenchange', fullscreenChanged);

function fullscreenChanged() {
    if(document.fullscreenElement != null) {
        if(canvas) resizeCanvas();
        mouse.speed = 0.01;
    } else {
        if(canvas) resizeCanvas()
        mouse.speed = 1;
    }
}

function resizeCanvas() {
    canvasSize()
    mouse.init()

    if(game_name == 'bee_game') initGame("canvas_game1");
    if(game_name == 'bee_game_2') initGame("canvas_game2");
}

function endMenuDisplay () {
    let menu = document.querySelector('#menu');
    menu.style.display = 'grid'
}

function recieveData() {
    if (Object.entries(json_data).length != 0) count = constCount = json_data.time * 1;
}

function navigrateLink(currGame, nextGame) {
    location.replace('bell_game')
}

function countdown() {
    countId = setInterval(()=>{
            if (--count == 0 || starPos.length == 0) { // == 1
                startPoint = false;
                if( starPos.length != 0 )
                    collectStar({clientX: starPos[ind].x, clientY: starPos[ind].y});
                else collectStar({})
                clearInterval(countId);
                goBacktoStart()
                count = constCount
            }
                fontSet();
                mouse.draw()
            }
            ,1000);
}


function str(event){
    if (startPoint) {
        e = 1 * (event.clientX < mouse.x + 1);
        //mouse.x = Math.min(event.clientX, canvas.width - mouse.width / 2);
        //mouse.y = Math.min(event.clientY, canvas.height - mouse.height / 2);
        mouse.x += mouse.speed * (event.clientX - mouse.x);
        mouse.y += mouse.speed * (event.clientY - mouse.y);
        setBackground();
        fontSet();
        mouse.draw();
    }
}

function startMouseTrack() {
    canvas.addEventListener(    
        "mousemove",
        str    
    );
}

//change _ to nothng
function goBacktoStart() {
    e = 1 * (mouse.x > start.x);
    let mov = setInterval(move, 1);
    path.points[0] = start;
    count = constCount; 
    canvas.removeEventListener("mousemove", str);
    canvas.removeEventListener("mousemove", collectStar);
    mouse.init()

    p1 = new Promise((resolve, reject)=>{
        let id = setInterval(()=>{
            if(
                mouse.x == start.x &&
                mouse.y == start.y
            ) {
                clearInterval(mov);
                clearInterval(id)
                canvas.style.cursor = "auto";  
                resolve();      
            }
    }, 1)});
}
function f1(event){
    if(!cxt.isPointInPath(boundries[curr], event.clientX, event.clientY) &&
        !cxt.isPointInPath(boundries[5], event.clientX, event.clientY)) {
            canvas.removeEventListener("mousemove", str);      
            canvas.removeEventListener("mousemove", collectStar);          
            canvas.style.cursor = "auto";
    } else {
        canvas.addEventListener("mousemove", str);
        canvas.addEventListener("mousemove", collectStar);
    }
    if(cxt.isPointInPath(boundries[5], event.clientX, event.clientY)) {
        canvas.removeEventListener("mousemove", f1);
        if(game_name == 'bee_game') canvas.addEventListener("mousemove", check);
        canvas.removeEventListener("mousemove", collectStar);   
    }
}

function check(event){
    var f1;
    if (starPos.length == 0 || game_name != 'bee_game') {
        canvas.removeEventListener("mousemove", check);
        canvas.removeEventListener("mousemove", f1);
        return;
    }
    else if(curr != 5) {
        canvas.removeEventListener("mousemove", check);
        canvas.addEventListener("mousemove", f1 = (event)=>{
            if(!cxt.isPointInPath(boundries[curr], event.clientX, event.clientY) &&
                !cxt.isPointInPath(boundries[5], event.clientX, event.clientY)) {
                    canvas.removeEventListener("mousemove", str);      
                    canvas.removeEventListener("mousemove", collectStar);          
                    canvas.style.cursor = "auto";
            } else {
                canvas.addEventListener("mousemove", str);
                canvas.addEventListener("mousemove", collectStar);
            }
            if(cxt.isPointInPath(boundries[5], event.clientX, event.clientY)) {
                canvas.removeEventListener("mousemove", f1);
                canvas.addEventListener("mousemove", check);
                canvas.removeEventListener("mousemove", collectStar);   
            }
        });
    }
    boundries.map((path_, index)=>{
        curr = cxt.isPointInPath(path_, mouse.x, mouse.y)?index:curr;
    });
}

function startTrackWhenOnBee(check_) {
    mouse.init()
    canvas.addEventListener("mousemove", fun = (event)=>{
        if (
            event.clientX > mouse.x - mouse.width / 4 &&
            event.clientX < mouse.x + mouse.width / 4 &&
            event.clientY > mouse.y - mouse.height / 3 &&
            event.clientY < mouse.y + mouse.height / 4
        ) {
            startPoint = true;
            startMouseTrack();
            canvas.removeEventListener("mousemove", fun);
            countdown();
            //reminderToMove();
            if(game_name == 'bee_game') canvas.addEventListener("mousemove", check);
            canvas.addEventListener("mousemove", collectStar); 
        }
    });
}
function collectStar(event) {
    if (!starPos.length) {
        canvas.removeEventListener("mousemove", collectStar);
        return
    }
    if (
        (starPos[ind].x < mouse.x + mouse.width / 2 &&
        starPos[ind].x + star.width > mouse.x &&
        starPos[ind].y < mouse.y + mouse.height / 2&&
        starPos[ind].y + star.height / 2 > mouse.y )|| count == 0
    ) {
        if(game_name == 'bee_game') {
            game_score.stars_collected.push(starPos[ind].position)
            game_score.pos.push({
                x: starPos[ind].x * 100 / cxt.canvas.width, 
                y: starPos[ind].y * 100 / cxt.canvas.height, 
                time: (count == 0)?'':constCount - count + 's', 
                state: (count == 0)?'not collected': 'collected',
                speed: (mouse.speed == 1)? 'normal': 'slow'})
        }
        if(game_name == 'bee_game_2') 
            stars_game2.pos.push({
                x: starPos[0].x * 100 / cxt.canvas.width, 
                y: starPos[0].y * 100 / cxt.canvas.height, 
                time: (count == 0)?'':constCount - count + 's', 
                state: (count == 0)?'not collected': 'collected',
                speed: (mouse.speed == 1)?'normal': 'slow',
            })

        starPos.shift();
        startPoint = false;
        mouse.init()
        canvas.removeEventListener("mousemove", str);
        canvas.removeEventListener("mousemove", collectStar);
        timeTab.push(count);
        count = constCount;
        clearInterval(countId);
        //await p1;
        
        canvas.addEventListener("mousemove", function h(event) {
            if (starPos.length == 0 || stars_game2.num > 5) {
                canvas.removeEventListener("mousemove", h);
                return
            }
            else if (
                event.clientX > mouse.x - mouse.width / 3 &&
                event.clientX < mouse.x + mouse.width / 4 &&
                event.clientY > mouse.y - mouse.height / 3 &&
                event.clientY < mouse.y + mouse.height / 4
            ) {
                //reminderToMove();
                canvas.addEventListener("mousemove", str);
                canvas.addEventListener("mousemove", collectStar); 
                canvas.removeEventListener("mousemove", h);
                startPoint = true;
                countdown();
            }
        })
    }
}

function drawStar() {
    setBackground();
    mouse.draw();
    cxt.save();
    cxt.translate(starPos[ind].x, starPos[ind].y);
    cxt.rotate(Math.PI / 180 * angle % 360);
    cxt.drawImage(imgNameBeeGame['star'], 
        0 - imgNameBeeGame['star'].width * 0.5 / 2, 
        0 - imgNameBeeGame['star'].height * 0.5 / 2, 
        imgNameBeeGame['star'].width * 0.5, 
        imgNameBeeGame['star'].height * 0.5);
    cxt.restore();    

    angle++;
}

function move() {
    mouse.x = start.x;
    mouse.y = start.y;
    //score();
    setBackground();
    fontSet();
    mouse.draw();
}

function score() {
    cxt.drawImage(imgNameBeeGame['star'], 
    start.x , 
    canvas.height / 2, 
    star.width, star.height);
    requestAnimationFrame(score);
}

function initGame(canvasName) {
    canvas =  document.getElementById(canvasName);
    canvas.style.display = 'block'
    cxt = canvas.getContext('2d');
    canvasSize();

    star = {width: imgNameBeeGame['star'].width * 0.4,
    height: imgNameBeeGame['star'].height * 0.25}

    cxt.fillStyle = "black";
    cxt.font = "30px Arial";
    cxt.textAlign = 'center';
    cxt.save();
    
    mouse.init();
    path.addPoint(start.x = mouse.x, start.y = mouse.y);
}

async function menu(){
    
    setBackground();
    mouse.draw();

    let menu = document.querySelector('#menu');
    document.querySelector('#menu>button').onclick = function() {
        menu.style.display='none'; 
        document.querySelector('#fullScreen').requestFullscreen(); 
    }

    let num = 10
    let autoLoadCount = document.querySelector('#wait')
    await new Promise((resolve, reject)=>{
        let autoLoadInterval = setInterval(()=>{
            let replacement = autoLoadCount.innerText.replace(num, --num)
            if(num == 0 || document.fullscreenElement != null) {
                clearInterval(autoLoadInterval)
                resolve()
            }
            autoLoadCount.innerText = replacement

        }, 1000)
    })
    menu.style.display = 'none'
    menu.removeChild(document.querySelector('#menu>button'))
    menu.removeChild(document.querySelector('#or'))
    menu.children[0].innerHTML = "Thanks for playing"
    document.querySelector('#wait').innerHTML = 'Cheking for existing games '
    if(location.href.includes('NonePLayer')) document.querySelector('#wait').innerHTML = ''
    main()
}

async function main() {
    game_name = 'bee_game'
    recieveData()
    await game_1();

    game_name = 'bee_game_2'
    await game2();
    setBackground();
    endMenuDisplay();

    my_score =  {
                'game': my_score.game, 
                'stars_collected': [...my_score.part_1.pos,...my_score.part_2.pos]
                }

    if(!isUserNonePlayer()) {
        send_json('bee_game', my_score)
        setTimeout(()=>{navigrateLink('bell_game')}, 5000)
    }
}

function isUserNonePlayer() {
    return location.href.includes('NonePlayer') 
}