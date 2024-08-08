const inputState = document.getElementById('selected-state');
const inputCity = document.getElementById('selected-city');
const shippingFee = document.querySelector('.shipping-fee');
const additionalDiscountElement = document.querySelector('.promotion-value');
const userAddressDetails = {
  'first-name': '',
  'last-name': '',
  'phone-number': '',
  email: '',
  'main-address': '',
  'second-address': '',
  'selected-state': '',
  'selected-city': '',
  'zip-code': '',
};
if (!window.localStorage.getItem('userAddressDetails')) {
  window.localStorage.setItem(
    'userAddressDetails',
    JSON.stringify(userAddressDetails)
  );
}
console.log(window.localStorage.getItem('userAddressDetails'));

let purchasedProducts = JSON.parse(
  window.localStorage.getItem('purchased-products')
);
const submitAddress = document.forms[0];

window.addEventListener('DOMContentLoaded', function () {
  const getUserAddressDetails = JSON.parse(
    window.localStorage.getItem('userAddressDetails')
  );

  function insertFormData() {
    const formData = new FormData(document.forms[0]);
    for (const [key] of formData) {
      console.log(document.forms[0].querySelector(`[name=${key}]`));
      const targetElement = document.forms[0].querySelector(`[name=${key}]`);
      targetElement.value = getUserAddressDetails[key];
    }
  }
  insertFormData();
});

shippingFee.textContent = purchasedProducts[0].shippingFee;
additionalDiscountElement.textContent =
  purchasedProducts[0].additionalDiscountValue;
const totalPrice = document.querySelector('.total-price');
const checkoutPrice = document.querySelector('.checkout-price');
checkoutPrice.textContent = totalPrice.textContent;
async function fetchState() {
  try {
    const fetchState = await fetch('../backend/eg.json');
    const stateData = await fetchState.json();
    if (!fetchState.ok) {
      console.log('Resource is not avail');
    }

    return stateData;
  } catch (error) {
    console.log('There is network error', error);
  }
}

async function insertStateData() {
  const data = await fetchState();
  console.log(data[1]['admin_name']);
  data.forEach((state) => {
    inputState.insertAdjacentHTML(
      'beforeend',
      `<option value=${state['admin_name']} > ${state['admin_name']} </option>`
    );
  });

  data.forEach((city) => {
    inputCity.insertAdjacentHTML(
      'beforeend',
      `<option value=${city.city}>${city.city}</option>`
    );
  });

  const getUserAddressDetails = JSON.parse(
    window.localStorage.getItem('userAddressDetails')
  );
  if (getUserAddressDetails) {
    inputState.value = getUserAddressDetails['selected-state'] || '';
    inputCity.value = getUserAddressDetails['selected-city'] || '';
  }
}
insertStateData();

async function fetchData() {
  let isPurchased = purchasedProducts.length;
  if (!isPurchased) {
    handleEmptyCart(
      "You <span style='color:red'> didn't </span>add products yet !"
    );
  } else {
    try {
      const fetchData = await fetch('../backend/data.json');
      const { products } = await fetchData.json();
      let filteredProducts = products
        .filter((product) =>
          purchasedProducts.some((item) => item.productID === product.id)
        )
        .map((product) => {
          let item = purchasedProducts.find(
            (item) => item.productID === product.id
          );
          return {
            ...product,
            quantity: item.quantity,
            shippingFee: item.shippingFee,
            additionalDiscountValue: item.additionalDiscountValue,
          };
        });
      const itemsContainer = document.querySelector(
        '.products-details-of-checkout'
      );
      for (let i = 0; i < filteredProducts.length; i++) {
        itemsContainer.insertAdjacentHTML(
          'beforeend',
          ` <div
          class="single-added-item-details row gx-0 gap-3 align-items-center p-3 mb-3 border border-3 rounded-1"
          id="_${filteredProducts[i].id}"
        >
          <div class="added-item-description row g-0 col-lg-3 text-center">
            <span class="col-md-12"
              ><img
                src="./assets/images/test.jpg"
                alt="${filteredProducts[i].title}"
                style="width: 100%"
              />
            </span>
            <div>
              <p
                class="text-light mt-4 col-md-12 border border-1 bg-light text-dark rounded-1 p-2 responsive-text"
              >
                ${filteredProducts[i].title}
              </p>
            </div>
          </div>
          <div
            class="added-item-pricing m-0 p-3 rounded-1 text-center col-lg-8 row g-0"
          >
            <div
              class="count-of-items m-0 p-0 bg- col-md-3 d-flex align-items-center justify-content-center border border-0 bg-light text-dark"
            >
              <p class="m-0 p-0">
                <span class="text-light">${filteredProducts[i].quantity}</span>
                <span class="iconamoon--arrow-down-2-bold"></span>
              </p>
              <ul class="display-none-toggle m-0 p-0 bg-danger">
                <li>22</li>
                <li>66</li>
              </ul>
            </div>

            <p
              class="price text-center text-light m-0 p-0 col-md-6 bg-success d-flex align-items-center justify-content-center"
            >
              EGP ${(
                filteredProducts[i].price * filteredProducts[i].quantity
              ).toFixed(2)}
            </p>
            <div class="col-md-3 bg-body-secondary remove-parent">
              <button
                type="button"
                class="remove-btn"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-custom-class="custom-tooltip"
                data-bs-title="Remove"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-trash"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
                  ></path>
                  <path
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>`
        );
        let addedItem = itemsContainer.lastElementChild;
        generateStock.call(addedItem, filteredProducts[i].stock);
      }
      handleOrderSummary();
      // end of fetching
    } catch (error) {
      console.log('Failed to fetch products to cart page !');
    }
  }
}
fetchData();

function generateStock(countOfStock) {
  const dropDownBtn = this.querySelector('.count-of-items');
  const dropDownContainer = dropDownBtn.querySelector('ul');

  dropDownContainer.innerHTML = '';
  countOfStock = countOfStock > 10 ? 10 : countOfStock; // Client can't add more than 10 pieces of single product
  for (let i = 0; i < countOfStock; i++) {
    dropDownContainer.insertAdjacentHTML('beforeend', `<li>${i + 1}</li>`);
  }
  this.querySelector('.remove-btn').addEventListener('click', function () {
    const removedElementId = this.parentElement.parentElement.parentElement.id;
    this.parentElement.parentElement.parentElement.remove();
    // update summary order
    handleOrderSummary();
    // check cart if all elements is removed or not to display empty cart message

    purchasedProducts = purchasedProducts.filter(
      (ele) => ele.productID !== Number(removedElementId.slice(1))
    );
    window.localStorage.setItem(
      'purchased-products',
      JSON.stringify(purchasedProducts)
    );
    checkoutPrice.textContent = totalPrice.textContent;

    if (!purchasedProducts.length) {
      handleEmptyCart(
        "You have <span style='color:red'> removed </span> the products !"
      );
    }
  });

  onSelectStock(dropDownBtn);
}

//  select stock element

function onSelectStock(dropDownBtn) {
  dropDownBtn.addEventListener('click', function (event) {
    this.querySelector('ul').classList.toggle('display-none-toggle');
    const selectArrow = this.querySelector('p > span:nth-child(2)');
    const isArrowDown = selectArrow.className.includes('down');
    selectArrow.className = isArrowDown
      ? 'iconamoon--arrow-up-2-bold'
      : 'iconamoon--arrow-down-2-bold';
    updatePrice(dropDownBtn, event.target);
    handleOrderSummary();
  }); // end of click
}

function updatePrice(dropDownBtn, targetStockUnit) {
  const priceElement = dropDownBtn.parentElement.querySelector('.price');
  const price = parseFloat(priceElement.textContent.replace(/[^\d.-]/g, ''));
  const stockElement = dropDownBtn.querySelector('p > span:nth-child(1)');
  let numberOfStock = Number(
    dropDownBtn.querySelector('p > span:nth-child(1)').innerText
  );
  const originalPrice = price / numberOfStock;
  if (targetStockUnit.nodeName === 'LI') {
    numberOfStock = targetStockUnit.textContent;
    stockElement.textContent = targetStockUnit.textContent;
    priceElement.textContent = `EGP ${(numberOfStock * originalPrice).toFixed(
      2
    )}`;
  }
}

function handleEmptyCart(message) {
  const cartSection = document.querySelector('.checkout-main-section');
  // cartSection.classList.remove('cart-main-container-active');
  // cartSection.classList.add('cart-main-container-inactive');
  cartSection.innerHTML = ` <div class='row  empty-section'> <div class="oops-container col-md-12 ">
    <img id="oops" src="../view/assets/images/oops3-removebg-preview.png" alt="oops" class='col-md-6' />
    <h3 class='col-md-6' style="color: #fff;" >${message}</h3>
  </div>
  <div class="back-to-home-page col-md-12">
   <img
    class="arrow-back-to-shopping col-md-3"
    src="./assets/images/shop now-Photoroom.png"
    alt=""
  />
    <img src="../view/assets/images/shopping-cart copy-Photoroom.png" alt="cart" class='col-md-9  shopping-cart' />
  </div></div>`;

  //  handle back to products shop
  const moveToShoppingArrow = document.querySelector('.arrow-back-to-shopping');
  moveToShoppingArrow.addEventListener('click', function () {
    window.open('../view/products.html', '_blank');
  });
}

//  handle order summary

function handleOrderSummary() {
  const [
    subtotalItems,
    subtotalItemsPrice,
    ,
    shippingFee,
    ,
    additionalDiscount,
    ,
    totalPrice,
  ] = document.querySelectorAll('.order-summary-container > div > p');

  const numberOfItemsAdded = document.querySelectorAll(
    '.single-added-item-details .price'
  );
  if (numberOfItemsAdded.length === 0) {
    return;
  }
  const priceOfItemsAdded = Array.from(numberOfItemsAdded).map((ele) =>
    Number(ele.textContent.match(/(\d+\.\d+)/)[0])
  );
  subtotalItems.textContent =
    numberOfItemsAdded.length > 1
      ? `Subtotal(${numberOfItemsAdded.length} items)`
      : `Subtotal(${numberOfItemsAdded.length} item)`;

  let subtotal = Number(
    priceOfItemsAdded.reduce((acc, curr) => {
      return acc + curr;
    })
  );
  subtotalItemsPrice.textContent = `EGP ${subtotal.toFixed(2)}`;

  let additionalDiscountValue = Number(
    additionalDiscount.textContent.match(/\d+/)[0]
  );
  let shippingFeeValue = shippingFee.textContent;
  shippingFeeValue = shippingFeeValue.toLocaleLowerCase().includes('free')
    ? 0
    : Number(shippingFee.textContent.match(/\d+/)[0]);
  totalPrice.textContent = `EGP ${(
    subtotal +
    shippingFeeValue -
    additionalDiscountValue
  ).toFixed(2)}`;
  checkoutPrice.textContent = totalPrice.textContent;
}

//  validations
const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const phoneNumber = document.getElementById('phone-number');

const mainAddress = document.getElementById('main-address');
const secondAddress = document.getElementById('second-address');
const state = document.getElementById('selected-state');
const city = document.getElementById('selected-city');
const zipCode = document.getElementById('zip-code');

function validateName(name, targetElement) {
  const namePattern = /^[a-zA-Z]+$/;
  const validateName = name.trim();

  if (validateName.length < 3) {
    targetElement.nextElementSibling.textContent =
      'Name must be at least 3 characters long.';
    return 'name must be at least 3 characters long.';
  }

  if (validateName.length > 50) {
    targetElement.nextElementSibling.textContent =
      'Name must be less than 50 characters long.';
    return 'First name must be less than 50 characters long.';
  }

  if (!namePattern.test(validateName)) {
    targetElement.nextElementSibling.textContent =
      'Name can only contain letters, hyphens, and apostrophes.';
    return 'name can only contain letters, hyphens, and apostrophes.';
  }
  targetElement.nextElementSibling.textContent = 'Valid Name';
  Object.assign(targetElement.nextElementSibling.style, { color: 'green' });

  return 'Valid name';
}

function validateAddress(address, targetElement) {
  const addressPattern = /^[a-zA-Z0-9\s,.'-]+$/; // allows letters, numbers, spaces, commas, periods, and hyphens
  const validateAddress = address.trim();

  if (validateAddress.length < 20) {
    targetElement.nextElementSibling.textContent =
      'Address must be at least 20 characters long.';
    return 'Address must be at least 20 characters long.';
  }

  if (validateAddress.length > 1000) {
    targetElement.nextElementSibling.textContent =
      'Address must be less than 1000 characters long.';
    return 'Address must be less than 1000 characters long.';
  }

  if (!addressPattern.test(validateAddress)) {
    targetElement.nextElementSibling.textContent =
      'Address can only contain letters, numbers, spaces, commas, periods, and hyphens.';
    return 'Address can only contain letters, numbers, spaces, commas, periods, and hyphens.';
  }

  targetElement.nextElementSibling.textContent = 'Valid Address';
  Object.assign(targetElement.nextElementSibling.style, { color: 'green' });
  return 'Valid address';
}

function validateStateAndCity(selectedValue, targetElement) {
  if (selectedValue === 'none') {
    targetElement.nextElementSibling.textContent = 'You must select an option.';
    return 'You must select an option.';
  }
}
function validateZipCode(zipCode, targetElement) {
  const zipCodePattern = /^\d{5}$/; // 5 numbers
  if (!zipCodePattern.test(zipCode)) {
    targetElement.nextElementSibling.textContent = 'Invalid zip code.';
    return 'Invalid zip code.';
  }
  targetElement.nextElementSibling.textContent = 'Valid Zip Code';
  Object.assign(targetElement.nextElementSibling.style, { color: 'green' });
  return 'Valid Zip Code';
}
function validatePhoneNumber(phoneNumber, targetElement) {
  const phoneNumberPattern = /(010|011|012|015)-(\d{8})/;
  if (!phoneNumberPattern.test(phoneNumber)) {
    targetElement.nextElementSibling.textContent =
      'Phone number must start with 010 | 011 | 012 | 015 followed by "-" and 8 digits.';
    return 'Invalid phone number.';
  }
  targetElement.nextElementSibling.textContent = 'Valid Phone Number';
  Object.assign(targetElement.nextElementSibling.style, { color: 'green' });
}

submitAddress.addEventListener('change', function (event) {
  const targetElement = event.target;
  const retrieveDataFromLocal = JSON.parse(
    window.localStorage.getItem('userAddressDetails')
  );
  if (targetElement && targetElement.id) {
    retrieveDataFromLocal[targetElement.id] = targetElement.value;
  }

  window.localStorage.setItem(
    'userAddressDetails',
    JSON.stringify(retrieveDataFromLocal)
  );
});

submitAddress.addEventListener('submit', function (event) {
  event.preventDefault();

  const formData = new FormData(document.forms[0]);
  for (const [key, value] of formData) {
    if (key === 'first-name') {
      validateName(value, firstName);
    }
    if (key === 'last-name') {
      validateName(value, lastName);
    }
    if (key === 'phone-number') {
      validatePhoneNumber(value, phoneNumber);
    }
    if (key === 'main-address') {
      validateAddress(value, mainAddress);
    }
    if (key === 'second-address') {
      validateAddress(value, secondAddress);
    }
    if (key === 'selected-state') {
      validateStateAndCity(value, state);
    }
    if (key === 'selected-city') {
      validateStateAndCity(value, city);
    }
    if (key === 'zip-code') {
      validateZipCode(value, zipCode);
    }
  }
});

// handle reset
const handleResetAddressForm = (function handleResetAddressForm() {
  const confirmClear = document.querySelector('.confirm-clear');
  confirmClear.addEventListener('click', function () {
    submitAddress.reset();
    window.localStorage.setItem(
      'userAddressDetails',
      JSON.stringify(userAddressDetails)
    );
  });
})();
// });
// const resetFormAdress = document.querySelector('[type=reset]');
