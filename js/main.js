
const
    totalBalance = document.querySelector('.total__balance'),
    totalMoneyIncome = document.querySelector('.total__money-income'),
    totalMoneyExpenses = document.querySelector('.total__money-expenses'),
    historyList = document.querySelector('.history__list'),
    form = document.querySelector('#form'),
    operationName = document.querySelector('.operation__name'),
    operationAmount = document.querySelector('.operation__amount');

let dbOperation = [
    {
        id: '1',
        description: 'Получил зарплату',
        amount: 30000,
    },
    {
        id: '2',
        description: 'Квартплата',
        amount: -10000,
    },
    {
        id: '3',
        description: 'Обувь',
        amount: -6000,
    },
];

const storedData = JSON.parse(localStorage.getItem('calc'));
dbOperation = storedData || dbOperation;

const generateId = () => `vit${Math.round(Math.random() * 1e8).toString(16)}`

const renderOperations = (op) => {
    const className = op.amount < 0 ? 
        'history__item-minus' : 
        'history__item-plus';

    const listItem = document.createElement('li');

    listItem.classList.add('history__item');
    listItem.classList.add(className);

    listItem.innerHTML = `${op.description}
        <span class="history__money">${op.amount} ₽</span>
        <button class="history__delete" data-id="${op.id}">x</button>
    `;

    historyList.append(listItem);
}

const updateBalance = () => {
    const resultIncome = dbOperation
        .filter((item) => item.amount > 0)
        .reduce((res, it) => res + it.amount, 0);
    
    const resultExpences = dbOperation
        .filter((item) => item.amount < 0)
        .reduce((res, it) => res + it.amount, 0);
    
    totalMoneyIncome.textContent = resultIncome + ' ₽';
    totalMoneyExpenses.textContent = resultExpences + ' ₽';
    totalBalance.textContent = (resultIncome + resultExpences) + ' ₽';
}

const addOperation = (event) => {
    event.preventDefault();

    const 
        operationNameValue = operationName.value,
        operationAmountValue = operationAmount.value;

    operationName.style.borderColor = '';
    operationAmount.style.borderColor = '';

    if (operationNameValue && operationAmountValue) {
        const operation = {
            id: generateId(),
            description: operationNameValue,
            amount: parseFloat(operationAmountValue)
        };

        dbOperation.push(operation);
        init();

        operationName.value = '';
        operationAmount.value = '';
    } else {
        if (!operationNameValue) operationName.style.borderColor = 'red';
        if (!operationAmountValue) operationAmount.style.borderColor = 'red';

    }
        
};

const deleteOperation = (event) => {
    const trg = event.target;
    
    if (trg.classList.contains('history__delete')) {
        // dbOperation = dbOperation
        //     .filter(it => it.id !== trg.dataset.id);
        const idx = dbOperation.findIndex(it => it.id === trg.dataset.id);
        if (idx >= 0){
            dbOperation.splice(idx, 1);
            init();
        }
    }
};

const init = () => {
    historyList.textContent = '';
    dbOperation.forEach(renderOperations);
    updateBalance();
    localStorage.setItem('calc', JSON.stringify(dbOperation));
}

form.addEventListener('submit', addOperation);
historyList.addEventListener('click', deleteOperation)

init()