let STATIC_URL_= '/static/patient/', cxt, exitButton, score_div, mouseMoving, score_div_2
let game = {
    score: "",
    name: "",
    image: {
        'bee_game': {
            star: null,
        },
        'bell_game': {
            bell: null
        }
    }
}
window.onresize = sizeCanvas

window.onload = function() {
    search()
    let canvas = document.createElement('canvas')
    exitButton = document.createElement('Button')
    score_div = document.createElement('div')
    score_div_2 = document.createElement('div')
    
    let score_span = document.querySelector('view_score');
    if(score_span != undefined) {
        score_span.addEventListener('click', ()=>loadScore(score_span));
    } else {
        setTimeout(()=>{    
            let score_span = document.querySelector('view_score');
            if (score_span != undefined) score_span.addEventListener('click', ()=>loadScore(score_span));

    }, 6000);
    }

    cxt = canvas.getContext('2d')
    cxt.lineWidth = 2

    exitButton.onclick = function() {     
        cxt.fillStyle = 'white'
        cxt.fillRect(0, 0, cxt.canvas.width, cxt.canvas.height);
        canvas.hidden = true
        exitButton.hidden = true 
        score_div.hidden = true
        score_div_2.hidden = true
        cxt.canvas.removeEventListener('mousemove', mouseMoving)
    }
 
    exitButton.innerHTML = 'X'
    exitButton.className = 'exit'
    exitButton.hidden = true

    canvas.hidden = true

    score_div.className = 'score_bottom score'
    score_div.hidden = true

    score_div_2.className = 'score_top score'
    score_div_2.hidden = true

    document.body.append(canvas, exitButton, score_div, score_div_2)
}

async function loadScore(link) {
    game.score = JSON.parse(
        link.parentNode.parentElement.parentElement
            .previousElementSibling.innerText.replace('Score data:\n', '')
    )

    game.name = link.parentElement.parentElement.parentElement.parentElement.children[0].innerText
    game.name = ' '.concat(game.name).replace(':\n', ' ').split(/ level /i)[1].replaceAll(' ', '_')

    cxt.canvas.hidden = false
    exitButton.hidden = false
    score_div.hidden = false
    score_div_2.hidden = false

    let obj = game.name == 'bell_game'? 'bells':'stars_collected'

    score_div_2.innerHTML = ` <h1>${ game.score[obj].reduce((score_, value)=>{
                                    switch(value.state) {
                                        case 'not collected':
                                            score_ += 3
                                            break;

                                        case 'approached':
                                            score_ += 2 
                                            break;

                                        case 'collected with hesitation':
                                            score_ += 1
                                            break;

                                        case 'collected':
                                            score_ = score_ 
                                            break;
                                    }
                                    return score_
                                }, 0)}</h1>`
    console.log('div',score_div_2)
    score_div_2.innerText = 'Points: ' + ((game.name == 'bell_game')? score_div_2.innerText: score_div_2.innerText / 3);

    score_div.innerHTML = `<h2>Select a ${(game.name == 'bell_game'? 'bell':'star')} to view details</h2>`

    await loadImages(game.image[game.name], game.name)
    sizeCanvas()
}

function sizeCanvas() {
    cxt.canvas.width = document.documentElement.clientWidth || window.width;
    cxt.canvas.height = document.documentElement.clientHeight || window.height;

    cxt.fillStyle = 'white'
    cxt.fillRect(0, 0, cxt.canvas.width, cxt.canvas.height);

    drawImagesGame()
}

function drawImagesGame() {
    let percent = [cxt.canvas.width / 100, cxt.canvas.height / 100]
    let obj, dimm
    switch(game.name) {
        case 'bell_game':
            [obj, dimm] = ['bells', 
                            { width: 1 / 25 * cxt.canvas.width / 2, 
                            height: 1 / 25 * cxt.canvas.width / 2 }]
            break;
        case 'bee_game':
            [obj, dimm] = ['stars_collected', 
                            { width: Object.values(game.image[game.name])[0].width * 0.4, 
                            height: Object.values(game.image[game.name])[0].height * 0.4 }]
            break;
    }

    if(obj && dimm)
        game.score[obj].map((object)=>{
            cxt.drawImage(
                Object.values(game.image[game.name])[0],
                object.x * percent[0] - dimm.width / 2, 
                object.y * percent[1] - dimm.height / 2,
                dimm.width, dimm.height 
            )
        })

    cxt.canvas.addEventListener('mousemove', mouseMoving = (event)=>{ selectedObject(event, percent, dimm, obj) })
}

function selectedObject(event, percent, stuffDim, obj) {
    if(!isSpaceEmpty(event.clientX, event.clientY, 1, 1)) {
        index = game.score[obj].findIndex(
            object => isInRect(event, 
                            object.x * percent[0] - stuffDim.width / 2, 
                            object.y * percent[1] - stuffDim.height / 2, 
                            stuffDim.width, 
                            stuffDim.height))
        
        if(index != -1) {
            let score_innerHtml = ''
            Object.keys(game.score[obj][index]).map((key)=>{
                if(game.score[obj][index][key] && key != 'x' && key != 'y') 
                    score_innerHtml += `<h2> ${key}: ${game.score[obj][index][key]}</h2>`
            })
            score_div.innerHTML = score_innerHtml
        }
    } else {
        let obj_name = Object.keys(game.image[game.name])[0]
        if(score_div.innerHTML != `<h2>Select a ${obj_name} to view details</h2>`)
            score_div.innerHTML = `<h2>Select a ${obj_name} to view details</h2>`
    }
}

function isInRect(event, x, y, w, h) {
    return event.clientX > x && event.clientX < x + w && event.clientY > y && event.clientY < y + h
}

function isSpaceEmpty(x, y, w, h) {
    return cxt.getImageData(x, y, w, h).data.every(value => value == 255) 
}

function loadImages(imageName, imageDir) {
    let promises = []
    Object.keys(imageName).map((key)=>{
        promises.push(
            new Promise((resolve, reject)=>{
                    imageName[key] = new Image();
                    imageName[key].src = STATIC_URL_ + imageDir + "/image/" + key + ".png";
                    imageName[key].onload = resolve;
                    imageName[key].onerror = reject;}
                )
        )}
    );
    return Promise.all(promises)
}

function filtering(element) {
    let nextS = element.nextElementSibling;

    if(nextS.classList.contains('display-list')) {
        element.classList.remove('button_background');
        nextS.classList.remove('display-list')
    } else {
        element.classList.add('button_background');
        nextS.classList.add('display-list')
    }
}

function empty(span) {
    let checkBoxs = [...span.parentElement.querySelectorAll('input')];
    for(let i = 0; i < checkBoxs.length; i++) {
        checkBoxs[i].checked = false;
    }
}

function filter() {
    search = {values: []}
    let checkboxes = document.querySelectorAll('input[type="checkbox"]')
    for(let i = 0; i < checkboxes.length; i++) {

        console.log(checkboxes[i].checked)
        if(checkboxes[i].checked)
            {
                console.log(checkboxes[i].parentElement.parentElement.previousElementSibling.innerText)
                switch(checkboxes[i].parentElement.parentElement.previousElementSibling.innerText) {
                    case 'game':
                        search.values.push(checkboxes[i].value)
                        break;
                    case 'level':
                        search.values.push('level ' + checkboxes[i].value)
                        break;
                    case 'date':
                        search.values.push(checkboxes[i].value)
                        break;
                }
            }
    }
    find_objects_fun()
}
