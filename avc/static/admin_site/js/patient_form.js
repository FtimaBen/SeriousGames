window.onload = _
const observer = new MutationObserver(checkOptions)
var selection, selection_from

function _() {
    let add = document.querySelector('#add_id_level')
    add.parentNode.removeChild(add)

    let intervalId = setInterval(()=>{
            
        let add_all = document.querySelector('#id_level_add_all_link').outerHTML = ''
        selection = document.querySelector('#id_level_to')
        selection_from = document.querySelector('#id_level_from')
        checkOptions()

        if(selection && selection_from) {
            observer.takeRecords()
            observer.observe(selection_from, {childList: true})
            clearInterval(intervalId)
        }
    }, 1);
}

function checkOptions() {
    let options_to = [...selection.options]
    let options_from = [...selection_from.options]

    if(options_to.length != 0) options_to.map((option)=>{
        let title = option.title.split(' level')[0]
        options_from.map((option_)=>{
            if(option_.title.includes(title)) option_.disabled = true
        })
    })
}