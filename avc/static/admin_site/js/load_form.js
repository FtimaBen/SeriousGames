
window.onload = function() {
    var options, obj, name
    if (location.href.includes('gamelevel')) {
        try {
            options = document.querySelector('#id_game')
            name = options.options[options.selectedIndex].text
        } catch {
            name = document.querySelector('.field-game a').innerText
            obj = {'game_name': name}
            send_json(location, obj, formLoaded, location)
            
        }
        obj = {'game_name': name}
    }
    else if (location.href.includes('patientscore')) {
        options = document.querySelector('#id_score_set-0-level')
        name = options.options[options.selectedIndex].text
        patient = document.querySelector('.field-patient .readonly').innerHTML
        obj = {'level': name, 'patient': patient}
    }

    send_json(location, obj, formLoaded, location)
    let att_div = document.createElement('div')
    att_div.className = "attributes"
    document.querySelector('fieldset').append(att_div)

    if (options != null) {
        options.onchange = function() {
            name = this.options[this.selectedIndex].text
            obj[Object.keys(obj)[0]] = name
            send_json(location, obj, formLoaded, location)
        } 
    }
}

function formLoaded(form) {
    form = form.split('</tr>')
    attributes_div = document.querySelector('.attributes')
    while(attributes_div.firstChild) attributes_div.removeChild(attributes_div.firstChild) 
    for (let i = 0; i < form.length - 1; i++) {
        var formDiv = document.createElement('div')
        formDiv.className = "form-row att-field"
        formDiv.innerHTML = form[i]
        document.querySelector('.attributes').append(formDiv)
        if (formDiv.firstChild != null)
            formDiv.firstChild.className = "required"
    }
    let help_texts = document.querySelectorAll('.helptext');
    [...help_texts].map((value)=>{value.outerHTML = '<div class="help">' + value.outerHTML + '</div>'})
}