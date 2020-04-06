/*
 *
 */
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {

        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

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

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        deleteItem: function(type, id) {
            var ids, index;
            // id = 6
            //data.allItems[type][id]
            //ids = [1 2 3 4 5 6]
            //index = 3

            ids = data.allItems[type].map(function(current) { // map is return a new array
                return current.id;
            });

            index = ids.indexOf(id);
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLable: '.budget__income--value',
        expensesLable: '.budget__expenses--value',
        percentageLable: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLable: '.item__percentage',
        dateLable: '.budget__title--month'
    }

    var formatNumber = function(num, type) {
        var numSplit, int, dec;
        /*
            + or - before number
            2345.479 -> 2,345.48
            2000 .-> 2,000.00
        */
        num = Math.abs(num); //trả về giá trị tuyệt đối của một số
        num = num.toFixed(2); //làm tròn 2 số thập phân

        numSplit = num.split('.');

        int = numSplit[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //ex 23456 -> 23.456
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + '' + int + '.' + dec;
    };


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
                html = '<div class="item clearfix" id="inc-%id%">' +
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
                html = '<div class="item clearfix" id="exp-%id%">' +
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
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //show newHtml use DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); //thêm vào sau khối trước trong cùng 1 khối element


        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },

        clearField: function() {
            var fields, fieldArray;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldArray = Array.prototype.slice.call(fields); // slice cắt thành mảng mới

            fieldArray.forEach(function(current, index, array) {
                current.value = "";
            });
            fieldArray[0].focus();
        },

        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.incomeLable).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLable).textContent = formatNumber(obj.totalExp, 'exp');
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);


            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMstrings.percentageLable).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLable);

            var nodelistForEach = function(list, callback) {
                for (var i = 0; i < list.length; i++) {
                    callback(list[i], i);
                }
            };

            nodelistForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });

        },
        displayMonth: function() {
            var now, year, month, months;

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            now = new Date();
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLable).textContent = months[month] + ' ' + year;
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };

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
            };

            document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        });
    }

    var updateBudget = function() {
        // caculate the budget
        budgetCtrl.caculateBudget();

        // return the budget
        var budget = budgetCtrl.getBudget();

        // Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {
        // calculate percen
        budgetCtrl.calculatePercentages();

        //read percen form budget  controller
        var percentages = budgetCtrl.getPercentages();

        // Update UI with new percentages
        UICtrl.displayPercentages(percentages);
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

            // Calculate and update percentages
            updatePercentages()
        }

    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, id;
        //  event.target  -> trả về phần tử đã kích hoạt sự kiện   
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        // tồn tại is true 
        if (itemID) {
            // ex inc-1 or exp-1
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);

            //delete item form the data structure
            budgetCtrl.deleteItem(type, id);

            //delete item form the UI
            UICtrl.deleteListItem(itemID);

            //Update and show the new budget
            updateBudget();

            // Calculate and update percentages
            updatePercentages()
        }

    }


    return {
        init: function() {
            console.log('Aplication has started');
            UICtrl.displayMonth();
            setupEventListener();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
        }
    };

})(budgetController, UIController);

controller.init();