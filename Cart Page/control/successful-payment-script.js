window.addEventListener('DOMContentLoaded', function () {
  const bill = document.getElementById('bill');
  const trackBtn = this.document.getElementById('track-now');

  bill.classList.add('show');
  confetti();

  trackBtn.addEventListener('click', function () {
    window.open('../view/track.html', '_self');
  });
  // Automatically hide the bill after 5 seconds
  setTimeout(() => {
    bill.classList.remove('show');
  }, 5000);
});
