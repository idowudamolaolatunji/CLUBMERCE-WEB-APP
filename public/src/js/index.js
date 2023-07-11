'use strict';

// const spinner = document.querySelector('.spinner-overlay');
const spinOverlay = document.querySelector('#spinOverlay');
// const spin = document.querySelector('.spin');

const forgotPassword = document.querySelector('.forgot')
const forgotModal = document.querySelector('.forgot-password__modal');
const forgotClose = document.querySelector('.forgot__close--icon');
const emailVerifyModal = document.querySelector('.email-verify__modal');
const emailVerifyClose = document.querySelector('.email-verify__close--icon');
const emailConfirmModal = document.querySelector('.email-confirmed__modal');
const emailConfirmClose = document.querySelector('.email-confirmed__close--icon');
// const forgotOverlay = document.querySelector('.forgot-password__drop-down');
// const emailVerifyOverlay = document.querySelector('.email__drop-down');



// document.onreadystatechange = function() {
//     if (document.readyState !== "complete") {
//         spinOverlay.style.visibility = "visible";
//     } else {
//         spinOverlay.style.visibility = "hidden";
//     }
// }


// MOBILE NAVIGATION
// const btnNavEl = document.querySelector(".btn-mobile-nav");
// const headerEl = document.querySelector(".header");
// btnNavEl.addEventListener("click", function() {
//     headerEl.classList.toggle("nav-open");
// });

//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////


// REUSEABLE FUNCTION


// MODALS
const openModal = function(overlay, modal) {
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');
}
const closeModal = function(overlay, modal) {
    overlay.classList.add('hidden');
    modal.classList.add('hidden');
}




const testimonialContainer = document.querySelector('.testimonial__slide');
const testimonialSlides = Array.from(document.querySelectorAll('.testimonial__slide--item'));
const dots = Array.from(document.querySelectorAll('.dot'));

const slideWidth = testimonialSlides[0].getBoundingClientRect().width;
const gap = 40; // Adjust the gap between slide items as needed

let currentSlide = testimonialSlides.findIndex((slide) => slide.classList.contains('testimonial__slide--active'));
let isDragging = false;
let startPosX = 0;
let currentTranslate = 0;
let prevSlide = testimonialSlides.length - 1;
let autoplayInterval;

function setSlidePosition() {
  testimonialContainer.style.transform = `translateX(${currentTranslate}px)`;
}

function animateSlide() {
  testimonialContainer.style.transition = 'transform 0.5s ease-in-out';
  setSlidePosition();
}

function showSlide(index) {
  currentSlide = index;

  const slidesLength = testimonialSlides.length;
  const containerWidth = testimonialContainer.getBoundingClientRect().width;

  currentTranslate = (containerWidth - slideWidth) / 2 - (slideWidth + gap) * currentSlide;

  animateSlide();

  testimonialSlides.forEach((slide, i) => {
    slide.classList.toggle('testimonial__slide--active', i === currentSlide);
    slide.style.transform = '';
    slide.style.transition = '';
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('dot__active', i === currentSlide);
  });
}

function nextSlide() {
  prevSlide = currentSlide;
  currentSlide = (currentSlide + 1) % testimonialSlides.length;
  showSlide(currentSlide);
}

function startAutoplay() {
  autoplayInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds (adjust as needed)
}

function stopAutoplay() {
  clearInterval(autoplayInterval);
}

function handleDragStart(event) {
  isDragging = true;
  startPosX = event.clientX;
  testimonialContainer.style.transition = '';
}

function handleDragEnd(event) {
  if (isDragging) {
    const endPosX = event.clientX;
    const deltaX = startPosX - endPosX;
    const threshold = slideWidth * 0.3; // Adjust threshold distance for slide change

    if (deltaX > threshold) {
      nextSlide();
    } else if (deltaX < -threshold) {
      prevSlide = currentSlide;
      currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
      showSlide(currentSlide);
    }

    isDragging = false;
    animateSlide();
  }
}

testimonialContainer.addEventListener('mousedown', handleDragStart);
testimonialContainer.addEventListener('mouseup', handleDragEnd);
testimonialContainer.addEventListener('mouseleave', handleDragEnd);

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    showSlide(index);
    stopAutoplay();
    startAutoplay();
  });
});

document.querySelector('.prev-btn').addEventListener('click', () => {
  prevSlide = currentSlide;
  currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
  showSlide(currentSlide);
  stopAutoplay();
  startAutoplay();
});

document.querySelector('.next-btn').addEventListener('click', () => {
  nextSlide();
  stopAutoplay();
  startAutoplay();
});

window.addEventListener('resize', () => {
  showSlide(currentSlide);
});

showSlide(currentSlide);
startAutoplay();



// Function to animate the statistics
function animateStatistics() {
  const statItems = document.querySelectorAll('.stats__data');

  statItems.forEach((item) => {
    const targetValue = parseInt(item.getAttribute('data-value'));
    const symbol = item.getAttribute('data-symbol');
    const currency = item.getAttribute('data-currency');
    let currentValue = 0;
    const increment = Math.ceil(targetValue / 100); // Adjust increment value for smoother animation

    const animation = setInterval(() => {
      if (currentValue >= targetValue) {
        clearInterval(animation);
        item.querySelector('span').textContent = `${currency ? currency : ''}${targetValue}${symbol}`; // Ensure final value is displayed accurately
      } else {
        currentValue += increment;
        if (currentValue > targetValue) {
          currentValue = targetValue;
        }

        item.querySelector('span').textContent = `${currency ? currency : ''}${currentValue}${symbol}`;
      }
    }, 50);
  });
}
// Intersection Observer callback function
function handleIntersection(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateStatistics();
      observer.unobserve(entry.target);
    }
  });
}
// Create an Intersection Observer instance
const observer = new IntersectionObserver(handleIntersection, { threshold: 0.2 });
// Observe the stats section element
const statsSection = document.querySelector('.stats__section');
observer.observe(statsSection);




// Get DOM elements
const accordionItems = document.querySelectorAll('.faq__accordion--item');

// Add event listeners to accordion items
accordionItems.forEach((accordionItem) => {
    const title = accordionItem.querySelector('.accordion__content--title');
    const content = accordionItem.querySelector('.faq__accordion--content');

    // Toggle accordion item on title click
    title.addEventListener('click', () => {
        accordionItem.classList.toggle('faq__open');

        if (accordionItem.classList.contains('faq__open')) {
            content.style.display = 'block';
        } else {
            content.style.display = 'none';
        }
    });
});