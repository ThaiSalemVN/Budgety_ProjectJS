/*
 *
 */
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function(type, des, val) { //type is 'inc' or 'exp'
            var newItem, ID;

            //create new Id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type].length;
            } else {
                ID = 0;
            }

            // create new item base on  'inc' or 'exp'
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //push it into our data structure
            data.allItems[type].push(newItem); //chưa check null

            // Return the new element
            return newItem; // đùng để hiện lên giao diện khi thêm
        },

        testing: function() {
            console.log(data);
        }
    }



})();


/*
 *  UI CONTROLLER
 */
var UIController = (function() {

    var DOMstrings = { // các class input field
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }

    return {

        getInput: function() { // get value input
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },

        addListItem: function(obj, type) {
            var html, newHtml, element;
            //Create HTML string with placeholder text

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%">' +
                    '<div class="item__description">%description%</div>' +
                    '<div class="right clearfix">' +
                    '<div class="item__value">%value%</div>' +
                    '<div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>'

            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="expense-%id%">' +
                    '<div class="item__description">%description%</div>' +
                    '<div class="right clearfix">' +
                    '<div class="item__value">%value%</div>' +
                    '<div class="item__percentage">21%</div>' +
                    '<div class="item__delete">' +
                    '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
            }
            //add object to html

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //show newHtml use DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); //thêm vào sau khối trước trong cùng 1 khối element

        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    }


})();


/*
 *  CONTROLLER
 */
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListener = function() {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event) { // sự kiện nhán bàn phím
            if (event.keyCode === 13 || event.which === 13) { // nhấn enter
                ctrlAddItem();
            }
        });
    }

    var ctrlAddItem = function() {
        //1. get the field
        var input = UICtrl.getInput();

        //2. Add the item to the budgetController
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        //3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);
        //4

        //5
    };



    return {
        init: function() {
            console.log('Aplication has started');
            setupEventListener()
        }
    }

})(budgetController, UIController);

controller.init();