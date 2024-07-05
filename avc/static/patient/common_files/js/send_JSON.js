
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function send_json(url, obj, responseFunction = ()=>{}, responseFunctionAgs = null) {
    var csrftoken =  getCookie('csrftoken');

    const request = new Request(
        url,
        {headers: {'X-CSRFToken': csrftoken}}
    );
    fetch(request, {
        method: 'POST',
        mode: 'same-origin', 
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify( obj ),
    }).then(function(response) {
        if(responseFunctionAgs)
            response.text().then((value, responseFunctionAgs)=>responseFunction(value, responseFunctionAgs))
        else
            response.text().then((value)=>responseFunction(value))

    }).catch(console.error())
}