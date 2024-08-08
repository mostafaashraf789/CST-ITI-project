let items = JSON.parse(window.localStorage.getItem('cartItems')) || [];
let cartItems = items.map((ele) => Number(ele.id));
let getLoginInfo = JSON.parse(window.localStorage.getItem('isLogin')) ?? false;
const isLogged = getLoginInfo.status || false;
// let isLogged = true;
const countCart = (document.querySelector('.cart-count').textContent =
  cartItems.length);

async function fetchProductsFromLocalStorage() {
  if (!cartItems.length) {
    handleEmptyCart(
      "You <span style='color:red'> didn't </span>add products yet !"
    );
  } else {
    try {
      const mainCartSection = document.querySelector('.main-cart-section ');
      mainCartSection.classList.add('add-background');
      const products = JSON.parse(window.localStorage.getItem('data-json'));
      let filteredProducts = products.filter((product) =>
        cartItems.includes(+product.id)
      );

      const itemsContainer = document.querySelector('.added-items-container');
      for (let i = 0; i < filteredProducts.length; i++) {
        itemsContainer.insertAdjacentHTML(
          'beforeend',
          `<div class="single-added-item-details row gx-0 gap-3 align-items-center p-3 mb-3 border border-3 rounded-1" id="_${filteredProducts[i].id}">
              <div class="added-item-description row g-0 col-lg-3 text-center">
                <span><img src="../../${filteredProducts[i].images}" alt=${filteredProducts[i].name}  style="width: 100%; height:100%" /> </span>
                <div>
                  <p id="product-title" class=" mt-4 col-md-12 border border-1   rounded-1 p-2 responsive-text">${filteredProducts[i].name}</p>
                </div>
              </div>
              <div class="added-item-pricing m-0 p-3 rounded-1 text-center col-lg-8 row g-0">
                <div class="count-of-items m-0 p-0 bg- col-md-3 d-flex align-items-center justify-content-center border border-0 bg-light text-dark">
                  <p class="m-0 p-0"><span class="text-dark fw-bold">1</span> <span class="iconamoon--arrow-down-2-bold"></span></p>
                  <ul class="display-none-toggle m-0 p-0">
                    
                  </ul>
                </div>
  
                <p class='price text-center text-light m-0 p-0 col-md-6 bg-success d-flex align-items-center justify-content-center'>EGP ${filteredProducts[i].price}</p>
                <div class="remove-parent col-md-3  d-flex justify-content-center">
                  <button
                    type="button"
                    class="remove-btn "
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
                    <!-- <span>Remove</span> -->
                  </button>
                 
                </div>
              </div>
            </div>`
        );
        let addedItem = itemsContainer.lastElementChild;
        generateStock.call(addedItem, filteredProducts[i].maxQuantity); // use this binding with call method to refer the current added item to update it's own
      } // end of looping to add products
      // onSelectStock();
      handleOrderSummary();
      handleCupon();
      checkout();
      checkEligibilityForFreeShipping();

      // end of fetching
    } catch (error) {
      console.log('Failed to fetch products to cart page !');
    }
  }
}
fetchProductsFromLocalStorage();
// handle tooltip bootstrap

// Determine el size of drop menu based on the stock quantity

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

    cartItems = cartItems.filter(
      (ele) => ele !== Number(removedElementId.slice(1))
    );
    window.localStorage.setItem('cartItems', JSON.stringify(cartItems));
    if (!cartItems.length) {
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
  const cartSection = document.querySelector('body');
  cartSection.classList.remove('cart-main-container-active');
  cartSection.classList.add('cart-main-container-inactive');
  cartSection.innerHTML = ` <div> <div class="oops-container">
    <img id="oops" src="../view/assets/images/oops3.jpg" alt="oops" />
    <h3 class="text-info">${message}</h3>
  </div>
  <div class="back-to-home-page ">
   <img
    class="arrow-back-to-shopping "
    src="../view/assets/images/arrowbak.png"
    alt=""
  />
    <img src="../view/assets/images/shopping-cart.webp" alt="cart" />
  </div>`;

  //  handle back to products shop
  const moveToShoppingArrow = document.querySelector('.arrow-back-to-shopping');
  moveToShoppingArrow.addEventListener('click', function () {
    window.location.href = '../../index.html';
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
}

// handle Cupon code

function handleCupon() {
  const CUPON_CODE = 'ITI';
  let PROMOTION_VALUE = 10;
  const cuponInput = document.querySelector('#cupon-code');
  const giveTryBtn = document.querySelector('.give-it-try');
  const additionalDiscountText = document.querySelector('.additional-discount');
  const additionalDiscountValue = document.querySelector('.promotion-value');
  const cuponModal = new bootstrap.Modal(document.getElementById('cuponModal'));
  const modalTitle = document.querySelector('#cuponModal .modal-title');
  const modalBody = document.querySelector('#cuponModal .modal-body h6');

  giveTryBtn.addEventListener('click', function () {
    const isValidCupon = cuponInput.value === CUPON_CODE;
    const promotionStyle = isValidCupon
      ? { color: 'green', fontWeight: 'bold' }
      : { color: '#000', fontWeight: 'normal' };
    applyPromotionStyle(
      additionalDiscountText,
      additionalDiscountValue,
      promotionStyle
    );

    if (isValidCupon) {
      setModalContentAndShowModal(
        cuponModal,
        modalTitle,
        modalBody,
        'Congrats!',
        'You got an <b>additional discount!</b>',
        '#fff',
        true
      );
      additionalDiscountValue.textContent = `EGP ${PROMOTION_VALUE}`;
      confetti();
    } else {
      setModalContentAndShowModal(
        cuponModal,
        modalTitle,
        modalBody,
        'Oops!',
        '<span style="color:red; font-weight:bold">Invalid coupon Code</span> Try another one!',
        'red',
        true
      );
      additionalDiscountValue.textContent = `EGP 0`;
    }
    handleOrderSummary();
  });
}
//  handle promotion style and showModal of cupon modal
function applyPromotionStyle(textElement, valueElement, style) {
  Object.assign(textElement.style, style);
  Object.assign(valueElement.style, style);
}

//  handle checkout

function checkout() {
  const checkout = document.querySelector('.checkout');
  checkout.addEventListener('click', function () {
    if (!isLogged) {
      // here we git rid of dataset from the checkout button cuz it's not updated
      // automatically by bootstrap when we set it to 'modal',
      // we must click twice to show the modal, so the another way is to create object
      // of the modal and open it programmatically
      const loginModal = new bootstrap.Modal(
        document.getElementById('loginModal')
      );
      loginModal.show();
    } else {
      const items = Array.from(
        document.querySelectorAll('.single-added-item-details')
      );
      const purchasedProducts = items.map((ele) => {
        const productId = Number(ele.id.slice(1));
        const quantity = Number(
          ele.querySelector('.count-of-items p span:nth-child(1)').textContent
        );
        const shippingFee = document.querySelector('.shipping-fee').textContent;
        const additionalDiscountValue =
          document.querySelector('.promotion-value').textContent;
        return {
          productID: productId,
          quantity: quantity,
          shippingFee: shippingFee,
          additionalDiscountValue: additionalDiscountValue,
        };
      });

      window.localStorage.setItem(
        'purchased-products',
        JSON.stringify(purchasedProducts)
      );
      window.location.href = '../view/checkout.html';
      // set local storage for bought products
    }
  });
}

function checkEligibilityForFreeShipping() {
  const deliveryCar = document.querySelector('.delivery-car');
  deliveryCar.addEventListener('click', checkGeolocation);
}

function checkGeolocation() {
  if ('geolocation' in navigator) {
    addOverlay();
    navigator.geolocation.getCurrentPosition(success, error);
  } else {
    console.log("Your browser doesn't support geolocation!");
  }

  async function success(position) {
    const { latitude, longitude } = position.coords;
    try {
      const locationDetails = await fetchLocationDetails(latitude, longitude);
      const shippingModal = new bootstrap.Modal(
        document.getElementById('shippingModal')
      );
      handleLocationEligibility(locationDetails.city, shippingModal);
    } catch (err) {
      console.error('Failed to fetch location details:', err);
    }
  }

  function error() {
    console.log('You have blocked the access to the geolocation!');
  }
}

function addOverlay() {
  document.body.insertAdjacentHTML(
    'beforeend',
    `<div class="overlay"><img src="./assets/images/moon.jpg" alt="moon" /></div>`
  );
}

async function fetchLocationDetails(latitude, longitude) {
  const geoApi = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
  const response = await fetch(geoApi);
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
}

function handleLocationEligibility(city, shippingModal) {
  const overlay = document.querySelector('.overlay');

  const isEligible = !city.includes('cairo');
  const modalTitle = document.querySelector('#shippingModal .modal-title');
  const modalBody = document.querySelector('#shippingModal .modal-body h6');
  const shippingFee = document.querySelector('.shipping-fee');

  if (isEligible) {
    setModalContentAndShowModal(
      shippingModal,
      modalTitle,
      modalBody,
      'Congrats!',
      'You are eligible for free shipping!',
      '#FFF'
    );
  } else {
    setModalContentAndShowModal(
      shippingModal,
      modalTitle,
      modalBody,
      'Oops!',
      'Your location is <span style="color:red; font-weight:bold">NOT eligible</span>',
      'red'
    );
  }

  setTimeout(() => {
    overlay.remove();
    shippingModal.show();
    if (isEligible) {
      shippingFee.textContent = 'FREE';
      handleOrderSummary();
      confetti();
    }
  }, 5000);
}

function setModalContentAndShowModal(
  modal,
  titleElement,
  bodyElement,
  titleText,
  bodyText,
  titleColor,
  showModal = false
) {
  titleElement.innerText = titleText;
  titleElement.style.color = titleColor;
  bodyElement.innerHTML = bodyText;
  if (showModal) {
    modal.show();
  }
}
let ids = [
  { id: 1, quantity: 2 },
  { id: 2, quantity: 4 },
];
let products = [
  {
    id: 1,
    title: 'Product 1',
    price: 19.99,
    description: 'This is product 1 description.',
    category: 'Electronics',
    image: '../view/assets/images/test.jpg',
    rating: {
      rate: 4.5,
      count: 10,
    },
    stock: 50,
  },
  {
    id: 2,
    title: 'Product 2',
    price: 29.99,
    description: 'This is product 2 description.',
    category: 'Clothing',
    image: '../view/assets/images/test.jpg',
    rating: {
      rate: 3.8,
      count: 8,
    },
    stock: 30,
  },
];
