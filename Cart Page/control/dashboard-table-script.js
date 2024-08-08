document.addEventListener('DOMContentLoaded', function () {
  const sidebarToggle = document.body.querySelector('#sidebarToggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', (event) => {
      event.preventDefault();
      document.body.classList.toggle('sb-sidenav-toggled');
      localStorage.setItem(
        'sb|sidebar-toggle',
        document.body.classList.contains('sb-sidenav-toggled')
      );
    });
  }

  // Modal Logic
  const exampleModal = document.getElementById('exampleModal');
  if (exampleModal) {
    exampleModal.addEventListener('show.bs.modal', (event) => {
      // Button that triggered the modal
      const button = event.relatedTarget;
      // Extract info from data-bs-* attributes
      const recipient = button.getAttribute('data-bs-whatever');
      // If necessary, you could initiate an Ajax request here
      // and then do the updating in a callback.

      // Update the modal's content.
      const modalTitle = exampleModal.querySelector('.modal-title');
      const modalBodyInput = exampleModal.querySelector('.modal-body input');

      // modalBodyInput.value = recipient;
    });
  }
  //  fetch products
  let finalPurchasedProducts =
    JSON.parse(window.localStorage.getItem('finalPurchasedProducts')) || [];
  const isSeller = JSON.parse(window.localStorage.getItem('sellerDetails'));
  let sellerName = isSeller.storeName;
  async function fetchProducts() {
    try {
      const getAllProducts = JSON.parse(
        window.localStorage.getItem('data-json')
      );
      const sellerProducts = getAllProducts.filter(
        (product) => sellerName === product.sellerName
      );

      populateTable(sellerProducts);
      initializeSort(sellerProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  function populateTable(products) {
    const tableBody = document.getElementById('product-table-body');
    tableBody.innerHTML = '';
    products.forEach((product, index) => {
      const row = `
        <tr id=${product.id}>
          <td>${index + 1}</td>
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td>EGP ${product.price}</td>
          <td>${product.maxQuantity}</td>
          <td>${getQuantitySold(product.id)}</td>
          <td>${getRestStock(
            product.maxQuantity,
            getQuantitySold(product.id)
          )}</td>
          <td> <div class="gr btn-group">
                          <button class="btn btn-success" ${
                            product.addItem ? 'disabled' : ''
                          } id="add-product">
                          ${product.addItem ? 'Added' : 'Add'}
                          </button>

                          <button class="btn btn-danger" ${
                            !product.addItem ? 'disabled' : ''
                          }  id="remove-product">
                          ${!product.addItem ? 'Removed' : 'Remove'}
                          </button>
                        </div></td>
        </tr>
      `;
      tableBody.insertAdjacentHTML('beforeend', row);
    });
    editProduct(tableBody);
  }
  function editProduct(tableBody) {
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach((row) => {
      row.addEventListener('click', function (event) {
        handleEditProduct(event.target.innerText, row.id);
      });
    });
  }

  function handleEditProduct(selectedBtn, rowId) {
    if (selectedBtn === 'Remove') {
      const editProduct = JSON.parse(
        window.localStorage.getItem('data-json')
      ).map((ele) => {
        if (ele.id === rowId) {
          ele.addItem = false;
        }
        return ele;
      });
      window.localStorage.setItem('data-json', JSON.stringify(editProduct));
      const getStoreProducts = JSON.parse(
        window.localStorage.getItem('data-json')
      ).filter((product) => sellerName === product.sellerName);

      populateTable(getStoreProducts);
    } else if (selectedBtn === 'Add') {
      const editProduct = JSON.parse(
        window.localStorage.getItem('data-json')
      ).map((ele) => {
        if (ele.id === rowId) {
          ele.addItem = true;
        }
        return ele;
      });
      window.localStorage.setItem('data-json', JSON.stringify(editProduct));
      const getStoreProducts = JSON.parse(
        window.localStorage.getItem('data-json')
      ).filter((product) => sellerName === product.sellerName);

      populateTable(getStoreProducts);
    }
  }

  function getQuantitySold(productId) {
    let product = finalPurchasedProducts.find((p) => p.id === productId);
    return product ? product.soldQuantity : 0;
  }

  function getRestStock(realStock, soldQuantities) {
    return Number(realStock) - Number(soldQuantities);
  }

  function initializeSort(products) {
    const thead = document.querySelector('#datatablesSeller thead');
    const headers = thead.querySelectorAll('th');

    headers.forEach((header, index) => {
      const icon = header.querySelector('span');
      header.addEventListener('click', function () {
        let sortedProducts = [...products];
        const isNumeric = header.classList.contains('sort-numbers');

        // Toggle sorting icon class
        toggleSortIcon(icon);

        if (isNumeric) {
          sortedProducts.sort((a, b) => {
            switch (index) {
              case 3: // price
                return icon.className.includes(
                  'flat-color-icons--numerical-sorting-12'
                )
                  ? a.price - b.price
                  : b.price - a.price;
              case 4: // stock
                return icon.className.includes(
                  'flat-color-icons--numerical-sorting-12'
                )
                  ? a.maxQuantity - b.maxQuantity
                  : b.maxQuantity - a.maxQuantity;
              case 5: // sold products
                return icon.className.includes(
                  'flat-color-icons--numerical-sorting-12'
                )
                  ? getQuantitySold(a.id) - getQuantitySold(b.id)
                  : getQuantitySold(b.id) - getQuantitySold(a.id);

              case 6: // Rest Stock
                return icon.className.includes(
                  'flat-color-icons--numerical-sorting-12'
                )
                  ? getRestStock(a.maxQuantity, getQuantitySold(a.id)) -
                      getRestStock(b.maxQuantity, getQuantitySold(b.id))
                  : getRestStock(b.maxQuantity, getQuantitySold(b.id)) -
                      getRestStock(a.maxQuantity, getQuantitySold(a.id));
              default:
                return 0;
            }
          });
        } else {
          sortedProducts.sort((a, b) => {
            switch (index) {
              case 2: // Title
                return icon.className.includes(
                  'flat-color-icons--alphabetical-sorting-az'
                )
                  ? a.name.localeCompare(b.name)
                  : b.name.localeCompare(a.name);

              default:
                return 0;
            }
          });
        }

        populateTable(sortedProducts);
      });
    });
  }

  function toggleSortIcon(icon) {
    const currentClass = icon.className;
    if (currentClass.includes('flat-color-icons--numerical-sorting-12')) {
      icon.className = 'flat-color-icons--numerical-sorting-21';
    } else if (
      currentClass.includes('flat-color-icons--numerical-sorting-21')
    ) {
      icon.className = 'flat-color-icons--numerical-sorting-12';
    } else if (
      currentClass.includes('flat-color-icons--alphabetical-sorting-az')
    ) {
      icon.className = 'flat-color-icons--alphabetical-sorting-za';
    } else if (
      currentClass.includes('flat-color-icons--alphabetical-sorting-za')
    ) {
      icon.className = 'flat-color-icons--alphabetical-sorting-az';
    }
  }

  fetchProducts();

  //  add new products

  const openAddProductModal = document.getElementById('openAddProductModal');
  openAddProductModal.addEventListener('click', generateNewProductID);
  const addNewProductBtn = document.getElementById('addProduct');

  const storeName = document.getElementById('addProductSellerName');
  const sellerTableData = document.querySelector('.sellerTableData');
  const pendingVerificationBtn = document.querySelector(
    '.pendingVerification-btn'
  );
  const progressBar = document.querySelector('.progress');
  storeName.value = sellerName;

  //  check if seller is verified or not
  const sellerDetails = JSON.parse(
    window.localStorage.getItem('sellerDetails')
  );

  if (!sellerDetails || !sellerDetails.verifiedSeller) {
    openAddProductModal.disabled = true;
    sellerTableData.classList.add('Is-Not-Verified');
  } else {
    openAddProductModal.disabled = false;
    sellerTableData.classList.remove('Is-Not-Verified');
    pendingVerificationBtn.innerHTML =
      ' <span class="material-symbols--verified"></span> Verified';
    pendingVerificationBtn.classList.add('btn-success');
    progressBar.remove();
  }

  addNewProductBtn.addEventListener('click', function () {
    const newProductName = document.getElementById('addProductName');
    const addProductForm = document.getElementById('addProductForm');
    const productDescriptionBox = document.getElementById('addProductDetails');
    const imgSRC = document.getElementById('addProductImages');

    //  is verified seller

    const validations = [
      validateName(
        newProductName,
        /^(?=.*[a-zA-Z])[a-zA-Z0-9]{5,10}$/,
        'Invalid Name. Must be (5-10) Letter or Letters with numbers !'
      ),
      validateName(
        productDescriptionBox,
        /^(?=.*[a-zA-Z])[a-zA-Z0-9]{10,50}$/,
        'Invalid Description. Max Length must be 100 (Allowed letter and numbers)!'
      ),
      Boolean(imgSRC.value),
    ];
    const isFilled = validations.every(Boolean);
    if (isFilled) {
      const disabledInputs = addProductForm.querySelectorAll('input:disabled');
      disabledInputs.forEach((input) => (input.disabled = false));
      const getFormData = new FormData(addProductForm);
      disabledInputs.forEach((input) => (input.disabled = true));
      const newProduct = {};
      for (const [key, value] of getFormData) {
        newProduct[key] = value;
      }
      // set default value false for not adding product directly to home page.
      newProduct.addItem = false;
      newProduct.rating = 1;
      newProduct.reviews = 1;

      const retrieveProductsData = JSON.parse(
        window.localStorage.getItem('data-json')
      );
      retrieveProductsData.push(newProduct);
      window.localStorage.setItem(
        'data-json',
        JSON.stringify(retrieveProductsData)
      );
      const modalElement = document.getElementById('addNewProductModal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
      addProductForm.reset();
      newProductName.nextElementSibling.textContent = '';
      productDescriptionBox.nextElementSibling.textContent = '';

      populateTable(
        retrieveProductsData.filter(
          (product) => sellerName === product.sellerName
        )
      );
    } else console.log('invalid');
  });

  function generateNewProductID() {
    const newProductId = document.getElementById('new-product-id');
    const getAllProducts = JSON.parse(window.localStorage.getItem('data-json'));

    newProductId.value = +getAllProducts[getAllProducts.length - 1].id + 1;
  }

  const newProductName = document.getElementById('addProductName');
  const productDescriptionBox = document.getElementById('addProductDetails');

  productDescriptionBox.addEventListener('input', () => {
    const Description__REGEX = /^(?=.*[a-zA-Z\s])[a-zA-Z0-9\s]{10,50}$/;
    const message =
      'Invalid Description. Max Length must be 100 (Allowed letter and numbers)!';
    validateName(productDescriptionBox, Description__REGEX, message);
  });

  newProductName.addEventListener('input', () => {
    const productName__REGEX = /^(?=.*[a-zA-Z])[a-zA-Z0-9\s]{5,10}$/;
    const message =
      'Invalid Name. Must be (5-10) Letter or Letters with numbers !';
    validateName(newProductName, productName__REGEX, message);
  });

  const validateName = function validateName(targetElement, REGEX, message) {
    const productName_REGEX = REGEX;
    const isValidName = productName_REGEX.test(targetElement.value);
    if (!isValidName) {
      targetElement.nextElementSibling.textContent = message;
      targetElement.nextElementSibling.style.color = 'red';
      return false;
    } else {
      targetElement.nextElementSibling.textContent = 'Valid Name';
      targetElement.nextElementSibling.style.color = 'green';
      return true;
    }
  };

  //  handle image
  const imageInput = document.getElementById('addProductImageUpload');
  const imgSRC = document.getElementById('addProductImages');
  imageInput.addEventListener('change', function (event) {
    handleAddImgSrc(event.target.files[0]);
  });

  function handleAddImgSrc(file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      imgSRC.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // LOGOUT
  const logOutBtn = document.getElementById('logout');
  logOutBtn.addEventListener('click', function () {
    window.localStorage.removeItem('isSeller');
    window.open('../../index.html', '_self');
  });
});
