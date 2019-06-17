//Regarding search view

import {
    elements
} from './base';


export const getInput = () => {

    //We need not write return keyword-when we do not use paranthesis in arrow functions

    return elements.searchInput.value;

}
export const clearInput = () => {
    elements.searchInput.value = '';
}
export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

//17 is just a guess for the limit
/*
Eg. Pasta with tomato and spinach
1. acc=0;cur='Pasta' ;0+5<=17 => newTitle=['Pasta']
2. acc=5;cur='with';5+4<=17 => newTitle=['Pasta','with']
3. acc=9;cur='tomato';9+6<=17 => newtitle =['Pasta','with','tomato']

*/
export const limitTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        //arr is an array here
        const arr = title.split(' ');

        //Now we use reduce method on array here
        //reduce has two paramaters - accumulator callback function and initial value of accumulator
        arr.reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        // ... to show that title is longer than it is shown
        return `${newTitle.join(' ')}...`;
    }
    return title;
}
//renderRecipe is a private function
const renderRecipe = recipe => {
    const markup = `<li>
                    <a class="results__link results" href="#${recipe.recipe_id}">
                        <figure class="results__fig">
                            <img src="${recipe.image_url}" alt="${limitTitle(recipe.title)}">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitTitle(recipe.title)}</h4>
                            <p class="results__author">${recipe.publisher}</p>
                        </div>
                    </a>
                </li>`;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
}
export const highlightSelected = id => {
    //Remove all active links before highlighting one
    const arr = Array.from(document.querySelectorAll('.results__link'));
    arr.forEach(el => {
        el.classList.remove('results__link--active')
    })
    //Using a CSS selector with query selector
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
}
//type : 'prev' or 'next'
const createButton = (page, type) => {
    return `<button class="btn-inline results__btn--${type}" data-goto=${type =='prev'? page-1:page+1}">
                <span>Page ${type =='prev'? page-1:page+1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type =='prev'? 'left':'right'}"></use>
                    </svg>
                    
                </button>
                `;
}
const renderButton = (page, numResults, resPerPage) => {
    //pages = number of pages
    //numResults = number of results
    //resPerPage = no of results per page

    let button;
    const pages = Math.ceil(numResults / resPerPage);
    if (page == 1 && pages > 1) {
        //Only Button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        //Both buttons - prev and next
        button = `
                    ${createButton(page,'prev')}
                    ${createButton(page,'next')}
`;
    } else if (page == pages && pages > 1) {
        //Only button to go to prev page 
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //We get a total of 30 results from the API
    /*
    [0,9] - Page 1
    [10,19] - Page 2
    [20,29]- Page 3
    slice method includes the start index but excludes the end index
    */

    //render results of the page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);
    //render pagination buttons
    renderButton(page, recipes.length, resPerPage);
}