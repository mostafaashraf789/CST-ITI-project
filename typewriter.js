document.addEventListener('DOMContentLoaded', function () {
  const text = 'Welcome to MoonShop';
  const speed = 150; // Speed of typing in milliseconds
  let index = 0;

  function typeWriter() {
    if (index < text.length) {
      document.getElementById('typewriter').textContent += text.charAt(index);
      index++;
      setTimeout(typeWriter, speed);
    } else {
      setTimeout(() => {
        document.getElementById('typewriter').textContent = '';
        index = 0;
        typeWriter();
      }, speed * 10); // Pause before restarting
    }
  }

  typeWriter();
});

function welcomeMessage() {}
