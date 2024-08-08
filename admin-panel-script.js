// script admin dashboard

// fetch products from json file
async function fetchData() {
  if (!localStorage.getItem('products')) {
    let response = await fetch('./product-data.json');
    let { products } = await response.json();

    localStorage.setItem('data-json', JSON.stringify(products));
  }
}
fetchData();

document.addEventListener('DOMContentLoaded', function () {
  const isAdmin = JSON.parse(window.localStorage.getItem('isAdmin'));

  // if (!isAdmin) {
  //   // Redirect to a page for unauthorized access
  //   window.location.href = './unauthorized.html';
  // }

  // window.localStorage.setItem('isAdmin', false);

  // display  user data from localStorge
  let users = JSON.parse(localStorage.getItem('data')) || [];

  function displayData() {
    let tbody = document.getElementById('tbody');
    let content = '';
    users.forEach((users, index) => {
      content += ` <tr>
                <td  >${index + 1}</td>
                <td >${users.Fname} ${users.Lname} </td>
                <td >${users.Email}</td>
                <td>${users.Pass}</td>
                <td>${users.Role}</td>
                <td>${users.storeName}</td>
                <td>${users.verifiedSeller}</td>
                <td>
                    <button id="editUserNameBtn" class="btn btn-success mb-1" onclick='update(${index})' data-bs-toggle='modal' data-bs-target='#editUserModal'  >Edit</button>
                    <button class="btn btn-danger mb-1"  onclick='deleted(${index})' >Delete</button>
                </td>
            </tr> `;
    });

    tbody.innerHTML = content;
  }
  // end of display user data
  displayData();

  // search input for users
  document.getElementById('inputSearch').addEventListener('keyup', function () {
    let inputSearch = document.getElementById('inputSearch');
    let filter = inputSearch.value.toUpperCase();
    let userTable = document.getElementById('userTable');
    let tr = userTable.getElementsByTagName('tr');

    for (let i = 0; i < tr.length; i++) {
      let td = tr[i].getElementsByTagName('td');
      for (let m = 0; m < td.length; m++) {
        if (td[m]) {
          let value = td[m].textContent || td[m].innerText;
          if (value.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = '';
            break;
          } else {
            tr[i].style.display = 'none';
          }
        }
      }
    }
  });
  //end of search input

  // display chart
  function displayChart() {
    let roleCounts = users.reduce((acc, user) => {
      acc[user.Role] = (acc[user.Role] || 0) + 1;
      return acc;
    }, {});

    let labels = Object.keys(roleCounts);
    let data = Object.values(roleCounts);

    // create chart
    let myChart = document.getElementById('userChart').getContext('2d');
    new Chart(myChart, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Count of Users Role',
            data: data,
            backgroundColor: ['lightblue', 'rgba(255, 99, 132, 0.2)'],
            borderColor: 'red',
            borderWidth: 1,
          },
        ],
      },
      options: {},
    });
  }
  displayChart();
  // end display chart

  // delete user

  window.deleted = function (index) {
    users.splice(index, 1);
    localStorage.setItem('data', JSON.stringify(users));
    displayData();
    displayChart();
  };
  //end of delete user

  // update user
  window.update = function (index) {
    let userUpdate = users[index];
    document.getElementById('editFname').value = userUpdate.Fname;
    document.getElementById('editLname').value = userUpdate.Lname;
    document.getElementById('editEmail').value = userUpdate.Email;
    document.getElementById('editPass').value = userUpdate.Pass;
    document.getElementById('editRole').value = userUpdate.Role;
    document.getElementById('editVerification').value =
      userUpdate.verifiedSeller;
    document.getElementById('storeName').value = userUpdate.storeName;
    let editUserForm = document.getElementById('editUserForm');
    console.log(editUserForm);
    editUserForm.addEventListener('submit', function (e) {
      e.preventDefault();
      users[index] = {
        Fname: document.getElementById('editFname').value,
        Lname: document.getElementById('editLname').value,
        Email: document.getElementById('editEmail').value,
        Pass: document.getElementById('editPass').value,
        Role: document.getElementById('editRole').value,
        verifiedSeller: Boolean(
          document.getElementById('editVerification').value
        ),
        storeName: document.getElementById('storeName').value,
      };

      localStorage.setItem('data', JSON.stringify(users));
      displayData();
      const modalElement = document.getElementById('editUserModal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
    });
  };

  //end update user

  // display products form local storage

  function displayProducts() {
    let products = JSON.parse(localStorage.getItem('data-json')) || [];
    let productTableBody = document.getElementById('productTableBody');
    let container = '';
    products.forEach((product, index) => {
      container += `  <tr>
            <td>${product.id}</td>
            <td><img src="${product.images}" alt="${product.name}" class="img-thumbnail" style="width: 50px; height: 50px;"></td>
            <td>${product.name}</td>
            <td>${product.sellerName}</td>
            <td>${product.price}</td>
            <td>${product.rating}</td>
            <td>${product.maxQuantity}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="updateProduct(${index})" data-bs-toggle='modal' data-bs-target='#editProductModal' >Edit</button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${index})">Delete</button>
            </td>
            </tr>
        `;
    });
    productTableBody.innerHTML = container;
  }
  displayProducts();
  // end display products form local storage

  // delete product editProductModal

  window.deleteProduct = function (index) {
    let products = JSON.parse(localStorage.getItem('data-json')) || [];

    products.splice(index, 1);
    localStorage.setItem('data-json', JSON.stringify(products));
    displayProducts();
    productsChart();
  };
  // end delete product

  // update products
  window.updateProduct = function (index) {
    console.log(index);
    let products = JSON.parse(localStorage.getItem('data-json')) || [];
    let productToUpdate = products[index];

    document.getElementById('editProductId').value = productToUpdate.id;
    document.getElementById('editProductName').value = productToUpdate.name;
    document.getElementById('editProductImages').value = productToUpdate.images;
    document.getElementById('editProductSellerName').value =
      productToUpdate.sellerName;
    document.getElementById('editProductPrice').value = productToUpdate.price;
    document.getElementById('editProductRating').value = productToUpdate.rating;
    document.getElementById('editProductMaxQuantity').value =
      productToUpdate.maxQuantity;

    // Handle image upload
    document
      .getElementById('editProductImageUpload')
      .addEventListener('change', function () {
        let file = this.files[0];
        let reader = new FileReader();
        reader.onload = function (e) {
          document.getElementById('editProductImages').value = e.target.result;
        };
        reader.readAsDataURL(file);
      });

    let editProductForm = document.getElementById('editProductForm');
    editProductForm.addEventListener('submit', function (e) {
      e.preventDefault();

      products[index] = {
        id: document.getElementById('editProductId').value,
        name: document.getElementById('editProductName').value,
        images: document.getElementById('editProductImages').value,
        sellerName: document.getElementById('editProductSellerName').value,
        price: document.getElementById('editProductPrice').value,
        rating: document.getElementById('editProductRating').value,
        maxQuantity: document.getElementById('editProductMaxQuantity').value,
      };
      localStorage.setItem('data-json', JSON.stringify(products));
      displayProducts();
      const modalElement = document.getElementById('editProductModal');
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();
      console.log('hello rakha');
      productsChart();
    });
  };
  // SEARCH PRODUCT LOGIC

  document
    .getElementById('productSearchInput')
    .addEventListener('keyup', function () {
      let productSearchInput = document.getElementById('productSearchInput');
      let filter = productSearchInput.value.toUpperCase();
      let productsTable = document.getElementById('productsTable');
      let tr = productsTable.getElementsByTagName('tr');
      for (let i = 0; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName('td');
        for (let j = 0; j < td.length; j++) {
          if (td[j]) {
            let textValue = td[j].textContent || td[j].innerText;
            if (textValue.toUpperCase().indexOf(filter) > -1) {
              tr[i].style.display = '';
              break;
            } else {
              tr[i].style.display = 'none';
            }
          }
        }
      }
    });
  // add products
  const sellerName = 'Moon Shop';
  const openAddProductModal = document.getElementById('addProductBtn');
  openAddProductModal.addEventListener('click', generateNewProductID);
  const addNewProductBtn = document.getElementById('submitNewProduct');

  const storeName = document.getElementById('addProductSellerName');
  storeName.value = sellerName;
  addNewProductBtn.addEventListener('click', function () {
    const newProductName = document.getElementById('addProductName');
    const addProductForm = document.getElementById('addProductForm');
    const productDescriptionBox = document.getElementById('addProductDetails');
    const imgSRC = document.getElementById('addProductImages');

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
    validations.forEach((ele) => console.log(ele));
    const isFilled = validations.every(Boolean);
    console.log(isFilled);
    if (isFilled) {
      const disabledInputs = addProductForm.querySelectorAll('input:disabled');
      disabledInputs.forEach((input) => (input.disabled = false));
      const getFormData = new FormData(addProductForm);
      disabledInputs.forEach((input) => (input.disabled = true));
      const newProduct = {};
      for (const [key, value] of getFormData) {
        newProduct[key] = value;
        console.log(key, value);
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
      //   populateTable(retrieveProductsData);
    } else console.log('invalid');
  });

  function generateNewProductID() {
    const newProductId = document.getElementById('addProductID');
    const getAllProducts = JSON.parse(window.localStorage.getItem('data-json'));
    console.log(newProductId);
    console.log(+getAllProducts[getAllProducts.length - 1].id);
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
    console.log(targetElement);
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
    console.log(event.target.files[0]);
  });

  function handleAddImgSrc(file) {
    let reader = new FileReader();
    reader.onload = function (e) {
      imgSRC.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  //  Display products chart
  let chart;
  const productsChart = function () {
    let products = JSON.parse(localStorage.getItem('data-json')) || [];

    let productsCounts = products.reduce((acc, product) => {
      acc[product.name] = (acc[product.maxQuantity] || 0) + product.maxQuantity;

      return acc;
    }, {});
    let labels = Object.keys(productsCounts);
    let data = Object.values(productsCounts);

    let backgroundColors = [
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(255, 99, 132, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)',
    ];

    // Create the chart
    let myChart = document.getElementById('productChart').getContext('2d');
    if (chart) {
      chart.destroy();
    }
    // let canvas = document.getElementById('productChart');

    chart = new Chart(myChart, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Quantity of Products',
            data: data,
            backgroundColor: backgroundColors.slice(0, labels.length),
            borderColor: backgroundColors
              .slice(0, labels.length)
              .map((color) => color.replace('0.2', '1')),
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };
  productsChart();
}); // end of load
