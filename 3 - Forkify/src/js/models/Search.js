// api key - 07adfce6318bee7607d471bc88272bcf
import axios from 'axios';
import {
    key
} from '../config'
export default class Search {
    constructor(query) {
        this.query = query;
    }

    //For methods inside class, we do not use 'function' keyword
    async getResults(query) {
        try {
            //const key ='07adfce6318bee7607d471bc88272bcf';
            //just like fetch, it will return a promise
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);

            this.result = res.data.recipes;

        } catch (error) {
            console.log(error);
        }

    }


}