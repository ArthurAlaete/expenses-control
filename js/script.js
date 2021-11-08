const generateID = {
    _id: 1,
    get id() { return this._id++ }
}

const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#money-plus')
const expenseDisplay = document.querySelector('#money-minus')
const balanceDisplay = document.querySelector('#balance')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#name')
const inputTransactionAmount = document.querySelector('#amount')


const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = id => {
    transactions = transactions
    .filter(transaction => transaction.id !== id)
    updateLocalStorage()
    init()
}

const addTransctionIntoDOM = transactions => {
    const operator = transactions.amount < 0 ? '-' : '+' 
    const CSSClass = transactions.amount < 0 ? 'minus' : 'plus'
    const amountWithoutOperator = Math.abs(transactions.amount)
    const li = document.createElement('li')
    li.classList.add(CSSClass)
    li.innerHTML = `${transactions.name}
    <span>${operator} R$${amountWithoutOperator}</span>
    <button class="delete-btn" onClick="removeTransaction(${transactions.id})">x</button>
    `
    transactionsUl.prepend(li)
}

const updateBalanceValues = () => {
    const transactionsAmount = transactions.map(transaction => transaction.amount)
    const total = transactionsAmount
        .reduce((accumulator, transaction) => accumulator + transaction, 0)
        .toFixed(2)
    const income = transactionsAmount
        .filter(amount => amount > 0)
        .reduce((accumulator, value) => accumulator + value, 0)
        .toFixed(2)
    const expense = Math.abs(transactionsAmount
        .filter(amount => amount < 0)
        .reduce((accumulator, value) =>  accumulator + value, 0))
        .toFixed(2)

    balanceDisplay.textContent = `R$ ${total}`
    incomeDisplay.textContent = `R$ ${income}`
    expenseDisplay.textContent = `R$ ${expense}`
}

const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransctionIntoDOM) 
    updateBalanceValues()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}


form.addEventListener('submit', event => {
    event.preventDefault()
    console.log(inputTransactionName)
    let transactionName = inputTransactionName.value
    let transactionAmount = inputTransactionAmount.value

    if (inputTransactionName.value.trim() === '' || inputTransactionAmount.value.trim() === '') {
        alert('Por favor, preencha tanto o nome quanto o valor da transação.')
        return 
    }

    const transaction = {
        id: generateID.id, 
        name: transactionName, 
        amount: Number(transactionAmount) 
    }

    transactions.push(transaction)
    init()
    updateLocalStorage()
    
    inputTransactionName.value = ''
    inputTransactionAmount.value = ''
})