//For shopping list
/*The slice() method returns a shallow copy of a portion of an array into a new array object selected from begin to end (end not included). The original array will not be modified.

The splice() method changes the contents of an array by removing or replacing existing elements and/or adding new elements in place.

*/

import uniqid from 'uniqid';
export default class List
    {
        constructor()
        {
            this.items=[];
        }
        
        addItem(count,unit,ingredient)
        {
            //our shopping list conatins the item,its unit and its count
            //We also will want a unique id for their inserions,updation and deletion
            
            const item={id:uniqid(),count,unit,ingredient};
            this.items.push(item);
            return item;
        }
        
        deleteItem(id)
        {
            //finding the index of the element to be deleted
            const index = this.items.findIndex(el=>el.id===id)
            //array = [2,4,8] . splice(1,2) - > returns 4,8 and the array=[2];
            //(start,count) This means start from position 1 and take 1 element
            //array = [2,4,8] . slice(1,2) - > returns 4 and the array=[2,4,8];
            //(start,end) This means start at 1 and end at 1
            this.items.splice(index,1);
        }
        
        updateCount(id,newCount)
        {
            //find returns the entire element, and not just the index like findIndex
            this.items.find(el=>el.id===id).count = newCount;
        }
    }
    