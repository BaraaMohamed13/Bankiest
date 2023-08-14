'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-08-18T21:31:17.178Z',
    '2023-07-23T07:42:02.383Z',
    '2023-08-22T09:15:04.904Z',
    '2023-06-01T10:17:24.185Z',
    '2023-07-08T14:11:59.604Z',
    '2023-07-27T17:01:17.194Z',
    '2023-07-11T23:36:17.929Z',
    '2023-07-12T10:51:36.790Z',
  ],
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-05-01T13:15:33.035Z',
    '2022-04-30T09:48:16.867Z',
    '2022-07-25T06:04:23.907Z',
    '2023-07-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2023-06-25T18:49:59.371Z',
    '2023-07-26T12:01:20.894Z',
  ],
};
const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 940, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2022-07-01T13:15:33.035Z',
    '2022-02-30T09:48:16.867Z',
    '2022-01-25T06:04:23.907Z',
    '2023-05-25T14:18:46.235Z',
    '2023-03-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2023-05-25T18:49:59.371Z',
    '2023-06-26T12:01:20.894Z',
  ],
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2022-03-01T13:15:33.035Z',
    '2022-05-30T09:48:16.867Z',
    '2022-06-25T06:04:23.907Z',
    '2023-02-25T14:18:46.235Z',
    '2023-07-05T16:33:06.386Z',
    '2023-06-10T14:43:26.374Z',
    '2023-07-25T18:49:59.371Z',
    '2023-07-26T12:01:20.894Z',
  ],
};
const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//functions

//calculate days passed since each movement
const daysBetween = date2 => {
  const oneDay = 24 * 60 * 60 * 1000;
  const date1 = new Date();
  const secondDate = new Date(date2);
  const diffDays = Math.round(Math.abs((date1 - secondDate) / oneDay));
  if (diffDays === 0) {
    return 'Today.';
  } else {
    return `${diffDays} Days ago.`;
  }
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = `${daysBetween(date)}`;
    const html = `
      <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${mov.toFixed(2)}€</div>
    </div>
  `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//calculate current date
const date = new Date();
const options = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
};
labelDate.textContent = date.toLocaleString('en-US', options);
//username is the first letter of each word in a name
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = acc => {
  // display movements
  displayMovements(acc);

  // display balance
  calcDisplayBalance(acc);

  //display summary
  calcDisplaySummary(acc);
};
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => {
    return acc + cur;
  });
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

let currentAccount;
//login button handler
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    user => user.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('logged in');
    //display UI and message
    labelWelcome.textContent = `Welcome back ${currentAccount.owner}`;
    containerApp.style.opacity = '100%';

    //clear fields after login

    inputLoginUsername.value = inputLoginPin.value = '';

    updateUI(currentAccount);
  } else {
    alert(`An account with this username and password doesn't exist`);
  }
  //transfer button handler
  btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();

    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find(
      acc => acc.username === inputTransferTo.value
    );
    console.log(amount, receiverAcc);

    inputTransferAmount.value = inputTransferTo.value = '';
    if (
      amount > 0 &&
      currentAccount.balance >= amount &&
      receiverAcc.username !== currentAccount.username &&
      receiverAcc
    ) {
      console.log('transfer valid');

      //Transfer logic
      receiverAcc.movements.push(amount);
      currentAccount.movements.push(-amount);
      currentAccount.movementsDates.push(new Date());
      receiverAcc.movementsDates.push(new Date());
      updateUI(currentAccount);
    }
  });
});
//add loan button handler
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date());
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});
//close account button handler
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = '0';
    labelWelcome.textContent = `Log in to get started`;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
