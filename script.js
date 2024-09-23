const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
const isEdit = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.forEach((item) => addItemToDom(item));
  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();
  const newItem = itemInput.value;
  //   Validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else if (checkIfItemExists(newItem)) {
    alert('That item already exists!');
    return;
  }
  // Create Item DOM Element
  addItemToDom(newItem);

  // Add item to local storage

  addItemToStorage(newItem);

  checkUI();
  itemInput.value = '';
}

function addItemToDom(item) {
  // Create List Item

  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  const amazon = document.createElement('button');
  amazon.className = 'remove-item btn-link text-red ';
  amazon.innerHTML = `<a class="buy-link" href="https://www.amazon.in/s?k=${item}" target=_"blank">Buy</a>`;
  li.appendChild(amazon);

  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}
function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}
function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(item);

  // Convert to JSON string and set to local storage

  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}
function onClickItem(e) {
  if (e.target.classList.contains('buy-link')) {
    console.log('link opened');
  } else if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    if (e.target.tagName == 'LI') {
      setItemToEdit(e.target);
    }
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();

  return itemsFromStorage.includes(item);
}
function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));
  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  // formBtn.children[0].className = 'fa-solid fa-pen';
  // console.log(formBtn.children[0].className);
  // formBtn.textContent = 'Update Item';
  formBtn.style.backgroundColor = '#228b22';
  itemInput.value = item.textContent;
}
function removeItem(item) {
  if (confirm('Are you sure?')) {
    // Remove items from DOM
    item.remove();

    // Remove item from storage
    removeItemFromStorage(item.textContent);
    checkUI();
  }
  // if (e.target.tagName == 'I') {
  //   e.target.parentElement.parentElement.remove();
  // }
}
function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  // Filter out item to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // Re-set to localstorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}
function clearItems(e) {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
    // itemList.firstChild.remove();
  }
  localStorage.removeItem('items');
  checkUI();
}
function checkUI() {
  itemInput.value = '';
  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }
  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';
  isEditMode = false;
}

function filterFunc(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// Initialize App
function init() {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterFunc);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
}

init();
