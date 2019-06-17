export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = {
            id,
            title,
            author,
            img
        };
        this.likes.push(like);

        // Perist data in localStorage
        this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Perist data in localStorage
        this.persistData();
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        //We want to save the entire this.likes array
        //But we can save only primitive data types as values
        //So we convert array into string using JSON.stringify
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {

        //Json.parse converts everything back to the data structure it was before
        const storage = JSON.parse(localStorage.getItem('likes'));

        //Restoring data from local storage if some data is actually present
        //If no data is present, localStorage returns NULL
        if (storage) this.likes = storage;
    }
}