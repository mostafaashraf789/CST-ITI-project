document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.querySelector('.product-grid');
  const wishlistCount = document.querySelector('.wishlist-count');
  const cartCount = document.querySelector('.cart-count');
  const searchInput = document.querySelector(
    '.search-bar input[type="search"]'
  );
  const mainSearch = document.querySelector('.main-nav input[type="search"]');
  const filterButtons = document.querySelectorAll('.search-bar button');
  const jumpDown = document.getElementById('productJump');
  let products = [];
  let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
  let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  // Fetching data

  const fetchDataForHomePage = (async function fetchDataForHomePage() {
    try {
      const getItems =
        JSON.parse(window.localStorage.getItem('data-json')) || [];

      if (getItems.length) {
        products = [...getItems];
        renderProducts(products);
        updateWishlistCount();
        updateCartCount();
      } else {
        console.log('fecth');
        const homeProducts = await fetch('./product-data.json');
        const { products: myProducts } = await homeProducts.json();
        products = [...myProducts];
        renderProducts(products);
        updateWishlistCount();
        updateCartCount();
        window.localStorage.setItem('data-json', JSON.stringify(products));
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  })();

  function renderProducts(products) {
    productGrid.innerHTML = ''; // Clear existing products
    products.forEach((product) => {
      if (product.addItem) {
        createProductCard(product);
      }
    });
    updateWishlistButtons();
    updateCartButtons();
  }

  function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    productCard.innerHTML = `
		<div class="product-redirect">
			<img src="${product.images || 'img/product.jpg'}" alt="product img can't load">
			<button class="wishlist"><i class="fa-regular fa-heart"></i></button>
			<button class="rate"><i class="fa-solid fa-star text-success">${
        product.rating
      }</i></button>
			<button class="cart"><i class="fa-solid fa-cart-shopping"></i></button>
		</div>
		<div class="product-info" id=${product.id}>
			<h2 class="product-name">${product.name}</h2>
			<p class="product-descr">${product.details}</p>
			<h4 class="product-seller text-center"><i class="fa-solid fa-shop"></i> ${
        product.sellerName
      }</h4>
			<div class="d-flex justify-content-between">
				<p class="stock"><span class="cart-stock-price">${
          product.maxQuantity
        }</span> stock</p>
				<p class="price">${
          product.sale
            ? `<span class="cart-stock-price"><del>${product.price}</del> ${product.sale}</span>`
            : `<span class="cart-stock-price">${product.price}</span>`
        } EGP</p>
			</div>
		</div>
	`;

    const description = productCard.querySelector('.product-descr');

    description.addEventListener('click', () => {
      description.classList.toggle('expanded');
    });

    // Add event listeners to buttons
    productCard
      .querySelector('.wishlist')
      .addEventListener('click', () => toggleWishlist(product));
    productCard
      .querySelector('.cart')
      .addEventListener('click', () => toggleCart(product));

    productGrid.appendChild(productCard);
  }

  function toggleWishlist(product) {
    const index = wishlistItems.findIndex((item) => item.id === product.id);
    if (index > -1) {
      wishlistItems.splice(index, 1);
    } else {
      wishlistItems.push(product);
    }
    updateWishlistCount();
    updateWishlistButtons();
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }

  function toggleCart(product) {
    const index = cartItems.findIndex((item) => item.id === product.id);
    if (index > -1) {
      cartItems.splice(index, 1);
    } else {
      cartItems.push(product);
    }
    updateCartCount();
    updateCartButtons();
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }

  function updateWishlistCount() {
    wishlistCount.textContent = wishlistItems.length;
  }

  function updateCartCount() {
    cartCount.textContent = cartItems.length;
  }

  function updateWishlistButtons() {
    document.querySelectorAll('.product-card').forEach((card) => {
      const productId = card.querySelector('.product-info').id;
      const wishlistButton = card.querySelector('.wishlist i');
      if (wishlistItems.some((item) => item.id === productId)) {
        wishlistButton.classList.add('fa-solid', 'text-danger');
        wishlistButton.classList.remove('fa-regular');
      } else {
        wishlistButton.classList.add('fa-regular');
        wishlistButton.classList.remove('fa-solid', 'text-danger');
      }
    });
  }

  function updateCartButtons() {
    document.querySelectorAll('.product-card').forEach((card) => {
      const productId = card.querySelector('.product-info').id;
      const cartButton = card.querySelector('.cart i');
      if (cartItems.some((item) => item.id === productId)) {
        cartButton.classList.add('fa-solid', 'text-success');
      } else {
        cartButton.classList.remove('text-success');
      }
    });
  }

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    renderProducts(filteredProducts);
  });

  mainSearch.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const query = mainSearch.value.toLowerCase();
      const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
      renderProducts(filteredProducts);
    }
  });

  mainSearch.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      if (window.location.pathname.includes('index.html')) {
        document
          .getElementById('productJump')
          .scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = 'index.html?jumpTo=product';
      }
    }
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      button.classList.toggle('active');

      if (button.textContent.includes('Price')) {
        filterButtons.forEach((btn) => {
          if (btn !== button && btn.textContent.includes('Price')) {
            btn.classList.remove('active');
          }
        });
      }

      let sortedProducts = [...products];

      if (button.classList.contains('active')) {
        if (button.textContent === 'On Sale') {
          sortedProducts = sortedProducts.filter((product) => product.sale);
        } else if (button.textContent === 'Price ascending') {
          sortedProducts.sort((a, b) => {
            const sale = a.sale || a.price;
            const price = b.sale || b.price;
            return sale - price;
          });
        } else if (button.textContent === 'Price descending') {
          sortedProducts.sort((a, b) => {
            const sale = a.sale || a.price;
            const price = b.sale || b.price;
            return price - sale;
          });
        } else if (button.textContent === 'Rating') {
          sortedProducts.sort((a, b) => b.rating - a.rating);
        }
      } else {
        sortedProducts = [...products];
      }

      renderProducts(sortedProducts);
    });
  });

  //  redirection to wishlis
  const wishlistBtn = document
    .getElementById('wishlistBtn')
    .addEventListener('click', function () {
      window.open('./Cart Page/view/wishlist.html', '_self');
    });
});
