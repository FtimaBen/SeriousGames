var stuffDim = {width: 50, height: 50, x: 0, y: 0}, bgimgData;
var bellNum = 50, bellPos = [];
var mouseStoped = true, deg = 0, idAnimArc = 0, animationId, countDownInterval;
var textMeasure, game_name ='bell game';
let cxt, count, constCount = 50, start = {};
let imgNamePenGame = {
    apple: null,
    bell: null,
    car: null,
    carrot: null,
    cat: null,
    cell: null,
    door_key: null,
    sandglass: null,
    house: null,
    star_: null,
    marker: null,
}
window.onload = game3

function recieveData() {
    if (Object.entries(json_data).length != 0 && typeof json_data.time * 1 == 'number') 
        count = constCount = json_data.time * 1;
}
async function game3() {
    recieveData()
    howToPlayG3();
    count = constCount;
    
    
    let canvas = document.getElementById("canvas_game2");
    canvas.style.display = "block";

    await loadImages(imgNamePenGame, "bell_game");
    cxt = canvas.getContext('2d');
    canvasSize();

    start.x = canvas.width / 2 
    cxt.font = "30px Arial";
    cxt.fillStyle = "white"
    cxt.textAlign = 'center';
    textMeasure = cxt.measureText('  time: 10s ')
    stuffDim.height = stuffDim.width = 1 / 25 * canvas.width 


    cxt.fillStyle = "white"
    cxt.fillRect(0, 0, canvas.width , canvas.height);

    cxt.fillStyle = "black"
    cxt.fillRect(canvas.width / 2  - 65, 0, textMeasure.width - 1 , 40);

    drawStuff();

    cxt.fillStyle = "white"
    cxt.fillRect(canvas.width / 2  - 65, 0, textMeasure.width, 40);

    bgimgData = cxt.getImageData(0, 0, canvas.width, canvas.height)
    drawMarker(canvas.width / 2 , canvas.height - stuffDim.height);

    canvas.addEventListener('mousemove', moveMarker)

    setTimeout(keepMoving, 3000)

    const intervalId = setInterval(()=>{
        if(count == 0 || bellNum == 0) {
            for (let i = 0; i < bellPos.length; i++) {
                bellPos[i]['x'] *= 100 / canvas.width
                bellPos[i]['y'] *= 100 / canvas.height
            }
            
            if(!location.href.includes('NonePlayer')) 
                send_json(location.href, {'game': 'bell game', 'bells': bellPos})
            
            document.body.removeChild(canvas)
            document.querySelector('#gameended').style.display = 'grid'

            clearInterval(intervalId)
        }
    }, 1000)
}

function howToPlayG3() {
    let num = 10
    let autoLoadCount = document.querySelector('#wait')

    let autoLoadInterval = setInterval(()=>{
        let replacement = autoLoadCount.innerText.replace(num, --num)
        autoLoadCount.innerText = replacement
        if(num == 0) {
            clearInterval(autoLoadInterval)
            document.body.removeChild(document.getElementById('howToPlay'));
        }
    }, 1000)
}

function drawMarker(x, y) {
    cxt.drawImage(imgNamePenGame['marker'], 
        x, 
        y, 
        stuffDim.width, 
        stuffDim.height);
}

// canvas.width / 5 canvas.height / 5 

function isSpaceEmpty(x, y, w, h) {
    return cxt.getImageData(x, y, w, h).data.every(value => value == 255) 
}

function drawStuff() {
    let interval = {x: (cxt.canvas.width - 50) / 5, y: (cxt.canvas.height - 100) / 4};
    const {marker, ...imgNameObjects} = imgNamePenGame 
    let i2 = 0
    if(typeof json_data.bells * 1 == 'number') bellNum = json_data.bells * 1

    let preventInfinit = false 
    let timeout_ = setTimeout(()=>preventInfinit = true, 11000)

    do {
        for (let j = 0; j < 4 && bellPos.length < json_data.bells * 1; j++ ) {
            for (let i = 0; i < 5 && bellPos.length < json_data.bells * 1; i++) {
                stuffDim.x = Math.floor(Math.random() * interval.x) + 20 + i * interval.x;
                stuffDim.y = Math.floor(Math.random() * interval.y) + 20 + j * interval.y;

                if(isSpaceEmpty(stuffDim.x, stuffDim.y, stuffDim.width / 2 + 2, stuffDim.height / 2 + 2)) {
                    cxt.drawImage(imgNameObjects['bell'], stuffDim.x, stuffDim.y, stuffDim.width / 2, stuffDim.height / 2);  
                    bellPos.push({'x': stuffDim.x, 'y': stuffDim.y, 'state': 'not collected', 'time': ''})
                }
            }
        }
    } while (bellPos.length != json_data.bells * 1 || preventInfinit)

    delete imgNameObjects['bell']
    
    do {
        for (let j = 0; j < 4; j++ ) {
            for (let i = 0; i < 5; i++) {
                for (const [key, value] of Object.entries(imgNameObjects)) {
                    stuffDim.x = Math.floor(Math.random() * interval.x) + 20 + i * interval.x;
                    stuffDim.y = Math.floor(Math.random() * interval.y) + 20 + j * interval.y;

                    if(isSpaceEmpty(stuffDim.x, stuffDim.y, stuffDim.width / 2 + 2, stuffDim.height / 2 + 2)) 
                        cxt.drawImage(value, stuffDim.x, stuffDim.y, stuffDim.width / 2, stuffDim.height / 2);  
                }
            }
        }
    } while(i2++ < 5)

    bellNum = bellPos.length
}

function animArc(obj) {

    cxt.putImageData(bgimgData, 0, 0, 0, 0, cxt.canvas.width, cxt.canvas.height)
    drawArc(bellPos[obj.ind]['x'] + stuffDim.width / 4, bellPos[obj.ind]['y'] + stuffDim.height / 4);
    drawMarker(
        bellPos[obj.ind]['x'] + stuffDim.width / 4 + Math.cos(deg * Math.PI) * (stuffDim.width / 2 - 10), 
        bellPos[obj.ind]['y'] + stuffDim.height / 4 + Math.sin(deg * Math.PI) * (stuffDim.width / 2 - 10) - stuffDim.height)
    idAnimArc = requestAnimationFrame(animArc.bind(null, obj)) 
    
    if(deg >= 2) {
        if(idAnimArc != 0) countDownInterval = setInterval(() => count--, 1000)
        cancelAnimationFrame(idAnimArc)

        if(bellPos[obj.ind]['state'].includes('approached') && bellPos[obj.ind]['state'] != 'approached' && bellPos[obj.ind]['state'].split('approached')[1] - count > 3) 
            bellPos[obj.ind]['state'] = 'collected with hesitation'
        else bellPos[obj.ind]['state'] = 'collected'

        bellPos[obj.ind]['time'] = constCount - count

        bellNum--;
        idAnimArc = 0
        cxt.putImageData(bgimgData, 0, 0, 0, 0, cxt.canvas.width, cxt.canvas.height)
        drawArc(bellPos[obj.ind]['x'] + stuffDim.width / 4, bellPos[obj.ind]['y'] + stuffDim.width / 4);
        bgimgData = cxt.getImageData(0, 0, cxt.canvas.width, cxt.canvas.height)
        drawMarker(obj.ev.clientX, obj.ev.clientY - stuffDim.height + 10)
    } 
}

function mouseOntarget(event) {
    let indexBell;
    if(!isSpaceEmpty(event.clientX, event.clientY, 1, 1) && idAnimArc == 0){
        indexBell = bellPos.findIndex(bell => isInRect(event, bell.x, bell.y, 
            stuffDim.width / 2, stuffDim.height / 2))
        if(indexBell != -1 && (bellPos[indexBell]['state'] == 'not collected' || bellPos[indexBell]['state'].includes('approached'))){
            deg = 0
            if(bellPos[indexBell]['state'].includes('approached')) bellPos[indexBell]['state'] = 'approached' + count
            else bellPos[indexBell]['state'] = 'approached'  
            clearInterval(countDownInterval);
            animArc({ev: event, ind: indexBell})
        }
    } else if(idAnimArc != 0 && isSpaceEmpty(event.clientX, event.clientY, 1, 1)){
        cancelAnimationFrame(idAnimArc)
        idAnimArc = 0
        countDownInterval = setInterval(() => count--, 1000)
    }
}
function drawArc(x, y) {
    deg += 0.03
    cxt.lineWidth = 4
    cxt.strokeStyle = "#FFFF00"
    cxt.beginPath()
    cxt.arc(
        x, 
        y, 
        stuffDim.width / 3, 0, deg * Math.PI)
    cxt.stroke()
    countDowBack()
    fontSet()
}

function isInRect(event, x, y, w, h) {
    return event.clientX > x && event.clientX < x + w &&
        event.clientY > y && event.clientY < y + h
}

function moveMarker(event) {
    if(isInRect(event, 
        cxt.canvas.width / 2, 
        cxt.canvas.height - stuffDim.height, 
        stuffDim.width, 2 * stuffDim.height)){
            cxt.canvas.removeEventListener('mousemove', moveMarker);
            cxt.canvas.addEventListener('mousemove', markerFollowMouse);
            countdown();
            countDownInterval = setInterval(() => count--, 1000)
        }
}

function markerFollowMouse(event) {
    mouseStoped = false
    cxt.putImageData(bgimgData, 0, 0, 0, 0, cxt.canvas.width, cxt.canvas.height)
    drawMarker(event.clientX, event.clientY - stuffDim.height + 10)
    cxt.canvas.addEventListener('mousemove', mouseOntarget)
}

function countdown() {
    animationId = requestAnimationFrame(countdown);    
    countDowBack()
    fontSet();
    if(count <= 0) {
        clearInterval(countDownInterval);
        cancelAnimationFrame(animationId);
    }
}

function countDowBack(){
    cxt.restore();
    textMeasure = cxt.measureText('  time: 10s ')
    cxt.fillStyle = "white"
    cxt.fillRect((cxt.canvas.width - textMeasure.width) / 2 - 10, 0, textMeasure.width + 10, 36);
    cxt.lineWidth = "8"
    cxt.beginPath();
    cxt.moveTo(0 , 0);
    cxt.lineTo(cxt.canvas.width, 0); 
    cxt.strokeStyle = "white"
    cxt.stroke();
    cxt.fillStyle = "black"
}