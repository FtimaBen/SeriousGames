async function game_1() {

    star = {width: imgNameBeeGame['star'].width * 0.5,
            height: imgNameBeeGame['star'].height * 0.5}
    starPos = [
        {x: start.x, y: start.y - mouse.height, position: 'bottom_middle'},
        {x:canvas.width - 100, y:start.y - mouse.height / 2, position: 'bottom_right'},
        {x:canvas.width - 100, y:70, position: 'top_right'},
        {x: start.x - 25, y: 70, position: 'top_middle'},
        {x:100, y:70, position: 'top_left'},
        {x:100, y:start.y - mouse.height / 2, position: 'bottom_left'},
    ];

    game_score.stars_collected = []
    game_score.pos = []

    initGame(canvasName = "canvas_game1");
    count = constCount;
    initPath();
    howToPlay()
    return new Promise((resolve, reject)=>{
        gameEndId = setInterval(async function game1_end() {
            if(!starPos.length) {
                clearInterval(gameEndId);
                await p1;
                document.querySelector('#fullScreen').removeChild(canvas)
                resolve();
            }
        }, 100)
    })
}

function howToPlay() {
    canvas.addEventListener("mousemove", mouseMoved = (event)=>{
        canvas.removeEventListener("mousemove", mouseMoved);
        clearInterval(leftId); 
        clearInterval(rightId);
        eve={x: event.clientX, y:event.clientY}
        setBackground(); 
        mouse.draw();
        moveBee(event);
    });
    hand == "left"? leftHand(): rightHand();
}

function moveBee(event) {
    eve = {x:0, y:0};
    currOffsetY = canvas.height / 2;
    currOffsetX = canvas.width / 3;
    canvas.addEventListener("mousemove", mouseOnBee = (event)=>{
        eve = {x: event.clientX, y: event.clientY}
        
        if (
            event.clientX > mouse.x - mouse.width / 3 &&
            event.clientX < mouse.x + mouse.width / 4 &&
            event.clientY > mouse.y - mouse.height / 3 &&
            event.clientY < mouse.y + mouse.height / 4
        ) {
            currOffsetX = start.x;
            currOffsetY = start.y;
            startPoint = flag = true;
            starttrack();
            canvas.removeEventListener("mousemove", mouseOnBee);
        }
    })

    idMoveB = setInterval(()=>{
        if (flag) {
            if(mouse.x < start.x - mouse.width / 2)
                if(currOffsetX < canvas.width * 0.6) 
                    currOffsetX++;
                else
                    currOffsetX = canvas.width * 0.3;
            else if (mouse.x > start.x + mouse.width / 2) 
                if(currOffsetX > canvas.width * 0.3) 
                    currOffsetX--;
                else
                    currOffsetX = canvas.width * 0.6;
            else { 
                currOffsetX =  mouse.x; 
                if(mouse.y > canvas.height * 0.5 / 2 + imgNameBeeGame['star'].height * 0.5 / 2) {
                    currOffsetY--;
                    if(currOffsetY < canvas.height * 0.5 / 2 + imgNameBeeGame['star'].height * 0.5 / 2)
                        currOffsetY = mouse.y}
                else if(mouse.y < canvas.height * 0.5 / 2 + imgNameBeeGame['star'].height * 0.5 / 2) {
                    currOffsetY++;
                    if(currOffsetY > canvas.height * 0.5 / 2 + imgNameBeeGame['star'].height * 0.5 / 2)
                        currOffsetY = mouse.y;
                    }  
                }
        } else {
            if(eve.x < start.x - mouse.width / 2)
                if(currOffsetX < canvas.width * 0.6) 
                    currOffsetX++;
                else
                    currOffsetX = canvas.width * 0.3;
            else if (eve.x > start.x + mouse.width / 2) 
                if(currOffsetX > canvas.width * 0.3) 
                    currOffsetX--;
                else
                    currOffsetX = canvas.width * 0.6;
            else { 
                currOffsetX =  eve.x; 
                if(eve.y > start.y) {
                    currOffsetY--;
                    if(currOffsetY < start.y)
                        currOffsetY = canvas.height / 4;}
                else if(eve.y < start.y) {
                    currOffsetY++;
                    if(currOffsetY > start.y)
                        currOffsetY = canvas.height / 4 ;
                    }  
                }
        }
        drawStar();
        cxt.drawImage(imgNameBeeGame['cursor'], 
                currOffsetX, 
                currOffsetY,
                imgNameBeeGame['cursor'].width * 0.1, 
                imgNameBeeGame['cursor'].height * 0.1, 
            );
    }, 10);
}

function starttrack() {
    let id;
    canvas.addEventListener("mousemove", async function track (event) {
        mouse.x += mouse.speed * (event.clientX - mouse.x);
        mouse.y += mouse.speed * (event.clientY - mouse.y);
        if (
            starPos[ind].x < mouse.x + mouse.width / 2 &&
            starPos[ind].x + star.width > mouse.x &&
            starPos[ind].y < mouse.y + mouse.height / 2 &&
            starPos[ind].y + star.height / 2 > mouse.y) {

            if(starPos.length) starPos.shift(0, 1);
            canvas.removeEventListener("mousemove", track);
            clearInterval(idMoveB);
            id = setInterval(()=>{
                setBackground();
                mouse.draw();
                cxt.drawImage(imgNameBeeGame['correct'], 
                canvas.width / 2 - imgNameBeeGame['correct'].width * 0.5 / 2, 
                canvas.height / 3, 
                imgNameBeeGame['correct'].width * 0.5, 
                imgNameBeeGame['correct'].height * 0.5);

            }, 100);
            await new Promise((resolve, reject)=>setTimeout(resolve, 1000));
            clearInterval(id);
            goBacktoStart();
            await p1;
            keepMoving()
            lineAnimation();
        }
    });
}

function drawHand() {
    cxt.save();
    cxt.translate(canvas.width, 0);
    cxt.scale(-1, 1);

    if (hand == "left") drawMouse();
    
    cxt.drawImage(imgNameBeeGame['hand'], 
        canvas.width / 2, canvas.height / 2 + leftMove, 
        imgNameBeeGame['hand'].width * 0.2, imgNameBeeGame['hand'].height * 0.2);
    cxt.restore();

    if (hand == "right") drawMouse();

    cxt.drawImage(imgNameBeeGame['hand'], 
        canvas.width / 2, canvas.height / 2 + rightMove, 
        imgNameBeeGame['hand'].width * 0.2, imgNameBeeGame['hand'].height * 0.2);
}

function drawMouse() {
    cxt.drawImage(imgNameBeeGame['mouse'], 
        canvas.width / 2 - 15, canvas.height / 2 + rightMove + leftMove - 50, 
        imgNameBeeGame['mouse'].width * 0.3, imgNameBeeGame['mouse'].height * 0.3);    
}

function leftHand() {
    leftId = setInterval(()=>{
        setBackground();
        mouse.draw();
        
        leftMove = leftMove == -50? 0: leftMove-1;
        drawHand();
        }, 50);
    return 1
}

function rightHand() {
    rightId = setInterval(()=>{
        setBackground();
        mouse.draw();
        rightMove = rightMove == -50? 0: rightMove-1;
        drawHand();
    }, 50);
    return 1
}

function initPath() {   
    boundries.push(
        new Path2D(
            "M " + (canvas.width * 0.55) + 
            " " + (canvas.height * 0.6) + 
            " L " + (canvas.width * 0.74) + 
            " " + (-10) +
            " L " + (canvas.width + 10) + 
            " " + (-10) + 
            " L " + (canvas.width + 10) + 
            " " + (canvas.height * 0.39) +
            " L " + (canvas.width * 0.6 + 0.6) + 
            " " + (canvas.height * 0.75) 
        ),
        new Path2D(
            "M " + (canvas.width * 0.4) + 
            " " + (canvas.height * 0.75) + 
            " L " + (-10) + 
            " " + (canvas.height * 0.39) + 
            " L " + (-10) + 
            " " + (canvas.height + 10) + 
            " L " + (canvas.width / 2 + 10) + 
            " " + (canvas.height + 10)
        ),
        new Path2D(
            "M " + (canvas.width * 0.6 + 0.6) + 
            " " + (canvas.height * 0.75) + 
            " L " + (canvas.width + 10) + 
            " " + (canvas.height * 0.39) + 
            " L " + (canvas.width + 10) + 
            " " + (canvas.height + 10) + 
            " L " + (canvas.width / 2 + 10) + 
            " " + (canvas.height + 10)
        ),
        new Path2D(
            "M " + (canvas.width * 0.44) + 
            " " + (canvas.height * 0.6) + 
            " L " + (canvas.width * 0.28) + 
            " " + (-10) + 
            " L " + (canvas.width * 0.74) + 
            " " + (-10) + 
            " L " + (canvas.width * 0.55) + 
            " " + (canvas.height * 0.6)
        ),
        new Path2D(
            "M " + 0 + 
            " " + 0 + 
            " L " + (-10) + 
            " " + (canvas.height * 0.39) + 
            " L " + (canvas.width * 0.4) + 
            " " + (canvas.height * 0.75) + 
            " L " + (canvas.width * 0.44) + 
            " " + (canvas.height * 0.6) + 
            " L " + (canvas.width * 0.28) +
            " " + (-10)
        ),
        new Path2D(
            "M " + (canvas.width * 0.6 + 0.6) + 
            " " + (canvas.height * 0.75) + 
            " L " + (canvas.width * 0.55) + 
            " " + (canvas.height * 0.6) + 
            " L " + (canvas.width * 0.44) + 
            " " + (canvas.height * 0.6) + 
            " L " + (canvas.width * 0.4) + 
            " " + (canvas.height * 0.75) +
            " L " + (canvas.width * 0.4) + 
            " " + canvas.height + 
            " L " + (canvas.width * 0.6 + 0.6) + 
            " " + canvas.height +
            " L " + (canvas.width * 0.6 + 0.6) + 
            " " + (canvas.height * 0.75) 
        )
    );
}

function lineAnimation() {
    return new Promise((resolve, reject)=>{
        let id = setInterval(()=>{
            if (anim++ >= 20) {
                clearInterval(id);
                offset = off;
                drawLines();
                clearInterval(id_);
                startTrackWhenOnBee(check);
                return
            }
    
            setBackground();
            fontSet();
            mouse.draw()
            cxt.strokeStyle = "red";
            cxt.lineWidth = "5";  
    
            cxt.beginPath();
    
            cxt.setLineDash([anim, 15]);
            cxt.lineDashOffset = (off += 3 % 16);
            cxt.moveTo(canvas.width * 0.55, canvas.height * 0.6);
            cxt.lineTo (canvas.width * 0.74, -10);
            cxt.stroke();
    
            cxt.strokeStyle = "green";
            cxt.beginPath();
    
            cxt.stroke(boundries[1]);
    
            cxt.strokeStyle = "yellow";
            cxt.beginPath();
            cxt.stroke(boundries[2]);
    
            cxt.strokeStyle = "pink";
            cxt.beginPath();
            cxt.moveTo(canvas.width * 0.44, canvas.height * 0.6);
            cxt.lineTo(canvas.width * 0.28, -10);
            cxt.stroke ();
        }, 100);
    })
}

function drawLines() {
    if (starPos.length == 0) {
        cancelAnimationFrame(drawLinesId);
        return
    }
    drawStar();
    cxt.strokeStyle = "red";
    cxt.lineWidth = 5;  

    cxt.beginPath();
    cxt.setLineDash([20, 15]);
    cxt.lineDashOffset = -(offset += 0.1 % 16); 

    cxt.moveTo(canvas.width * 0.55, canvas.height * 0.6);
    cxt.lineTo (canvas.width * 0.74, -10);
    cxt.stroke();

    cxt.strokeStyle = "green";
    cxt.beginPath();
    cxt.stroke(boundries[1]);
    
    cxt.strokeStyle = "yellow";
    cxt.beginPath();
    cxt.stroke(boundries[2]);
    cxt.lineTo(canvas.width * 0.6, canvas.height * 0.75);

    cxt.strokeStyle = "pink";
    cxt.beginPath();
    cxt.moveTo(canvas.width * 0.44, canvas.height * 0.6);
    cxt.lineTo(canvas.width * 0.28, -10);
    
    cxt.stroke ();

    cxt.lineTo(canvas.width * 0.74, -10);
    cxt.lineTo(canvas.width * 0.55, canvas.height * 0.6);

    fontSet();
    mouse.draw()
    drawLinesId = requestAnimationFrame(drawLines);
}