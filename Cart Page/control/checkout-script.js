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

const insertStateData = (async function insertStateData() {
  const data = await fetchState();
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
})();

let finalPurchasedProducts;

const fetchDataProducts = (async function fetchDataProducts() {
  let isPurchased = purchasedProducts.length;
  if (!isPurchased) {
    handleEmptyCart(
      "You <span style='color:red'> didn't </span>add products yet !"
    );
  } else {
    try {
      const products = JSON.parse(window.localStorage.getItem('data-json'));
      finalPurchasedProducts = products
        .filter((product) =>
          purchasedProducts.some((item) => item.productID === +product.id)
        )
        .map((product) => {
          let item = purchasedProducts.find(
            (item) => item.productID === +product.id
          );
          return {
            ...product,
            soldQuantity: item.quantity,
            shippingFee: item.shippingFee,
            additionalDiscountValue: item.additionalDiscountValue,
          };
        });

      // Save filtered products to local storage
      localStorage.setItem(
        'finalPurchasedProducts',
        JSON.stringify(finalPurchasedProducts)
      );

      const itemsContainer = document.querySelector(
        '.products-details-of-checkout'
      );
      for (let i = 0; i < finalPurchasedProducts.length; i++) {
        itemsContainer.insertAdjacentHTML(
          'beforeend',
          ` <div
          class="single-added-item-details row gx-0 gap-3 align-items-center p-3 mb-3 border border-3 rounded-1"
          id="_${+finalPurchasedProducts[i].id}"
        >
          <div class="added-item-description row g-0 col-lg-3 text-center">
            <span class="col-md-12"
              ><img
                src="../../${finalPurchasedProducts[i].images}"
                alt="${finalPurchasedProducts[i].name}"
                style="width: 100%"
              />
            </span>
            <div>
              <p
                class="text-light mt-4 col-md-12 border border-1 bg-light text-dark rounded-1 p-2 responsive-text"
              >
                ${finalPurchasedProducts[i].name}
              </p>
            </div>
          </div>
          <div
            class="added-item-pricing m-0 p-3 rounded-1 text-center col-lg-8 row g-0"
          >
            <div
              class="count-of-items  m-0 p-0 bg- col-md-3 d-flex align-items-center justify-content-center border border-0 bg-light text-dark " data-id=${+finalPurchasedProducts[
                i
              ].id}
            >
              <p class="m-0 p-0">
                <span id="quantity" class="text-dark fw-bold" >
                  ${finalPurchasedProducts[i].soldQuantity}
                </span>
                <span class="iconamoon--arrow-down-2-bold"></span>
              </p>
              <ul class="display-none-toggle m-0 p-0 ">
                <li data-id="${+finalPurchasedProducts[i]
                  .id}" data-quantity="22">22</li>
                <li data-id="${+finalPurchasedProducts[i]
                  .id}" data-quantity="66">66</li>
              </ul>
            </div> 

            <p
              class="price text-center text-light m-0 p-0 col-md-6 bg-success d-flex align-items-center justify-content-center"
            >
              EGP ${(
                finalPurchasedProducts[i].price *
                finalPurchasedProducts[i].soldQuantity
              ).toFixed(2)}
            </p>
            <div class="remove-parent col-md-3 bg-body-secondary">
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
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>`
        );

        let addedItem = itemsContainer.lastElementChild;
        generateStock.call(addedItem, finalPurchasedProducts[i].maxQuantity);
      }

      // Add event listeners to update quantity and local storage
      const countOfItems = itemsContainer.querySelectorAll('.count-of-items');
      countOfItems.forEach((ele) => {
        ele.addEventListener('click', (event) => {
          const newQuantity = Number(ele.querySelector('#quantity').innerText);
          const productId = Number(ele.getAttribute('data-id'));
          updateProductQuantity(productId, newQuantity);
        });
      });

      handleOrderSummary();
      return {
        addedProducts: itemsContainer.querySelectorAll(
          '.single-added-item-details'
        ),
        finalPurchasedProducts: finalPurchasedProducts,
      };
    } catch (error) {
      console.log('Failed to fetch products to cart page !');
    }
  }
})();

// Function to update product quantity in filtered products and local storage
function updateProductQuantity(productId, newQuantity) {
  finalPurchasedProducts = finalPurchasedProducts.map((product) => {
    if (+product.id === productId) {
      product.soldQuantity = newQuantity;
    }
    return product;
  });
  localStorage.setItem(
    'finalPurchasedProducts',
    JSON.stringify(finalPurchasedProducts)
  );
}

// ///////////////////
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
    window.open('../view/products.html', '_self');
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

// validations
const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const phoneNumber = document.getElementById('phone-number');
const mainAddress = document.getElementById('main-address');
const secondAddress = document.getElementById('second-address');
const state = document.getElementById('selected-state');
const city = document.getElementById('selected-city');
const zipCode = document.getElementById('zip-code');

function setValidationMessage(element, message, isValid) {
  element.nextElementSibling.textContent = message;
  element.nextElementSibling.style.color = isValid ? 'green' : 'red';
}

function validateName(name, targetElement) {
  const namePattern = /^[a-zA-Z]+$/;
  const trimmedName = name.trim();

  if (trimmedName.length < 3) {
    setValidationMessage(
      targetElement,
      'Name must be at least 3 characters long.',
      false
    );
    return false;
  }

  if (trimmedName.length > 50) {
    setValidationMessage(
      targetElement,
      'Name must be less than 50 characters long.',
      false
    );
    return false;
  }

  if (!namePattern.test(trimmedName)) {
    setValidationMessage(
      targetElement,
      'Name can only contain letters.',
      false
    );
    return false;
  }

  setValidationMessage(targetElement, 'Valid Name', true);
  return true;
}

function validateAddress(address, targetElement) {
  const addressPattern = /^[a-zA-Z0-9\s,.'-]+$/;
  const trimmedAddress = address.trim();

  if (trimmedAddress.length < 20) {
    setValidationMessage(
      targetElement,
      'Address must be at least 20 characters long.',
      false
    );
    return false;
  }

  if (trimmedAddress.length > 1000) {
    setValidationMessage(
      targetElement,
      'Address must be less than 1000 characters long.',
      false
    );
    return false;
  }

  if (!addressPattern.test(trimmedAddress)) {
    setValidationMessage(
      targetElement,
      'Address can only contain letters, numbers, spaces, commas, periods, and hyphens.',
      false
    );
    return false;
  }

  setValidationMessage(targetElement, 'Valid Address', true);
  return true;
}

function validateStateAndCity(selectedValue, targetElement) {
  if (selectedValue === 'none') {
    setValidationMessage(targetElement, 'You must select an option.', false);
    return false;
  }
  setValidationMessage(targetElement, 'Valid Selection', true);
  return true;
}

function validateZipCode(zipCode, targetElement) {
  const zipCodePattern = /^\d{5}$/;
  if (!zipCodePattern.test(zipCode)) {
    setValidationMessage(targetElement, 'Invalid zip code.', false);
    return false;
  }
  setValidationMessage(targetElement, 'Valid Zip Code', true);
  return true;
}

function validatePhoneNumber(phoneNumber, targetElement) {
  const phoneNumberPattern = /(010|011|012|015)-(\d{8})/;
  if (!phoneNumberPattern.test(phoneNumber)) {
    setValidationMessage(
      targetElement,
      'Phone number must start with 010, 011, 012, or 015 followed by "-" and 8 digits.',
      false
    );
    return false;
  }
  setValidationMessage(targetElement, 'Valid Phone Number', true);
  return true;
}

// const form = document.forms[0];
let isAddressFormSubmitted;
submitAddress.addEventListener('submit', function (event) {
  event.preventDefault();

  const validations = [
    validateName(firstName.value, firstName),
    validateName(lastName.value, lastName),
    validatePhoneNumber(phoneNumber.value, phoneNumber),
    validateAddress(mainAddress.value, mainAddress),
    validateAddress(secondAddress.value, secondAddress),
    validateStateAndCity(state.value, state),
    validateStateAndCity(city.value, city),
    validateZipCode(zipCode.value, zipCode),
  ];

  isAddressFormSubmitted = validations.every(Boolean);
  if (isAddressFormSubmitted) {
    const toastLiveExample = document.getElementById('liveToast');
    const confirmSubmitAddress = document.querySelector(
      '#onfirmAddresliveToast'
    );
    const confirmSubmitAddressText = confirmSubmitAddress.textContent.trim();
    const inputs = submitAddress.querySelectorAll('input, select');
    if (confirmSubmitAddressText === 'Confirm') {
      confirmSubmitAddress.innerHTML = 'Edit';
      inputs.forEach((ele) => {
        ele.disabled = true;
        ele.style.cssText = 'filter:contrast(.5)';
      });
      const toastBootstrap =
        bootstrap.Toast.getOrCreateInstance(toastLiveExample);
      toastBootstrap.show();
    } else {
      inputs.forEach((ele) => {
        ele.disabled = false;
        ele.style.cssText = 'filter:contrast(1)';
      });
      confirmSubmitAddress.textContent = 'Confirm';
    }
    console.log('Form is valid');
  } else {
    console.log('Form contains errors');
  }
});
const updateLocalStorage = (targetElement) => {
  const storedData =
    JSON.parse(window.localStorage.getItem('userAddressDetails')) || {};
  if (targetElement && targetElement.id) {
    storedData[targetElement.id] = targetElement.value;
  }
  window.localStorage.setItem('userAddressDetails', JSON.stringify(storedData));
};

submitAddress.addEventListener('change', function (event) {
  updateLocalStorage(event.target);
});

// handle reset
const handleResetAddressForm = (function handleResetAddressForm() {
  const confirmClear = document.querySelector('.confirm-clear');
  confirmClear.addEventListener('click', function () {
    submitAddress.reset();
    const validationMessage = document.querySelectorAll('.validation-message');
    validationMessage.forEach((ele) => (ele.textContent = ''));
    window.localStorage.setItem(
      'userAddressDetails',
      JSON.stringify(userAddressDetails)
    );
  });
})();
//  handle debit card

const debitCardBtn = document.querySelector('.debit-card');
const cashOnDeliveryBtn = document.querySelector('.cash-on-delivery');
const debitCardForm = document.forms[1];
const paymentContainr = document.querySelector('.payament-container');

function togglePaymentOption(activeBtn, inactiveBtn) {
  paymentContainr.classList.toggle(
    'payament-container-slowMotion',
    activeBtn === debitCardBtn
  );
  activeBtn.style.backgroundColor = 'green';
  inactiveBtn.style.backgroundColor = '';
}

debitCardBtn.addEventListener('click', function () {
  togglePaymentOption(debitCardBtn, cashOnDeliveryBtn);
});

cashOnDeliveryBtn.addEventListener('click', function () {
  togglePaymentOption(cashOnDeliveryBtn, debitCardBtn);
});

//  handle debit card
const nameOnCard = document.getElementById('nameOnCard');
const cardNumber = document.getElementById('cardNumber');
const expireDate = document.getElementById('expireDate');
const CVV = document.getElementById('CVV');

function setValidationMessage(element, message, isValid) {
  let messageElement = element.nextElementSibling;
  if (
    !messageElement ||
    !messageElement.classList.contains('validation-message')
  ) {
    messageElement = document.createElement('div');
    messageElement.className = 'validation-message';
    element.parentNode.insertBefore(messageElement, element.nextSibling);
  }
  messageElement.textContent = message;
  messageElement.style.color = isValid ? 'green' : 'red';
}

function validateNameOnCard(name) {
  const namePattern = /^[a-zA-Z\s]+$/;
  const trimmedName = name.trim();

  if (trimmedName.length < 3) {
    setValidationMessage(
      nameOnCard,
      'Name must be at least 3 characters long.',
      false
    );
    return false;
  }

  if (!namePattern.test(trimmedName)) {
    setValidationMessage(
      nameOnCard,
      'Name can only contain letters and spaces.',
      false
    );
    return false;
  }

  setValidationMessage(nameOnCard, 'Valid Name', true);
  return true;
}

function validateCardNumber(number) {
  const cardNumberPattern = /^\d{4}-\d{4}-\d{4}-\d{4}$/;

  if (!cardNumberPattern.test(number)) {
    setValidationMessage(
      cardNumber,
      'Card number must be in the format XXXX-XXXX-XXXX-XXXX.',
      false
    );
    return false;
  }

  setValidationMessage(cardNumber, 'Valid Card Number', true);
  return true;
}

function validateExpireDate(date) {
  const expireDatePattern = /^(0[1-9]|1[0-2])\/\d{2}$/;

  if (!expireDatePattern.test(date)) {
    setValidationMessage(
      expireDate,
      'Expire date must be in the format MM/YY.',
      false
    );
    return false;
  }

  // Check if the date is in the future
  const [month, year] = date.split('/').map(Number);
  const now = new Date();
  const currentYear = now.getFullYear() % 100; // Get last two digits of the year
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    setValidationMessage(
      expireDate,
      'Expire date must be in the future.',
      false
    );
    return false;
  }

  setValidationMessage(expireDate, 'Valid Expire Date', true);
  return true;
}
function validateCVV(cvv) {
  const cvvPattern = /^\d{3}$/;

  if (!cvvPattern.test(cvv)) {
    setValidationMessage(CVV, 'CVV must be 3 digits.', false);
    return false;
  }

  setValidationMessage(CVV, 'Valid CVV', true);
  return true;
}

debitCardForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const validations = [
    validateNameOnCard(nameOnCard.value),
    validateCardNumber(cardNumber.value),
    validateExpireDate(expireDate.value),
    validateCVV(CVV.value),
  ];
  const isValidCard = validations.every(Boolean);
  if (!isAddressFormSubmitted) {
    const addressNotSubmittedModal = new bootstrap.Modal(
      document.getElementById('addressNotSubmitted')
    );
    addressNotSubmittedModal.show();
  } else if (isValidCard) {
    const toastTrigger = document.getElementById('checkout-products');
    const toastLive = document.querySelector('.toastDebitCard #liveToast');

    if (toastTrigger) {
      const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive);
      toastTrigger.addEventListener('click', () => {
        toastBootstrap.show();
      });
    }
    //  update quantaties in localstorage for all products
    const fetchAllProducts = JSON.parse(
      window.localStorage.getItem('data-json')
    );
    const getFinalPurchasedProducts = JSON.parse(
      window.localStorage.getItem('finalPurchasedProducts')
    );
    const updateProducts = fetchAllProducts.map((ele) => {
      const matchingProduct = getFinalPurchasedProducts.find(
        (p) => p.id === ele.id
      );
      if (matchingProduct) {
        ele.soldQuantity = matchingProduct.soldQuantity;
      }
      return ele;
    });
    window.localStorage.setItem('data-json', JSON.stringify(updateProducts));
    window.open('../view/successful-payment.html', '_self');
    // update data json with sold quantities
  }
});

// Real-time validation
nameOnCard.addEventListener('input', () =>
  validateNameOnCard(nameOnCard.value)
);
cardNumber.addEventListener('input', () =>
  validateCardNumber(cardNumber.value)
);
expireDate.addEventListener('input', () =>
  validateExpireDate(expireDate.value)
);
CVV.addEventListener('input', () => validateCVV(CVV.value));

//
