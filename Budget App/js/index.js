class Budget {
  constructor (name, type, amount) {
    this.name = name;
    this.type = type;
    this.amount = amount;
  }

  renderRow() {
    return `<div class="o-home__budget-item o-home__budget-item_${this.type}">
      <div class="o-home__budget-item_title-div">
        ${this.name}
      </div>
      <div class="o-home__budget-item_amount-div">
        <span class="o-home__budget-item_amount ${this.type == 'income' ? 'o-home__budget-item_amount_plus' : this.type == 'expenses' ? 'o-home__budget-item_amount_minus' : ""}">
          ${this.type == 'income' ? "+"+addCommas(this.amount) : this.type == 'expenses' ? "-"+addCommas(this.amount): addCommas(this.amount)}
        </span>
      </div>
    </div>`
  }
}

function renderIncome(budgets) {
  const container = document.querySelector("#list-container")
  const str = budgets.map(b => b.renderRow()).join("\n")
  container.innerHTML = str
}

function renderExpenses(budgets) {
  const container = document.querySelector("#list-container")
  const str = budgets.map(b => b.renderRow()).join("\n")
  container.innerHTML = str
}

function renderAllTrans(budgets) {
  const container = document.querySelector("#list-container")
  const str = budgets.map(b => b.renderRow()).join("\n")
  container.innerHTML = str
}

function renderTotalIncome(budgets) {
  const totalIncome = document.querySelector("#total-income")
  totalIncome.innerHTML = addCommas(budgets)
}

function renderBalance(amount) {
  const container = document.querySelector("#total-balance")
  container.innerHTML = addCommas(amount)
}


function removeClass(wrapper, cl) {
  var element = document.querySelector(wrapper);
  element.classList.remove(cl);
}

function addClass(el, newClass) {
  const element = document.querySelectorAll(el);
          
  element.forEach(d => {
    d.classList.add(newClass)
  })
}

function addCommas(amount) {
  return amount.toLocaleString("en-US");
}

async function init() {
  let incomes = []
  let expenses = []
  let allTrans = []
  let tab = "income"

  function render() {
    let total = 0
    document.querySelector("#name-input").placeholder = "Input " + tab

    if (tab == 'income') {
      renderIncome(incomes)
      total = incomes.map(b => b.amount).reduce((a, b) => a + b, 0)
      document.querySelector("#total-income").style.display = 'block'
      document.querySelector("#input-section").style.display = 'block'
      addClass("#button-income-tab", "active")
      removeClass("#button-expenses-tab", "active")
      removeClass("#button-all-trans-tab", "active")
    } else if (tab == 'expenses'){
      renderExpenses(expenses)
      total = expenses.map(b => b.amount).reduce((a, b) => a + b, 0)
      document.querySelector("#total-income").style.display = 'block'
      document.querySelector("#input-section").style.display = 'block'
      removeClass("#button-income-tab", "active")
      addClass("#button-expenses-tab", "active")
      removeClass("#button-all-trans-tab", "active")
    } else {
      renderAllTrans(allTrans)
      document.querySelector("#total-income").style.display = 'none'
      document.querySelector("#input-section").style.display = 'none'
      removeClass("#button-income-tab", "active")
      removeClass("#button-expenses-tab", "active")
      addClass("#button-all-trans-tab", "active")
    }

    let totalBalance = 0
    totalBalance += incomes.map(b => b.amount).reduce((a, b) => a + b, 0)

    totalBalance -= expenses.map(b => b.amount).reduce((a, b) => a + b, 0)

    renderTotalIncome(total)

    renderBalance(totalBalance)
  }

  const nameInput = document.querySelector("#name-input")
  const amountInput = document.querySelector("#amount-input")

  const statusTrans = document.querySelector("#status-trans")
  statusTrans.innerHTML = tab.toUpperCase()

  const submitButton = document.querySelector("#submit-button")
  const clearButton = document.querySelector("#clear-button")
  
  const incomeTab = document.querySelector("#button-income-tab")
  const expensesTab = document.querySelector("#button-expenses-tab")
  const transTab = document.querySelector("#button-all-trans-tab")

  async function handleError(code) {
    let textErr = ""
    let el = ""
    switch (code) {
      case 401:
        textErr = "Input your " + tab
        el = "#name-input"
        break;
      case 402:
        textErr = "Input your amount"
        el = "#amount-input"
        break;
      default:
        textErr = "Something went wrong"
        code = 500
    }
    blankInput(textErr, el)
  }

  async function blankInput(textErr, el) {
    addClass(el, "o-home__input_error")
  }

  nameInput.addEventListener("focus", e => {
    removeClass("#name-input", "o-home__input_error")
  })

  amountInput.addEventListener("focus", e => {
    removeClass("#amount-input", "o-home__input_error")
  })

  submitButton.addEventListener("click", e => {
    const name = nameInput.value
    const type = tab
    const amount = Number(amountInput.value)
    
    if(!name && !amount) {
      handleError(401)
      handleError(402)
    } else if(!name) {
      handleError(401)
    } else if(!amount) {
      console.log("hrsunya yg ini")
      handleError(402)
    } else {
      const budget = new Budget(name, type, amount)

      if (type == "income") {
        incomes.push(budget)
        allTrans.push(budget)
        if(tab != 'transaction') {
          tab = "income"
        }
      } else {
        expenses.push(budget)
        allTrans.push(budget)
        if(tab != 'transaction') {
          tab = "expenses"
        }
      }
      nameInput.value = ""
      amountInput.value = ""
      render()
    } 
  })

  clearButton.addEventListener("click", e => {
    incomes = []
    expenses = []
    allTrans = []
    tab = "income"
    const statusTrans = document.querySelector("#status-trans")
    statusTrans.innerHTML = tab.toUpperCase()
    render()
  })

  incomeTab.addEventListener("click", e => {
    tab = "income"
    statusTrans.innerHTML = tab.toUpperCase()
    removeClass("#list-container", "o-home__list-container_transaction")
    render()
  })

  expensesTab.addEventListener("click", e => {
    tab = "expenses"
    statusTrans.innerHTML = tab.toUpperCase()
    removeClass("#list-container", "o-home__list-container_transaction")
    render()
  })

  transTab.addEventListener("click", e => {
    tab = "transaction"
    addClass("#list-container", "o-home__list-container_transaction")
    statusTrans.innerHTML = tab.toUpperCase()
    render()
  })

  render()
}

window.onload = init