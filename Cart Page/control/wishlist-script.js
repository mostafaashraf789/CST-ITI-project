let items = JSON.parse(window.localStorage.getItem('wishlistItems')) || [];
let cartItems = items.map((ele) => Number(ele.id));
let getLoginInfo = JSON.parse(window.localStorage.getItem('isLogin')) ?? false;
const isLogged = getLoginInfo.status || false;
const countCart = (document.querySelector('.cart-count').textContent =
  cartItems.length);
//    control Wishlist

const wishlistCounter = document.getElementById('wishlistCounter');
wishlistCounter.textContent = items.length;
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
          `<div class="col-md-4 mb-3 ">
      <div class="bg-dark single-added-item-details d-flex align-items-center  flex-column gx-0 gap-3 p-3 mb-3 border border-3 rounded-1" id="_${filteredProducts[i].id}">
        <div class="added-item-description text-center g-0 col-lg-3 w-100">
          <span><img class='img-control' src="../../${filteredProducts[i].images}" alt="${filteredProducts[i].name}" style="width: 100%; height: 100%" /></span>
          <div  class="text-center  w-100"> 
            <p style="width: fit-content;text-wrap: nowrap" id="product-title" class="mt-4 col-md-12 m-auto  rounded-1 p-2 responsive-text">${filteredProducts[i].name}</p>
          </div>
        </div>
        <div class="added-item-pricing m-0 p-3 rounded-1 text-center col-md-12 row g-0">
          
          <p class='price text-center text-light m-0 p-0 col-md-6 bg-success d-flex align-items-center justify-content-center'>EGP ${filteredProducts[i].price}</p>
          <div class="remove-parent col-md-6  d-flex align-items-center justify-content-center" >
            <button type="button" class="remove-btn" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-custom-class="custom-tooltip" data-bs-title="Remove">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>`
        );
        let addedItem = itemsContainer.lastElementChild;
        generateStock.call(addedItem, filteredProducts[i].maxQuantity); // use this binding with call method to refer the current added item to update it's own
      } // end of looping to add products

      // end of fetching
    } catch (error) {
      console.log('Failed to fetch products to cart page !');
    }
  }
}
fetchProductsFromLocalStorage();

function generateStock(countOfStock) {
  this.querySelector('.remove-btn').addEventListener('click', function () {
    const removedElementId = this.parentElement.parentElement.parentElement.id;
    this.parentElement.parentElement.parentElement.remove();

    // check cart if all elements is removed or not to display empty cart message

    cartItems = cartItems.filter(
      (ele) => ele !== Number(removedElementId.slice(1))
    );
    window.localStorage.setItem('cartItems', JSON.stringify(cartItems));
    if (!cartItems.length) {
      window.localStorage.removeItem('wishlistItems');
      handleEmptyCart(
        "You have <span style='color:red'> removed </span> the products !"
      );
    }
  });
}

function handleEmptyCart(message) {
  const cartSection = document.querySelector('body');
  cartSection.classList.remove('cart-main-container-active');
  cartSection.classList.add('cart-main-container-inactive');
  cartSection.innerHTML = ` <div> <div class="oops-container">
    <img id="oops" src="../view/assets/images/oops3.jpg" alt="oops" style="pointer-events: none; user-select:none;"/>
    <h3 class="text-info">${message}</h3>
  </div>
  <div class="back-to-home-page ">
   <img " style="mix-blend-mode: normal;"
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
