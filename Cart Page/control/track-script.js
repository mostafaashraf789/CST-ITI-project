window.addEventListener('DOMContentLoaded', function () {
  const orderSummaryContainer = document.querySelector('#productTableBody');

  // Fetch and display order details
  const finalPurchasedProducts = JSON.parse(
    localStorage.getItem('finalPurchasedProducts')
  );

  if (finalPurchasedProducts) {
    function populateProductTable(finalPurchasedProducts) {
      orderSummaryContainer.innerHTML = '';

      finalPurchasedProducts.forEach((product) => {
        const row = `
          <tr >
            <td>${product.name}</td>
            <td>${product.soldQuantity}</td>
            <td>EGP ${(product.price * product.maxQuantity).toFixed(2)}</td>
          
          </tr>
        `;
        orderSummaryContainer.insertAdjacentHTML('beforeend', row);
      });
    }

    populateProductTable(finalPurchasedProducts);
  } else {
    orderSummaryContainer.innerHTML = '<p>No order details found.</p>';
  }
  //  handle order dates
  const orderStatuses = [
    'Order received and confirmed',
    'Preparing for shipment',
    'Out for delivery',
    'Delivered',
  ];

  const orderedDateElement = document.getElementById('ordered-date');
  const shippedDateElement = document.getElementById('shipped-date');
  const deliveryDateElement = document.getElementById('delivery-date');

  const SHIPPING_DAYS_OFFSET = 2;
  const DELIVERY_DAYS_OFFSET = 3;

  orderedDateElement.textContent = formatDate(new Date());
  shippedDateElement.textContent = formatDate(
    addDays(new Date(), SHIPPING_DAYS_OFFSET)
  );
  deliveryDateElement.textContent = formatDate(
    addDays(new Date(), DELIVERY_DAYS_OFFSET)
  );

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function formatDate(date) {
    return date
      .toUTCString()
      .replace(',', '')
      .split(' ')
      .slice(0, 4)
      .join(', ');
  }
  //  handle order timing track
  const isShipped = document.querySelector('.is-shipped');
  const isDelivered = document.querySelector('.is-delivered');

  setTimeout(function () {
    // Style the "isShipped" element after 6 seconds
    isShipped.parentElement.classList.add('completed');
  }, 6000);

  setTimeout(function () {
    // Style the "isDelivered" element after 12 seconds
    isDelivered.parentElement.classList.add('completed');
  }, 12000);

  //  reset cartItems in local Storage.
  window.localStorage.removeItem('cartItems');
  // back to home page

  const backToHomePage = document.getElementById('home-page-btn');
  backToHomePage.addEventListener('click', function () {
    window.open('../../index.html', '_self');
  });
});
