const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("money-plus");
const moneyMinus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");

function timeOut() {
  setTimeout(() => {
    clearAlert();
  }, 3000);
}

function clearAlert() {
  const currentAlert = document.querySelector(".alert");
  if (currentAlert) {
    currentAlert.remove();
  }
}

function generateID() {
  return Math.floor(Math.random() * 100000000);
}

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

//update local storage transactions

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

//Add transaction
function addTransaction(e) {
  e.preventDefault();
  if (textInput.value.trim() === "" || amountInput.value.trim() === "") {
    // alert("please fill up the blank space");
    const div = document.createElement("div");
    div.className = `alert`;
    div.appendChild(
      document.createTextNode("Please fill up the empty input(s)")
    );
    const container = document.querySelector(".container");
    const before = document.getElementById("before");
    container.insertBefore(div, before);
    timeOut();
  } else {
    const transaction = {
      id: generateID(),
      text: textInput.value,
      amount: +amountInput.value
    };
    transactions.push(transaction);
    addTransactionDom(transaction);
    updateValues();
    updateLocalStorage();

    textInput.value = "";
    amountInput.value = "";
  }
}

//Add transaction to Dom
function addTransactionDom(transaction) {
  //get sign
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.innerHTML = `
  ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
   <button class='delete-btn' onclick= 'removeTransaction(${
     transaction.id
   })'>X</button>
  `;

  list.appendChild(item);
}

//update balance, income and expense

function updateValues() {
  const amounts = transactions.map((transaction) => transaction.amount);

  const totalAmount = amounts.reduce((acc, val) => (acc += val), 0).toFixed(2);

  const income = amounts
    .filter((amount) => amount > 0)
    .reduce((acc, val) => (acc += val), 0)
    .toFixed(2);

  const expense = amounts
    .filter((amount) => amount < 0)
    .reduce((acc, val) => (acc += val), 0)
    .toFixed(2);

  moneyPlus.innerHTML = `$${income}`;
  moneyMinus.innerHTML = `$${expense}`;

  balance.innerHTML = `$${totalAmount}`;
}

//remove transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter((trans) => trans.id !== id);
  updateLocalStorage();
  init();
}

form.addEventListener("submit", addTransaction);

function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDom);
  updateValues();
}

init();
