"use strict";

const errorMsgEle = document.querySelector(`.error_message`);
const budgetInputEle = document.querySelector(`.budgetInput`);
const expenseDelEle = document.querySelector(`.expensesInput`);
const expenseAmountEle = document.querySelector(`.expensesAmount`);
const tblRecordEle = document.querySelector(`.tableData`);
const budgetCardEle = document.querySelector(`.budgetCard`);
const expensesCardEle = document.querySelector(`.expensesCard`);
const balanceCardEle = document.querySelector(`.balanceCard`);

let itemList = [];
let itemId = 0;

function btnEvents() {
    const btnBudgetCal = document.querySelector(`#btnBudget`);
    const btnExpensesCal = document.querySelector(`#btnExpenses`);

    if (!btnBudgetCal || !btnExpensesCal) {
        console.error("One or more buttons not found!");
        return;
    }

    btnBudgetCal.addEventListener(`click`, (e) => {
        e.preventDefault();
        budgetFun();
    });

    btnExpensesCal.addEventListener(`click`, (e) => {
        e.preventDefault();
        expensesFun();
    });

    // Event Delegation for Edit & Delete buttons
    tblRecordEle.addEventListener("click", (e) => {
        if (e.target.classList.contains("btnEdit")) {
            const id = parseInt(e.target.closest(".tblTrContent").dataset.id);
            editExpense(id);
        } else if (e.target.classList.contains("btnDelete")) {
            const id = parseInt(e.target.closest(".tblTrContent").dataset.id);
            deleteExpense(id);
        }
    });
}

// Ensure the script runs only when DOM is ready
document.addEventListener("DOMContentLoaded", btnEvents);

function expensesFun() {
    let expensesDescValue = expenseDelEle.value.trim();
    let expenseAmountValue = expenseAmountEle.value.trim();

    if (!expensesDescValue || !expenseAmountValue || parseInt(expenseAmountValue) <= 0) {
        errorMessage("Please Enter a valid Expense Description and Amount!");
        return;
    }

    let amount = parseInt(expenseAmountValue);
    expenseAmountEle.value = "";
    expenseDelEle.value = "";

    let expenses = {
        id: itemId++,
        title: expensesDescValue,
        amount: amount,
    };

    itemList.push(expenses);
    addExpenses(expenses);
    showBalance();
}

function addExpenses(expense) {
    const html = `<ul class="tblTrContent" data-id="${expense.id}">
                <li>${expense.id}</li>
                <li>${expense.title}</li>
                <li><span>$</span>${expense.amount}</li>
                <li>
                    <button type="button" class="btnEdit">Edit</button>
                    <button type="button" class="btnDelete">Delete</button>
                </li>
              </ul>`;

    tblRecordEle.insertAdjacentHTML("beforeend", html);
}

function editExpense(id) {
    let expense = itemList.find(item => item.id === id);

    if (!expense) return;

    // Populate input fields with existing data
    expenseDelEle.value = expense.title;
    expenseAmountEle.value = expense.amount;

    // Remove expense from UI and list
    deleteExpense(id);
}

function deleteExpense(id) {
    // Remove from UI
    let expenseElement = document.querySelector(`.tblTrContent[data-id="${id}"]`);
    if (expenseElement) {
        expenseElement.remove();
    }

    // Remove from list
    itemList = itemList.filter(expense => expense.id !== id);

    // Recalculate total and balance
    showBalance();
}

function budgetFun() {
    const budgetValue = budgetInputEle.value.trim();
   
    if (budgetValue === "" || parseInt(budgetValue) <= 0) {
        errorMessage("Please Enter a valid budget amount!");
    } else {
        budgetCardEle.textContent = parseInt(budgetValue);
        budgetInputEle.value = "";
        showBalance();
    }
}

function showBalance() {
    const budget = parseInt(budgetCardEle.textContent) || 0;
    const expenses = totalExpenses();
    const total = budget - expenses;
    balanceCardEle.textContent = isNaN(total) ? 0 : total; // Prevent NaN
}

function totalExpenses() {
    let total = itemList.reduce((acc, curr) => acc + curr.amount, 0);
    expensesCardEle.textContent = total;
    return total;
}

function errorMessage(message) {
    errorMsgEle.innerHTML = `<p>${message}</p>`;
    errorMsgEle.classList.add("error");
    setTimeout(() => {
        errorMsgEle.classList.remove("error");
    }, 2500);
}
