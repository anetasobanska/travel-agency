import './../css/client.css';
import ExcursionsAPI from './ExcursionsAPI';
// const api = new ExcursionsAPI();

console.log('client');

// document.addEventListener('DOMContentLoaded', init);
// const basket = [];
// const excursions = document.querySelector('.excursions');

// function init() {
//   const totalPriceReset = document.querySelector('.order__total-price-value');
//   totalPriceReset.innerText = '';
//   const fields = [
//     {
//       name: 'name',
//       label: 'Imię i nazwisko',
//       required: true,
//       pattern: '^[a-zA-Z –-]+$',
//     },
//     {
//       name: 'email',
//       label: 'Email',
//       required: true,
//       pattern: '^[a-z0-9]+@[a-z]+.[a-z]{2,3}$',
//     },
//   ];
//   const excursionFields = [
//     {
//       name: 'adults',
//       label: 'Dorosły',
//       type: 'number',
//     },
//     {
//       name: 'children',
//       label: 'Dziecko',
//       type: 'number',
//     },
//   ];
//   const order = document.querySelector('.order');
//   const ulMessages = document.createElement('ul');
//   const ulMessagesExcursion = document.createElement('ul');

//   excursions.addEventListener('submit', function (e) {
//     addToBasket(e, excursionFields, ulMessagesExcursion);
//   });
//   order.addEventListener('submit', function (e) {
//     confirmOrder(e, fields, order, ulMessages);
//   });

//   loadExcursions();
// }

// function loadExcursions() {
//   api
//     .load()
//     .then((data) => {
//       console.log('data', data);
//       createLiEl(data);
//     })
//     .catch((err) => console.log(err));
// }

// function createLiEl(data) {
//   const liEl = data.forEach((arr) => {
//     const excursionsItemPrototype = document.querySelector(
//       '.excursions__item--prototype'
//     );
//     const cloneExcursionsItemPrototype =
//       excursionsItemPrototype.cloneNode(true);
//     cloneExcursionsItemPrototype.classList.remove(
//       'excursions__item--prototype'
//     );

//     const [header, form] = cloneExcursionsItemPrototype.children;
//     const [title, description] = header.children;
//     const [adultPrice, childPrice] = form.elements;

//     title.innerText = arr[1];
//     description.innerText = arr[2];
//     adultPrice.previousElementSibling.innerText = arr[3];
//     childPrice.previousElementSibling.innerText = arr[4];

//     excursions.appendChild(cloneExcursionsItemPrototype);
//   });

//   return liEl;
// }

// function addToBasket(e, excursionFields, ulMessagesExcursion) {
//   e.preventDefault();

//   const adultElement = e.target.elements[0];
//   const childElement = e.target.elements[1];

//   const title =
//     e.target.previousElementSibling.querySelector(
//       '.excursions__title'
//     ).innerText;
//   const adultNumber = Number(adultElement.value);
//   const childNumber = Number(childElement.value);
//   const adultPrice = Number(adultElement.previousElementSibling.innerText);
//   const childPrice = Number(childElement.previousElementSibling.innerText);

//   e.target.appendChild(ulMessagesExcursion);
//   const errors = validate(excursionFields, e.target.elements);
//   ulMessagesExcursion.innerText = '';
//   if (errors.length === 0) {
//     excursionFields.forEach(function (field) {
//       e.target.elements[field.name].value = '';
//     });
//   } else {
//     errors.forEach((err) => {
//       const li = document.createElement('li');
//       li.innerText = err;
//       li.classList.add('error');
//       ulMessagesExcursion.appendChild(li);
//     });
//   }

//   pushExcursionToBasket(
//     title,
//     adultNumber,
//     adultPrice,
//     childNumber,
//     childPrice
//   );
//   calculateAndShowSummary(
//     title,
//     adultNumber,
//     adultPrice,
//     childNumber,
//     childPrice
//   );
// }

// function pushExcursionToBasket(
//   title,
//   adultNumber,
//   adultPrice,
//   childNumber,
//   childPrice
// ) {
//   basket[basket.length] = {
//     title,
//     adultNumber,
//     adultPrice,
//     childNumber,
//     childPrice,
//   };
// }

// function calculateAndShowSummary(
//   title,
//   adultNumber,
//   adultPrice,
//   childNumber,
//   childPrice
// ) {
//   const summary = document.querySelector('.summary');
//   const summaryItemPrototype = summary.querySelector(
//     '.summary__item--prototype'
//   );
//   const cloneSummaryItemPrototype = summaryItemPrototype.cloneNode(true);
//   cloneSummaryItemPrototype.classList.remove('summary__item--prototype');
//   const [titleOfExcursion, totalPrice, xButton] =
//     cloneSummaryItemPrototype.firstElementChild.children;
//   const summaryPrices = cloneSummaryItemPrototype.lastElementChild;

//   titleOfExcursion.innerText = title;
//   totalPrice.innerText =
//     adultNumber * adultPrice + childNumber * childPrice + 'PLN';
//   summaryPrices.innerText =
//     'dorośli: ' +
//     adultNumber +
//     ' x ' +
//     adultPrice +
//     'PLN, dzieci: ' +
//     childNumber +
//     ' x ' +
//     childPrice +
//     'PLN';

//   if (!isNaN(adultNumber) && !isNaN(childNumber)) {
//     summary.appendChild(cloneSummaryItemPrototype);
//     calcOrderTotalPrice(totalPrice);
//     xButton.addEventListener('click', function (e) {
//       removeFromBasket(e);
//       calcOrderTotalPrice();
//     });
//   }
// }

// function removeFromBasket(e) {
//   e.preventDefault();
//   if (e.target.classList.contains('summary__btn-remove')) {
//     const titleOfExcursion =
//       e.target.previousElementSibling.previousElementSibling.innerText;
//     const liEl = e.target.parentElement.parentElement;
//     liEl.remove();
//     basket.forEach((el) => {
//       if (el.title === titleOfExcursion) {
//         basket.shift(el);
//       }
//     });
//     calculateTotalPrice();
//   }
// }

// function calcOrderTotalPrice() {
//   let sum = 0;
//   basket.forEach((el) => {
//     sum += el.adultNumber * el.adultPrice + el.childNumber * el.childPrice;
//   });

//   const orderTotalPrice = sum;
//   const orderTotalPriceOrder = document.querySelector(
//     '.order__total-price-value'
//   );
//   orderTotalPriceOrder.innerText = orderTotalPrice + 'PLN';
//   return orderTotalPrice;
// }

// function confirmOrder(e, fields, order, ulMessages) {
//   e.preventDefault();

//   order.appendChild(ulMessages);
//   const summary = order.parentElement.lastElementChild;
//   const errors = validate(fields, e.target.elements);

//   ulMessages.innerText = '';
//   if (errors.length === 0) {
//     alert('Dane zostaly wypelnione prawidlowo');
//     order.firstElementChild.firstElementChild.innerText = '';
//     summary.innerText = '';
//     fields.forEach(function (field) {
//       e.target.elements[field.name].value = '';
//     });
//   } else {
//     errors.forEach((err) => {
//       const li = document.createElement('li');
//       li.innerText = err;
//       li.classList.add('error');
//       ulMessages.appendChild(li);
//     });
//   }
// }

// function validate(fields, data) {
//   const errors = [];

//   fields.forEach(function (field) {
//     const value = data[field.name].value;

//     if (field.required) {
//       if (value.length === 0) {
//         errors.push('Dane w polu ' + field.label + ' są wymagane.');
//       }
//     }

//     if (field.type === 'number') {
//       if (Number.isNaN(Number(value))) {
//         errors.push('Dane w polu ' + field.label + ' muszą być liczbą.');
//       }
//     }

//     if (field.pattern) {
//       const reg = new RegExp(field.pattern);
//       if (!reg.test(value)) {
//         errors.push(
//           'Dane w polu ' +
//             field.label +
//             ' zawierają niedozwolone znaki lub nie są zgodne z przyjętym w Polsce wzorem.'
//         );
//       }
//     }
//   });

//   return errors;
// }

// function calculateTotalPrice() {
//   let sum = 0;
//   basket.forEach((el) => {
//     sum += el.adultNumber * el.adultPrice + el.childNumber * el.childPrice;
//   });
// }
