import './../css/client.css';
import ExcursionsAPI from './ExcursionsAPI';
import { numOfPeopleFields } from './numOfPeopleFields';
import { fields } from './fields';
import { validate } from './validate';

const api = new ExcursionsAPI();

console.log('client');

document.addEventListener('DOMContentLoaded', init);
const basket = [];
const excursions = document.querySelector('.excursions');

function init() {
  const totalPriceReset = document.querySelector('.order__total-price-value');
  totalPriceReset.innerText = '';

  const order = document.querySelector('.order');
  const ulMessages = document.createElement('ul');
  const ulMessagesExcursion = document.createElement('ul');
  excursions.addEventListener('submit', function (e) {
    addToBasket(e, numOfPeopleFields, ulMessagesExcursion);
  });
  order.addEventListener('submit', function (e) {
    confirmOrder(e, fields, order, ulMessages);
  });
  loadExcursions();
}

function loadExcursions() {
  api
    .load()
    .then((data) => {
      console.log('loadExcursions data', data);
      insertExcursion(data);
    })
    .catch((err) => console.log(err));
}

function insertExcursion(data) {
  data.forEach((item) => {
    const excursionsItemPrototype = document.querySelector(
      '.excursions__item--prototype'
    );
    const cloneExcursionsItemPrototype =
      excursionsItemPrototype.cloneNode(true);
    cloneExcursionsItemPrototype.classList.remove(
      'excursions__item--prototype'
    );

    const [header, form] = cloneExcursionsItemPrototype.children;
    const [title, description] = header.children;
    const label = form.querySelectorAll('label');
    const [adultPriceEl, childPriceEl] = label;
    const adultPrice = adultPriceEl.firstChild;
    const childPrice = childPriceEl.firstChild;

    title.innerText = item.title;
    description.innerText = item.description;
    adultPrice.textContent = `Adult: ${item.priceAdult}EUR x `;
    childPrice.textContent = `Child: ${item.priceChild}EUR x `;

    excursions.appendChild(cloneExcursionsItemPrototype);
  });
}

function addToBasket(e, numOfPeopleFields, ulMessagesExcursion) {
  e.preventDefault();

  const [adultElement, childElement] = e.target.elements;

  const title =
    e.target.previousElementSibling.querySelector(
      '.excursions__title'
    ).innerText;
  const adultNumber = Number(adultElement.value);
  const childNumber = Number(childElement.value);
  const adultPrice = adultElement.parentElement.firstChild.textContent;
  const childPrice = childElement.parentElement.firstChild.textContent;

  const adultPriceNum = Number(adultPrice.replace(/\D/g, ''));
  const childPriceNum = Number(childPrice.replace(/\D/g, ''));

  e.target.appendChild(ulMessagesExcursion);
  const errors = validate(numOfPeopleFields, e.target.elements);
  ulMessagesExcursion.innerText = '';
  if (errors.length === 0) {
    numOfPeopleFields.forEach(function (field) {
      e.target.elements[field.name].value = '';
    });
  } else {
    errors.forEach((err) => {
      const li = document.createElement('li');
      li.innerText = err;
      li.classList.add('error');
      ulMessagesExcursion.appendChild(li);
    });
  }

  pushExcursionToBasket(
    title,
    adultNumber,
    adultPriceNum,
    childNumber,
    childPriceNum
  );
  calculateAndShowSummary(
    title,
    adultNumber,
    adultPriceNum,
    childNumber,
    childPriceNum
  );
}

function pushExcursionToBasket(
  title,
  adultNumber,
  adultPrice,
  childNumber,
  childPrice
) {
  basket[basket.length] = {
    title,
    adultNumber,
    adultPrice,
    childNumber,
    childPrice,
  };
}

function calculateAndShowSummary(
  title,
  adultNumber,
  adultPrice,
  childNumber,
  childPrice
) {
  const summary = document.querySelector('.summary');
  const summaryItemPrototype = summary.querySelector(
    '.summary__item--prototype'
  );
  const cloneSummaryItemPrototype = summaryItemPrototype.cloneNode(true);
  cloneSummaryItemPrototype.classList.remove('summary__item--prototype');
  const [titleOfExcursion, totalPrice, xButton] =
    cloneSummaryItemPrototype.firstElementChild.children;
  const summaryPrices = cloneSummaryItemPrototype.lastElementChild;

  titleOfExcursion.innerText = title;
  totalPrice.innerText =
    adultNumber * adultPrice + childNumber * childPrice + 'EUR';
  summaryPrices.innerText =
    'adults: ' +
    adultNumber +
    ' x ' +
    adultPrice +
    'EUR, children: ' +
    childNumber +
    ' x ' +
    childPrice +
    'EUR';

  if (!isNaN(adultNumber) && !isNaN(childNumber)) {
    summary.appendChild(cloneSummaryItemPrototype);
    calcOrderTotalPrice(totalPrice);
    xButton.addEventListener('click', function (e) {
      removeFromBasket(e);
      calcOrderTotalPrice();
    });
  }
}

function removeFromBasket(e) {
  e.preventDefault();
  if (e.target.classList.contains('summary__btn-remove')) {
    const titleOfExcursion =
      e.target.previousElementSibling.previousElementSibling.innerText;
    const liEl = e.target.parentElement.parentElement;
    liEl.remove();
    basket.forEach((el) => {
      if (el.title === titleOfExcursion) {
        basket.shift(el);
      }
    });
    calculateTotalPrice();
  }
}

function calcOrderTotalPrice() {
  let sum = 0;
  basket.forEach((el) => {
    sum += el.adultNumber * el.adultPrice + el.childNumber * el.childPrice;
  });

  const orderTotalPrice = sum;
  const orderTotalPriceOrder = document.querySelector(
    '.order__total-price-value'
  );
  orderTotalPriceOrder.innerText = orderTotalPrice + 'EUR';
  return orderTotalPrice;
}

function confirmOrder(e, fields, order, ulMessages) {
  e.preventDefault();

  order.appendChild(ulMessages);
  const summary = order.parentElement.lastElementChild;
  const errors = validate(fields, e.target.elements);

  const [nameEl, emailEl] = order.elements;
  const name = nameEl.value;
  const email = emailEl.value;
  const totalPrice = Number(
    order.firstElementChild.firstElementChild.textContent.replace(/\D/g, '')
  );

  const newBasket = {
    excursions: basket,
    name,
    email,
    totalPrice,
  };

  ulMessages.innerText = '';
  if (errors.length === 0 && newBasket.excursions.length > 0) {
    alert('The data has been filled in correctly.');
    order.firstElementChild.firstElementChild.innerText = '';
    summary.innerText = '';
    fields.forEach(function (field) {
      e.target.elements[field.name].value = '';
    });

    api
      .addOrder(newBasket)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  } else if (newBasket.excursions.length === 0) {
    alert('Your basket is empty.');
  } else {
    errors.forEach((err) => {
      const li = document.createElement('li');
      li.innerText = err;
      li.classList.add('error');
      ulMessages.appendChild(li);
    });
  }
}

function calculateTotalPrice() {
  let sum = 0;
  basket.forEach((el) => {
    sum += el.adultNumber * el.adultPrice + el.childNumber * el.childPrice;
  });
}
