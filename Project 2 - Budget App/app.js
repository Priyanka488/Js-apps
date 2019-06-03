/**
 * What i learnt-
 * Modules - creation,public and private methods and properties, seperation of concerns
 * keypress events,keycodes
 * reading data from different html input types
 * storing hardcoded strings(such as classnames) in objects, and accessing them through the object in the entire app
 * Initialization function - so the module contains only functions
 * How to choose relevant function constructors
 * How to setup proper data structure for our program
 * How to add big chunks of html inro the dom
 * How to replace parts of string
 * DOM manipulation using the insertAdjacentHtml method
 * Clearing Html feilds
 * using querySelectorAll
 * Converting list to an array
 * foreach loop
 * Convert input feilds to numbers, prevent false inputs
 * Event delgation in practice
 * How to use Id's in html to connect the ui with data model
 * How to use the prentNode property for Dom traversing
 * Looping over an array through map
 * Remove elements from an array using the splice method
 * creating forEach function for nodeLists
 * getting the current date through Date object constructor
 * the change event
 */

//Modules return methods that they want to be public.

//BUDGET CONTROLLER
var budgetController = (function() {
  //function constructors
  var Expense = function(id, description, value) {
    this.id = id,
     this.description = description, 
     this.value = value,
    this.percentage=-1;};
  Expense.prototype.calcPercentage=function(totalIncome)
  {
    if(totalIncome>0)
    {
      this.percentage=Math.round((this.value/totalIncome)*100);
    }
    else{
      this.percentage=-1;
    }
  }
  Expense.prototype.getPercentage=function()
  {
    return this.percentage;
  }
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: { exp: [], inc: [] },
    totals: { exp: 0, inc: 0 },
    budget:0,
    percentage:-1
  };

  var calculateTotal = function(type){

    var sum=0;
    data.allItems[type].forEach(function(current)
    {
      sum=sum+current.value;
    });
    data.totals[type]=sum;
  };
  return {
    addItem: function(type, des, value) {
      var item, ID, lastID;

      //ID =[1,2,3,4,5]

      //Create new id
      if (data.allItems[type].length > 0) {
        lastID = data.allItems[type][data.allItems[type].length - 1].id;
        ID = lastID + 1;
      } else {
        ID = 0;
      }

      //Create new item based on 'inc' or 'exp'
      if (type === "inc") {
        item = new Income(ID, des, value);
      } else if (type === "exp") {
        item = new Expense(ID, des, value);
      }

      //Push it into data structure
      data.allItems[type].push(item);

      //Return the new element
      return item;
    },
    calculateBudget:function()
    {
      //calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      //calculate budget=income-expenses
      data.budget=data.totals.inc-data.totals.exp;

      //calculate % of income we spent
      //To avoid division by zero
      if(data.totals.inc >0)
      {
        data.percentage=Math.round((data.totals.exp/data.totals.inc)*100);
      }
      else{
        data.percentage=-1;
      }
      
    },
    calculatePercentages:function()
    {
        /**a=40
         * b=50
         * income=200
         * a=40/200=20%
         * b=50/200=25%
         */

         data.allItems.exp.forEach(function(curr)
         {
           curr.calcPercentage(data.totals.inc);
         })
    },

    getPercentages:function()
    {
      var allPerc = data.allItems.exp.map(function(current)
      {
        return current.getPercentage();
      })
      return allPerc;
    },
    testingData: function() {
      console.log(data);
    },
    getBudget:function()
    {
      return{
          budget:data.budget,
          totalInc:data.totals.inc,
          totalExp:data.totals.exp,
          percentage:data.percentage

      };
    },
    deleteItem :function(type,ID)
    {
      var index;
      //Finding the index of the object we want to remove from the array
      
      //Geeting all ids present in an array
      var ids = data.allItems[type].map(function(current)
      {
        return current.id;
      });

      index=ids.indexOf(ID);
      if(index!==-1)
      {
        //Removing elements
        data.allItems[type].splice(index,1);
      }
    }
  };
})();

//UI CONTROLLER
var uiController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDesc: ".add__description",
    inputValue: ".add__value",
    inputButton: ".add__btn",
    incomeList:".income__list",
    expenseList:".expenses__list",
    budgetLabel:'.budget__value',
    expenseLabel:'.budget__expenses--value',
    incomeLabel:'.budget__income--value',
    percentageLabel:'.budget__expenses--percentage',
    container:'.container',
    itemPercentage:'.item__percentage',
    dateLabel :'.budget__title--month'
  };

  var formatNumber=function(num,type)
  {
    var numSplit,int,dec;
    /*
    + or - before number
    exactly 2 decimalpoints
    comma seperating the thousand

    2318.4567 -> 2,318.46
    2000 ->2,000.00
    */

    num=Math.abs(num);
    //toFixed is a prototype of Number
    num=num.toFixed(2);

    numSplit = num.split('.');
    int = numSplit[0];
    if(int.length>3)
    {
      int = int.substr(0,int.length-3)+','+int.substr(int.length-3,3);
    }

    dec=numSplit[1];
    return (type==='exp'?'-':'+')+int+'.'+dec;
  };
  var nodeListForeach = function(list,callback)
        {
          for(var i=0;i<list.length;i++)
          {
            callback(list[i],i);
          }
        };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDesc).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    addlistItem:function(obj,type)
    {
      var html,newHtml;
      //Create HTML string with placeholder text
      if(type==='inc')
      {
        html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      else{
        html='<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      
      //Replace the placeholder text with some actual data
      newHtml=html.replace("%id%",obj.id);
      newHtml=newHtml.replace("%description%",obj.description);
      newHtml=newHtml.replace("%value%",formatNumber(obj.value,type));
    
      //Insert the HTML into the DOM
      if(type==='inc')
      {
        const incomeList =document.querySelector(DOMstrings.incomeList);
        incomeList.insertAdjacentHTML('beforeend',newHtml);
      }
      else if(type==='exp')
      {
        const expenseList =document.querySelector(DOMstrings.expenseList);
        expenseList.insertAdjacentHTML('beforeend',newHtml);
      }

    },
    getDOMStrings: function() {
      return DOMstrings;
    },
    clearFeilds:function()
    {
      var feilds,feildItems;
      //Using querySelectorAll
      feilds = document.querySelectorAll(DOMstrings.inputDesc+','+DOMstrings.inputValue);
      
      //querySelectorAll returns a list
      //Tricking the slice method to think that list is an array
      feildItems=Array.prototype.slice.call(feilds);

      //Traversing through the array using foreach and callback method
      feildItems.forEach(function(current,index,array)
      {
        current.value="";
      });

    },
    displayBudget:function(budgetobj)
    {
      var type;
      if(budgetobj.budget>0) 
      {
        type='inc';
      }
      else{
        type='exp';
      }
      document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(budgetobj.budget,type);
      document.querySelector(DOMstrings.incomeLabel).textContent=formatNumber(budgetobj.totalInc,'inc');
      document.querySelector(DOMstrings.expenseLabel).textContent=formatNumber(budgetobj.totalExp,'exp');
      
      if(budgetobj.percentage>0)
      {
        document.querySelector(DOMstrings.percentageLabel).textContent=budgetobj.percentage+'%';
       
      }
      else{
        document.querySelector(DOMstrings.percentageLabel).textContent='---';
      }
    },

    deleteListItem : function(selectorId)
    {
      //In javascript, we can only delete a child node
      //So we first traverse to the parent node and then delete the child

      var el = document.getElementById(selectorId);
      el.parentNode.removeChild(el);
    },
    updateItemPerc(percentages)
    {
      //Returns a node list
        var feilds = document.querySelectorAll(DOMstrings.itemPercentage);

        

        nodeListForeach(feilds,function(current,index)
        {
          if(percentages[index]>0)
          {
            current.textContent=percentages[index]+'%';
          }
          else
          {
            current.textContent="--";
          }
            
        });

    },
    updateDate:function()
    {
      var now,months;
      now=new Date();
      month = now.getMonth();
      year=now.getFullYear();
      months=['January','February','March','April','May','June','July','August','September','October','November','December'];

      document.querySelector(DOMstrings.dateLabel).textContent=months[month]+','+year;

    },
    changedType:function()
    {
      var feilds = document.querySelectorAll(
        DOMstrings.inputType+','+
        DOMstrings.inputValue+','+
        DOMstrings.inputDesc);

        nodeListForeach(feilds,function(cur)
        {
            cur.classList.toggle('red-focus');
        });

        document.querySelector(DOMstrings.inputButton).classList.toggle('red');
    }
  };
})();


//GLOBAL CONTROLLER
var appController = (function(Uicntrl, budgetCtrl) {
  var setupEventListeners = function() {
    var DOM = Uicntrl.getDOMStrings();
    document.querySelector(DOM.inputButton).addEventListener("click", ctrlAddItem);
    //Keypress event, if someone presses enter key
    document.addEventListener("keypress", function(event) {
      //keycode for enter button is 13
      //Some old browsers do not support keyCode - so we also use which
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
    document.querySelector(DOM.inputType).addEventListener('change',Uicntrl.changedType);
  };

  var ctrlDeleteItem=function(event)
  {
    var itemId,splitid;
    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if(itemId)
    {
      //inc-1 or exp-1 type
      splitid=itemId.split('-');
      type=splitid[0];
      ID=parseInt(splitid[1]);

      //1. delete the item from the data structure
      budgetCtrl.deleteItem(type,ID);

      //2. Delete the item from the UI
      Uicntrl.deleteListItem(itemId);

      //3. Update and show the new budget
      updateBudget();

      //4. Calculate and update percentage
      updatePercentage();

    }
  }
  var updateBudget=function ()
  {
    //1. Calculate the budget
    budgetCtrl.calculateBudget();
  
    //2. Return the budget
    var budget=budgetCtrl.getBudget();
  
    //3. Display the budget on the UI
    Uicntrl.displayBudget(budget);
  
  };
  var ctrlAddItem = function() {
    //1. get the input data
    var inputData = Uicntrl.getInput();
    console.log(inputData);

    //Checking for invalid inputs
    if(inputData.description!==""&& !isNaN(inputData.value) && inputData.value>0)
    {
          //2. Add the item to the budget controller
          var newItem = budgetCtrl.addItem(
          inputData.type,
          inputData.description,
          inputData.value
          );

          //3. Add the item to the Ui
          Uicntrl.addlistItem(newItem,inputData.type);

          //4. clearing the input feilds
          Uicntrl.clearFeilds();

          //5. Calculate and update budget
          updateBudget();

          //6. Calculate and update percentage
          updatePercentage();
    }
    

    
  };

  var updatePercentage= function()
  {
    //1. Calculate the percentage
    budgetCtrl.calculatePercentages();

    //2. Read percentage from the budget controller
    var percs = budgetCtrl.getPercentages();

    //3. Update the UI with new percentage
    Uicntrl.updateItemPerc(percs);
  };


  return {
    init: function() {
      console.log("App has started");
      Uicntrl.updateDate();
      Uicntrl.displayBudget({budget:0,
        totalInc:0,
        totalExp:0,
        percentage:0});
      setupEventListeners();
    }
  };
})(uiController, budgetController);

appController.init();
