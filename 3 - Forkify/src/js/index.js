/*Learnt about
Modules in ES6, imports and exports,named and default
The concept of application state, a simple way of implementing state
Advanced DOM manipulation
How to use ES6 template strings to render entire HTML components
Rendering an AJAX loading spinner
How to use .closest method for easier event handling
How and why to use data-* attributes in HTML 5
Pagination
how to read data from the page URL
how to respond to the haschange event
how to add the same event listener to multiple events
Using array methods like map,slice,findIndex and includes
how and why to use eval()
Implementing event delegation through '.matches'
Creating unique IDs using an external package
Difference between array.slice and array.splice
use case for array.findIndex() and array.find()*/


/*local storage api
set,get and delete items from local storage
Web Storage API allows us to very simply save key value pairs right in the browser.
Data stays intact even if the browser reloads
localStorage that lives on the window/global object
data persists throughout page loads
setItem,getItem,removeItem,length
*/

//GLOBAL CONTROLLER

//Global state of the app
/*
-Search objects
-Current recipe objcts
-Shopping list objects
-Liked recipes
*/
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as likesView from './views/likesView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import {
    elements,
    renderLoader,
    clearLoader
} from './views/base'
const state = {}

/*

SEARCH CONTROLLER

*/
//async function
const controlSearch = async () => {
    //1. Get the query from the view
    const query = searchView.getInput();

    //2. If query exists, create a new search object and add it to state
    if (query) {
        state.search = new Search(query);

        //3. Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResDiv);

        //4. Search for recipes
        //We need to await the promise
        //since every async function automatically returns a promise
        await state.search.getResults();

        //5. Render results on Ui
        clearLoader();
        console.log(state.search.result)
        searchView.renderResults(state.search.result);

    }
}
elements.searchButton.addEventListener('submit', e => {
    //we pass the event object here
    //prevent defaault prevents the page from reloading
    e.preventDefault();
    controlSearch();
})


elements.searchResPages.addEventListener("click", e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        //data-* and closest function 
        console.log(btn.dataset.goto);
        const gotoPage = parseInt(btn.dataset.goto, 10);
        console.log(`go to page ${gotoPage}`);
        searchView.clearResults();
        searchView.renderResults(state.search.result, gotoPage);

    }
})

/*

RECIPE CONTROLLER

*/
//For eg. http://localhost:8080/?#8f3e73, here #8f3e73 is the hash, and whenever it changes, hashchange //gets triggered,if we click on the same item, hashchange won't get triggered
//Every time the has number changes in URL, the haschange function in JS gets triggered
//In our case whenever we click on a recipe item, its hash appears in the browser 

const controlRecipe = async () => {
    const id = window.location.hash;
    const newId = id.replace('#', '');

    if (newId) {
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight the selected recipe
        if (state.search) {
            searchView.highlightSelected(id);
        }

        //Create new recipe object
        state.recipe = new Recipe(newId);
        try {
            //try block because the await can also go wrong
            //Get recipe data
            await state.recipe.getRecipe();

            //calculate servings and time
            state.recipe.parseIngredients();
            state.recipe.calcServings();
            state.recipe.calcTime();

            //Render the recipe
            console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(state.recipe,
                state.likes.isLiked(newId)


            );
        } catch (error) {
            alert('Error processing recipe !');
            console.log(error);
        }

    }
}

//window.addEventListener("hashchange",controlRecipe);
//window.addEventListener("load",controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//handling recipe buttons
elements.recipe.addEventListener('click', el => {
    //btn-decrease * means all the child elements of btn-decrease
    if (el.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIng(state.recipe);
        }
    } else if (el.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIng(state.recipe);

    } else if (el.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        //To add the ingredients to shopping list
        controlList();
    } else if (el.target.matches('.recipe__love,.recipe__love *')) {
        //Like Controller
        controlLike();
    }

    console.log(state.recipe);
});


//to handle delete and update events on shopping list
elements.shopping.addEventListener('click', el => {
    const id = el.target.closest('.shopping__item').dataset.itemid;
    if (el.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    }

    //handle the count update
    else if (el.target.matches('.shopping__count-value')) {
        const value = parseInt(el.target.value, 10);
        state.list.updateCount(id, value);

    }
})

//SHOPPING LIST CONTROLLER
const controlList = () => {
    //Create a list if there is none yet
    if (!state.list) state.list = new List();

    //Add each ingrident to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
}




//Like controller
const controlLike = () => {
    //Create a new Likes list if there is none yet
    if (!state.likes) state.likes = new Likes();
    const id = state.recipe.id;

    //If the user has not liked the recipe
    if (!state.likes.isLiked(id)) {
        //Add like to the state
        const newLike = state.likes.addLike(
            id,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        //Toggle the like button
        likesView.toggleLikeBtn(true);

        //Add like to our UI list
        likesView.renderLike(newLike);
        console.log(state.likes);
    }


    //if user has liked the recipe
    else {
        //Remove like to the state
        state.likes.deleteLike(id);

        //Toggle the like button
        likesView.toggleLikeBtn(false);

        //Remove like to our UI list
        likesView.deleteLike(id);
        console.log(state.likes);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
}

//Restore liked recipe on page load
window.addEventListener('load', () => {

    state.likes = new Likes();

    //Restore likes 
    state.likes.readStorage();

    //Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //Render pre-existing likes
    //state.likes contains the object of th Likes.js, and .likes again refers to the likes array
    state.likes.likes.forEach(like => {
        likesView.renderLike(like);
    })


})