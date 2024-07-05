var STATIC_URL_= '/static/patient/'

function loadImages(imgName, imgDir) {
    let promises = []
    Object.keys(imgName).map((key)=>{
        promises.push(
            new Promise((resolve, reject)=>{
                    imgName[key] = new Image();
                    imgName[key].src = STATIC_URL_ + imgDir + "/image/" + key + ".png";
                    imgName[key].onload = resolve;
                    imgName[key].onerror = reject;}
                )
        )}
    );
    return Promise.all(promises)
}

function canvasSize() {
    cxt.canvas.width = document.documentElement.clientWidth || window.width;
    cxt.canvas.height = document.documentElement.clientHeight || window.height;
}

let mousemoved = true
function keepMoving() {
    let moveIntevalId = setInterval(()=>{
        if( !mousemoved ) {
            if(game_name == 'bell_game') {
                cxt.fillStyle = 'white'
                cxt.fillRect(start.x - textMeasure.width / 2, 0, textMeasure.width, 36);
                cxt.fillStyle = 'red';
            }

            if(cxt.font == "30px Arial") cxt.font = "35px Arial", cxt.fillStyle = 'red';
            else cxt.font = "30px Arial", cxt.fillStyle = 'black';
        }
        mousemoved = false;
    }, 1500);

    cxt.canvas.addEventListener('mousemove', 
        function mousemovedFun() { 
            mousemoved = true; 
            cxt.font = "30px Arial"; 
            cxt.fillStyle = 'black';
            if(game_name == 'bee_game')
                if(starPos.length == 0)  {
                    cxt.canvas.removeEventListener('mousemove', mousemovedFun);
                    clearInterval(moveIntevalId);
                }
        })
    return moveIntevalId;
}

function fontSet() {
    var OffS = Math.floor();
    cxt.setLineDash([])
    cxt.strokeStyle = "red";
    cxt.lineWidth = "7";
    cxt.fillText("time: " + count + " s", start.x, 30); 
    cxt.beginPath();
    cxt.moveTo((constCount - count) * cxt.canvas.width / (constCount * 2) , 0);
    cxt.lineTo(cxt.canvas.width - (constCount - count) * cxt.canvas.width / (constCount * 2), 0); 
    cxt.stroke();
}