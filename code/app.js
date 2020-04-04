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

    var caculateTotal = function(type) { //exp or inc
        var sum = 0;
        data.allItems[type].forEach(function(current) {
            sum = sum + current.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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

        caculateBudget: function() {
            //caculate total income and expenses
            caculateTotal('exp');
            caculateTotal('inc');

            //tính lại số dư
            data.budget = data.totals.inc - data.totals.exp;

            //tính phần trăm số đã tiêu
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }


        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
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
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) // convert to float để tính toán
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
        },

        clearField: function() {
            var fields, fieldArray;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldArray = Array.prototype.slice.call(fields); // slice cắt thành mảng mới

            fieldArray.forEach(function(current, index, array) {
                current.value = "";
            });
            fieldArray[0].focus();
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

    var updateBudget = function() {
        // caculate the budget
        budgetCtrl.caculateBudget();

        // return the budget
        var budget = budgetCtrl.getBudget();

        // Display the budget on the UI
        console.log(budget);
    };

    var ctrlAddItem = function() {
        //1. get the field
        var input = UICtrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) { //isNaN true nếu là chuỗi, flase nếu là số
            //2. Add the item to the budgetController
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            //4 Clear the field
            UICtrl.clearField();

            //5 Caculate and update budget
            updateBudget();
        }

    };



    return {
        init: function() {
            console.log('Aplication has started');
            setupEventListener()
        }
    }

})(budgetController, UIController);

controller.init();