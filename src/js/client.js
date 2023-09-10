import './../css/client.css';
import ExcursionsAPI from './ExcursionsAPI';
const api = new ExcursionsAPI();

console.log('client');

document.addEventListener('DOMContentLoaded', init);
const basket = [];
const excursions = document.querySelector('.excursions');

function init() {
  const totalPriceReset = document.querySelector('.order__total-price-value');
  totalPriceReset.innerText = '';
  const fields = [
    {
      name: 'name',
      label: 'Imię i nazwisko',
      required: true,
      pattern: '^[a-zA-Z –-]+$',
    },
    {
      name: 'email',
      label: 'Email',
      required: true,
      pattern: '^[a-z0-9]+@[a-z]+.[a-z]{2,3}$',
    },
  ];
  const excursionFields = [
    {
      name: 'adults',
      label: 'Dorosły',
      type: 'number',
    },
    {
      name: 'children',
      label: 'Dziecko',
      type: 'number',
    },
  ];
  const order = document.querySelector('.order');
  const ulMessages = document.createElement('ul');
  const ulMessagesExcursion = document.createElement('ul');
  excursions.addEventListener('submit', function (e) {
    addToBasket(e, excursionFields, ulMessagesExcursion);
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

function addToBasket(e, excursionFields, ulMessagesExcursion) {
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
  const errors = validate(excursionFields, e.target.elements);
  ulMessagesExcursion.innerText = '';
  if (errors.length === 0) {
    excursionFields.forEach(function (field) {
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

  api
    .addOrder({ title, adultNumber, adultPriceNum, childNumber, childPriceNum })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
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
    adultNumber * adultPrice + childNumber * childPrice + 'PLN';
  summaryPrices.innerText =
    'dorośli: ' +
    adultNumber +
    ' x ' +
    adultPrice +
    'PLN, dzieci: ' +
    childNumber +
    ' x ' +
    childPrice +
    'PLN';

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
  orderTotalPriceOrder.innerText = orderTotalPrice + 'PLN';
  return orderTotalPrice;
}

function confirmOrder(e, fields, order, ulMessages) {
  e.preventDefault();

  order.appendChild(ulMessages);
  const summary = order.parentElement.lastElementChild;
  const errors = validate(fields, e.target.elements);

  ulMessages.innerText = '';
  if (errors.length === 0) {
    alert('Dane zostaly wypelnione prawidlowo');
    order.firstElementChild.firstElementChild.innerText = '';
    summary.innerText = '';
    fields.forEach(function (field) {
      e.target.elements[field.name].value = '';
    });
  } else {
    errors.forEach((err) => {
      const li = document.createElement('li');
      li.innerText = err;
      li.classList.add('error');
      ulMessages.appendChild(li);
    });
  }
}

function validate(fields, data) {
  const errors = [];

  fields.forEach(function (field) {
    const value = data[field.name].value;

    if (field.required) {
      if (value.length === 0) {
        errors.push('Dane w polu ' + field.label + ' są wymagane.');
      }
    }

    if (field.type === 'number') {
      if (Number.isNaN(Number(value))) {
        errors.push('Dane w polu ' + field.label + ' muszą być liczbą.');
      }
    }

    if (field.pattern) {
      const reg = new RegExp(field.pattern);
      if (!reg.test(value)) {
        errors.push(
          'Dane w polu ' +
            field.label +
            ' zawierają niedozwolone znaki lub nie są zgodne z przyjętym w Polsce wzorem.'
        );
      }
    }
  });

  return errors;
}

function calculateTotalPrice() {
  let sum = 0;
  basket.forEach((el) => {
    sum += el.adultNumber * el.adultPrice + el.childNumber * el.childPrice;
  });
}
