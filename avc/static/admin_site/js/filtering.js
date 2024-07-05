var buttonSearch, searchValue, scoreInlinesGroups, searchResult, show, searchResultSpan, search;
var find_objects_fun;
function search() {
    buttonSearch = document.querySelector('#score_search_button');
    search = buttonSearch.previousElementSibling;
    scoreInlinesGroups = document.querySelectorAll('.inline-group');
    searchResultSpan = document.querySelector('#search_result');

    setTimeout(()=>
        {
            show = document.querySelectorAll('.collapse-toggle');
            for (let i = 0; i < show.length; i++) 
                show[i].onclick = Hide_Show.bind(null, i);
        }, 300);

    function Hide_Show(index) {
        let inlines = show[index].parentElement.parentElement.querySelectorAll('.inline-related');

        switch(show[index].innerText.toUpperCase()) {
            case 'SHOW':
            case 'SHOW ALL':
                show[index].parentElement.parentElement.classList.remove('collapsed');
                [...inlines].map((inline)=>inline.style.display = 'block');
                console.log(show[index])
                show[index].innerText = 'HIDE';
                break;

            case 'HIDE':
                show[index].parentElement.parentElement.classList.add('collapsed');
                [...inlines].map((inline)=>inline.style.display = 'none');
                console.log(show[index])
                show[index].innerText = 'SHOW'
                break;
        }
    }

    find_objects_fun = function () {
        let state;
        searchResult = 0;
        
        [...scoreInlinesGroups].map((scoreInlinesGroup)=>{
            state = scoreInlinesGroup.querySelector('.collapse-toggle');
            var inlineRelated = scoreInlinesGroup.querySelectorAll('.inline-related') 

            switch(state.innerText.toUpperCase()) {
                case 'HIDE':
                case 'SHOW ALL':
                    var inlineRelated = scoreInlinesGroup.querySelectorAll('.inline-related') 
                    for(let i = 0; i < inlineRelated.length; i++) {
                        let field_level = inlineRelated[i].querySelector('.field-level a')
                        let inline_label = inlineRelated[i].querySelector('.inline_label')
                        if(!search.values.some((el)=>field_level.innerText.includes(el)) &&
                            !search.values.some((el)=>inline_label.innerText.includes(el))) {
                                inlineRelated[i].style.display = 'none';
                        } else {
                            state.innerText = 'SHOW ALL';
                            searchResult++;
                            inlineRelated[i].style.display = 'block';
                        }
                    }
                    break;

                case 'SHOW':
                    for(let i = 0; i < inlineRelated.length; i++) {
                        let field_level = inlineRelated[i].querySelector('.field-level a')
                        let inline_label = inlineRelated[i].querySelector('.inline_label')
                        if(search.values.some((el)=>field_level.innerText.includes(el)) ||
                            search.values.some((el)=>inline_label.innerText.includes(el))) {
                                state.innerText = 'SHOW ALL';
                                searchResult++;
                                inlineRelated[i].style.display = 'block';
                        } 
                    } 
                    break;
            }
        })

        searchResultSpan.innerText = 'matching : ' + searchResult;
        searchResultSpan.hidden = false;
    }

    buttonSearch.onclick = ()=>{ 
        search.values = [buttonSearch.previousElementSibling.value];
        find_objects_fun();
    }
}