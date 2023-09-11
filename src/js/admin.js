import './../css/admin.css';
import { validate } from './validate';
import { excursionFields } from './excursionFields';

import ExcursionsAPI from './ExcursionsAPI';
const api = new ExcursionsAPI();

console.log('admin');

const ulMessagesExcursion = document.createElement('ul');

document.addEventListener('DOMContentLoaded', init);

function init() {
  loadExcursions();
  addExcursion();
  removeExcursion();
  updateExcursions();
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

function addExcursion() {
  const formEl = document.querySelector('.form');
  formEl.addEventListener('submit', function (e) {
    e.preventDefault();
    const [titleEl, descriptionEl, priceAdultEl, priceChildEl] =
      e.target.elements;
    const title = titleEl.value;
    const description = descriptionEl.value;
    const priceAdult = Number(priceAdultEl.value);
    const priceChild = Number(priceChildEl.value);

    e.target.appendChild(ulMessagesExcursion);
    const errors = validate(excursionFields, e.target.elements);
    clearElement(ulMessagesExcursion);
    if (errors.length === 0) {
      excursionFields.forEach(function (field) {
        e.target.elements[field.name].value = '';
      });
      api
        .add({ title, description, priceAdult, priceChild })
        .catch((err) => console.error(err))
        .finally(() => {
          const excursionsList = document.querySelectorAll(
            '.excursions__item:not(.excursions__item--prototype)'
          );
          excursionsList.forEach((el) => el.remove());
          loadExcursions();
        });
    } else {
      errors.forEach((err) => {
        const li = document.createElement('li');
        li.innerText = err;
        li.classList.add('error');
        ulMessagesExcursion.appendChild(li);
      });
    }
  });
}

function insertExcursion(data) {
  const excursions = document.querySelector('.excursions');
  data.forEach((item) => {
    const liProto = document.querySelector('.excursions__item--prototype');
    const liProtoClone = liProto.cloneNode(true);
    liProtoClone.classList.remove('excursions__item--prototype');
    excursions.appendChild(liProtoClone);

    const [header, form] = liProtoClone.children;
    const [title, description] = header.children;
    const [adultPriceEl, childPriceEL] = form.children;
    const adultPrice = adultPriceEl.firstElementChild.lastElementChild;
    const childPrice = childPriceEL.firstElementChild.lastElementChild;

    title.innerText = item.title;
    description.innerText = item.description;
    adultPrice.innerText = item.priceAdult;
    childPrice.innerText = item.priceChild;
    liProtoClone.dataset.id = item.id;

    addEditableData(title, description, adultPrice, childPrice);
  });
}

function removeExcursion() {
  const excursions = document.querySelector('.excursions');

  excursions.addEventListener('click', (e) => {
    e.preventDefault();
    const targetEl = e.target;
    if (targetEl.classList.contains('excursions__field-input--remove')) {
      const id = targetEl.parentElement.parentElement.parentElement.dataset.id;
      api
        .remove(id)
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
        .finally(() => {
          targetEl.parentElement.parentElement.parentElement.parentElement.removeChild(
            targetEl.parentElement.parentElement.parentElement
          );
        });
    }
  });
}

function updateExcursions() {
  const excursions = document.querySelector('.excursions');
  excursions.addEventListener('click', (e) => {
    const targetEl = e.target;
    if (targetEl.classList.contains('excursions__field-input--update')) {
      const parentEl = targetEl.parentElement.parentElement.parentElement;
      const editableFieldList = parentEl.querySelectorAll('[data=editable]');
      const isEditable = [...editableFieldList].every(
        (field) => field.isContentEditable
      );

      if (isEditable) {
        const id = parentEl.dataset.id;
        const data = {
          title: editableFieldList[0].innerText,
          description: editableFieldList[1].innerText,
          priceAdult: Number(editableFieldList[2].innerText),
          priceChild: Number(editableFieldList[3].innerText),
        };
        api
          .update(id, data)
          .catch((err) => console.error(err))
          .finally(() => {
            targetEl.value = 'edit';
            editableFieldList.forEach((field) => {
              field.contentEditable = false;
              field.style.color = 'black';
            });
          });
      } else {
        targetEl.value = 'save';
        editableFieldList.forEach((field) => {
          field.contentEditable = true;
          field.style.color = 'red';
        });
      }
    }
  });
}

function clearElement(element) {
  element.innerHTML = '';
}

function addEditableData(title, description, adultPrice, childPrice) {
  title.setAttribute('data', 'editable');
  description.setAttribute('data', 'editable');
  adultPrice.setAttribute('data', 'editable');
  childPrice.setAttribute('data', 'editable');
}
