window.addEventListener('DOMContentLoaded', (event) => {
  const isSeller = JSON.parse(window.localStorage.getItem('sellerDetails'));
  if (!isSeller) {
    // Redirect to a page for unauthorized access
    window.location.href = '../../Unauthorized.html';
  }

  window.localStorage.setItem('isAdmin', false);

  // Toggle the side navigation
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
  const ctx_1 = document.getElementById('myAreaChart').getContext('2d');
  const ctx_2 = document.getElementById('myBarChart').getContext('2d');

  const sellerName = isSeller.storeName.toLowerCase();

  //  retrieve store name.

  const locateSellerData = JSON.parse(localStorage.getItem('isLogin'));

  const sellersData = JSON.parse(window.localStorage.getItem('data-json'));
  const particularSellerData = sellersData.filter(
    (ele) => ele.sellerName === sellerName
  );
  const productsNames = particularSellerData.map((ele) => ele.name);
  const soldProducts = particularSellerData.map((ele) => ele.soldQuantity || 0);

  const availableStock = particularSellerData.map(
    (ele) => ele.maxQuantity - (ele.soldQuantity || 0)
  );
  const productsWithRevenue = particularSellerData.filter(
    (ele) => ele.soldQuantity
  );
  const revenue = productsWithRevenue.reduce(
    (acc, curr) => acc + curr.soldQuantity * curr.price,
    0
  );
  const revenueElement = document.getElementById('revenue');
  let counter = 0;
  const speed = 10;
  const increment = revenue / 200;

  const timer = setInterval(function () {
    counter += increment;
    revenueElement.textContent = `EGP ${Math.min(
      Math.floor(counter),
      revenue
    ).toFixed(2)}`;

    if (counter >= revenue) {
      clearInterval(timer);
    }
  }, speed);
  //  best seller
  const bestSeller =
    productsWithRevenue.reduce(
      (acc, curr) =>
        acc.soldQuantity > curr.soldQuantity ? acc.name : curr.name,
      0
    ) || 'Nothing Sold Yet!';
  const bestSellerElement = (document.getElementById(
    'best-seller'
  ).textContent = `${bestSeller}`);

  // Global Options
  Chart.defaults.font.family = 'Lato';
  Chart.defaults.font.size = 16;
  Chart.defaults.font.color = 'lightgrey';

  const salesChart_1 = new Chart(ctx_1, {
    type: 'doughnut',
    data: {
      labels: [...productsNames],
      datasets: [
        {
          label: 'Best Seller(Sold Quantities)',

          data: [...soldProducts],
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(100, 181, 246, 0.2)',
            'rgba(255, 87, 34, 0.2)',
            'rgba(0, 188, 212, 0.2)',
          ],
          borderWidth: 1,
          borderColor: '#777',
          hoverBorderWidth: 2,
          hoverBorderColor: '#000',
        },
        {
          label: 'Available Stock',

          data: [...availableStock],
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(100, 181, 246, 0.2)',
            'rgba(255, 87, 34, 0.2)',
            'rgba(0, 188, 212, 0.2)',
          ],
          borderWidth: 1,
          borderColor: '#777',
          hoverBorderWidth: 2,
          hoverBorderColor: '#000',
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: `Sales and Stock Data for ${sellerName.toUpperCase()}`,
          font: {
            size: 25,
          },
        },
        legend: {
          position: 'right',
          display: true,
          labels: {
            color: '#000',
            font: {},
          },
        },
      },
    },
  });
  const salesChart_2 = new Chart(ctx_2, {
    type: 'bar',
    data: {
      labels: [...productsNames],
      datasets: [
        {
          label: 'Top Seller(Sold Quantities)',

          data: [...soldProducts],
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(100, 181, 246, 0.2)',
            'rgba(255, 87, 34, 0.2)',
            'rgba(0, 188, 212, 0.2)',
          ],
          borderWidth: 1,
          borderColor: '#777',
          hoverBorderWidth: 2,
          hoverBorderColor: '#000',
        },
        {
          label: 'Available Stock',

          data: [...availableStock],
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(201, 203, 207, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(100, 181, 246, 0.2)',
            'rgba(255, 87, 34, 0.2)',
            'rgba(0, 188, 212, 0.2)',
          ],
          borderWidth: 1,
          borderColor: '#777',
          hoverBorderWidth: 2,
          hoverBorderColor: '#000',
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: `Sales and Stock Data for ${sellerName.toUpperCase()}`,
          font: {
            size: 25,
          },
        },
        legend: {
          position: 'right',
          display: true,
          labels: {
            color: '#000',
            font: {},
          },
        },
      },
    },
  });

  //  script table

  let finalPurchasedProducts =
    JSON.parse(window.localStorage.getItem('finalPurchasedProducts')) || [];

  // let sellerName = 'Maggy Store';
  async function fetchProducts() {
    try {
      const response = await fetch('../backend/data.json');
      const { products } = await response.json();
      const updateProducts = products.map((ele) => {
        const matchingProduct = finalPurchasedProducts.find(
          (p) => p.id === ele.id
        );
        if (matchingProduct) {
          ele.soldQuantity = matchingProduct.soldQuantity;
        }
        return ele;
      });
      window.localStorage.setItem('data-json', JSON.stringify(updateProducts));

      const sellerProducts = updateProducts.filter(
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
      populateTable(JSON.parse(window.localStorage.getItem('data-json')));
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
      populateTable(JSON.parse(window.localStorage.getItem('data-json')));
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

  //  log out

  const logOutBtn = document.getElementById('logout');
  logOutBtn.addEventListener('click', function () {
    window.localStorage.removeItem('isSeller');
    window.open('../../index.html', '_self');
  });
});
