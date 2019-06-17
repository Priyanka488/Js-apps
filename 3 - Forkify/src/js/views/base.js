//Contains all the objects that we refer from UI and for reusable components

export const elements = {
    //We cannot put in the loader class here, since by the time the code runs, the loader is not yet on the page, //and this will cause an error
    searchButton: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResultList: document.querySelector('.results__list'),
    searchResDiv: document.querySelector('.results'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list'),
};
const elementStrings = {
    loader: '.loader'
};

//Best way of rendering the loader is to pass in the parent element and then attaching the loader as a child element //of the parent
export const renderLoader = parent => {
    const loader = `
<div class="loader">
<svg>
<use href="img/icons.svg#icon-cw"></use>
</svg>
</div>
`;
    parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
    const loader = document.querySelector(`${elementStrings.loader}`);
    if (loader) {
        loader.parentElement.removeChild(loader);
    }
};