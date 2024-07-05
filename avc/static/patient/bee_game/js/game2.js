var envId, check2 = ()=>{}, myin, myin2, areas = [];
var area_index = 0;
var game_end_promise
let area_left = {}, area_right = {}
let star_collected = false;

async function game2() {
    starPos = []
    targetArea()
    initGame("canvas_game2")
    setTimeout(keepMoving, 1000)

    var time_ended = new Promise((resolve, reject)=>{
        myin = setInterval(function game1_end() {
            resolve()
        }, 10000 * 20);
    });
    var game_end_promise = new Promise((resolve, reject)=>{
        myin2 = setInterval(function game1_end() {
            if(stars_game2.num == (json_data.stars || 5)) {
                clearInterval(myin2)
                resolve()
                document.body.removeChild(document.querySelector('#fullScreen'))
            }
        }, 100);
    });
    gameEnv();
    startTrackWhenOnBee(check2);
    await new Promise((resolve, reject)=> {
        if (game_end_promise != null) 
            game_end_promise.then((value) => {
                resolve()                
                clearInterval(myin); 
                clearInterval(myin2)
                gameEnd()
            })
        if (time_ended != null)
            time_ended.then((value)=>{
                resolve()      
                clearInterval(myin); 
                clearInterval(myin2)
                gameEnd()
            })
        }
    )
    return 1
}

function gameEnv() {
    if (starPos.length == 0 && stars_game2.num != (json_data.stars || 5)) {
        stars_game2.num++;
        generateTarget(
            areas[area_index].x, 
            imgNameBeeGame['star'].width * 0.5, 
            imgNameBeeGame['star'].width * 0.5,
            canvas.height - (canvas.height - mouse.x)
        );
        area_index = (area_index + 1) % areas.length
    }
    setBackground()
    drawStar()
    fontSet()
    envId = requestAnimationFrame(gameEnv);
}

function gameEnd() {
    cancelAnimationFrame(envId);
    goBacktoStart()
    canvas.removeEventListener('mousemove', check2);
}

function generateTarget(area_x, area_y, width, height) {
    starPos[0] = {x: Math.random() * (canvas.width / 2) + area_x, 
                y: Math.random() * (canvas.height - mouse.height) + area_y};
    if(starPos[0].x >= canvas.width - imgNameBeeGame['star'].width * 0.5) starPos[0].x -= imgNameBeeGame['star'].width * 0.5
    if(starPos[0].y >= mouse.x - mouse.width) starPos[0].y -= mouse.width
}

function targetArea() {
    game_score.stars_collected.map((star_position)=>{
        switch(star_position) {
            case 'top_left':
            case 'bottom_left':
                if(Object.entries(area_left).length == 0)
                    area_left = {x: imgNameBeeGame['star'].width * 0.5 / 2};
                    areas.push(area_left);
                break;

            case 'top_right':
            case 'bottom_right':
                if(Object.entries(area_right).length == 0)
                    area_right = {x: canvas.width / 2};
                    areas.push(area_right);
                break;
        }
    })
}