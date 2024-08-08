window.addEventListener('DOMContentLoaded', (event) => {
  // Toggle the side navigation
  const sidebarToggle = document.body.querySelector('#sidebarToggle');
  if (sidebarToggle) {
    // Uncomment Below to persist sidebar toggle between refreshes
    // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
    //     document.body.classList.toggle('sb-sidenav-toggled');
    // }
    sidebarToggle.addEventListener('click', (event) => {
      event.preventDefault();
      document.body.classList.toggle('sb-sidenav-toggled');
      localStorage.setItem(
        'sb|sidebar-toggle',
        document.body.classList.contains('sb-sidenav-toggled')
      );
    });
  }

  // // LOGOUT
  const logOutBtn = document.getElementById('logout');
  logOutBtn.addEventListener('click', function () {
    window.localStorage.removeItem('isSeller');
    window.open('../../index.html', '_self');
  });

  // Generate Chart
  const ctx = document.getElementById('myChart').getContext('2d');
  const sellerName = 'Maggy Store';
  const sellersData = JSON.parse(window.localStorage.getItem('data-json'));
  const particularSellerData = sellersData.filter(
    (ele) => ele.sellerName === sellerName
  );
  const productsNames = particularSellerData.map((ele) => ele.name);
  const soldProducts = particularSellerData.map((ele) => ele.soldQuantity || 0);

  const availableStock = particularSellerData.map(
    (ele) => ele.maxQuantity - (ele.soldQuantity || 0)
  );
  console.log(particularSellerData);
  console.log(productsNames);
  console.log(soldProducts);
  console.log(availableStock);

  // Global Options
  Chart.defaults.font.family = 'Lato';
  Chart.defaults.font.size = 16;
  Chart.defaults.font.color = 'lightgrey';
  // Chart.defaults.elements.point.radius = 10;
  // Chart.defaults.elements.point.backgroundColor = 'red';

  // chart Types =>   bar  , pie, line , doughnut, radar, polarArea
  const salesChart = new Chart(ctx, {
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
          text: `Sales and Stock Data for ${sellerName}`,
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
});

// rgba(75, 192, 192, 0.2) - Light Teal
// rgba(54, 162, 235, 0.2) - Light Blue
// rgba(255, 99, 132, 0.2) - Light Red
// rgba(153, 102, 255, 0.2) - Light Purple
// rgba(255, 206, 86, 0.2) - Light Yellow
// rgba(201, 203, 207, 0.2) - Light Gray
// rgba(255, 159, 64, 0.2) - Light Orange
// rgba(100, 181, 246, 0.2) - Light Sky Blue
// rgba(255, 87, 34, 0.2) - Light Deep Orange
// rgba(0, 188, 212, 0.2) - Light Cyan
