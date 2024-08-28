document.addEventListener('DOMContentLoaded', function () {
  // Ensure that the element with id 'cardDirection' exists
  const cardDirections = document.querySelectorAll('.cardDirection');

  cardDirections.forEach(function (cardDirection) {
    if (cardDirection) {
      cardDirection.addEventListener('click', function () {
        // Ensure that the tour id is properly rendered in EJS
        const tourId = cardDirection.getAttribute('data-tour-id');

        if (tourId) {
          window.location.href = `/tours/${tourId}`;
        } else {
          console.error('Tour ID is missing.');
        }
      });
    } else {
      console.error('Element with id "cardDirection" not found.');
    }
  });

  // Handle navbar scroll behavior
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('bg-dark', 'navbar-sticky');
      } else {
        navbar.classList.remove('bg-dark', 'navbar-sticky');
      }
    });
  } else {
    console.error('Navbar element not found.');
  }
});

// window.addEventListener('resize', function () {
//   if (window.matchMedia('(max-width: 576px)').matches) {
//     // If the screen is 576px or smaller, remove the class
//     document.querySelector('.photos').classList.remove('angled-container');
//   } else {
//     document.querySelector('.photos').classList.add('angled-container');
//   }
// });
