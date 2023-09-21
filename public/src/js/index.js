const spinOverlay = document.querySelector('#spinOverlay');
document.addEventListener("DOMContentLoaded", function() {
  spinOverlay.style.visibility = "visible";
});

window.addEventListener("load", function() {
  spinOverlay.style.visibility = "hidden";
});


function changeText() {
  const textSets = [
    { extraText: 'Earning Potentials.' },
    { extraText: 'Financial Success.' },
    { extraText: 'Treasure Mindset.' }
  ];

  const outputElement = document.querySelector('.section__heading.hero__heading h1.section__heading--primary');

  let currentSetIndex = 0;0

  function updateText() {
    if(outputElement)
      outputElement.textContent = 'Unleash Your ' + textSets[currentSetIndex].extraText;

    currentSetIndex++;
    if (currentSetIndex >= textSets.length) {
      currentSetIndex = 0;
    }
  }

  // Wait for the page to completely load
  window.addEventListener('load', () => {
    // Start the text changing loop
    setInterval(updateText, 3500);
  });
}

changeText();


// MOBILE NAVIGATION

const navMenuBtn = document.querySelector(".navigation-controls");
const navList = document.querySelector(".nav__list-m");
const icon = document.querySelector('.navigation-icon');

if (navMenuBtn) {
  navMenuBtn.addEventListener("click", function() {
    if (icon.classList.contains('fa-close')) {
      navList.style.transform = 'translateX(100%)';
      setTimeout(() => {
        navList.style.visibility = 'hidden';
      }, 500);
    } else {
      navList.style.visibility = 'visible';
      navList.style.transform = 'translateX(0)';
    }
    icon.classList.toggle('fa-close');
  });
}


if (window.innerWidth >= 750) {

  const obsCallback = function (entries, observer) {
    entries.forEach((entry) => {
      console.log(entry);
    });
  };

  const obsOptions = {
    root: null,
    threshold: [0, 0.2],
  };

  const nav = document.querySelector('.header')
  const observer = new IntersectionObserver(obsCallback, obsOptions);
  const navHeight = nav.getBoundingClientRect().height;
  // console.log(navHeight);

  const stickNav = function (entries) {
    const [entry] = entries; // Destructuring

    if (!entry.isIntersecting) nav.classList.add("sticky");
    else nav.classList.remove("sticky");
  };

  const headerObserver = new IntersectionObserver(stickNav, {
    root: null,
    threshold: .5,

    rootMargin: `-${navHeight}px`,
  });

  if(document.querySelector('.hero__section')) {
    headerObserver.observe(document.querySelector(".hero__section"));
  }
} else if (window.innerWidth <= 750) {
  const nav = document.querySelector('.header');
  const navHeight = nav.getBoundingClientRect().height;

  const stickNav = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) {
      nav.classList.add("sticky");
    } else {
      nav.classList.remove("sticky");
    }
  };

  const headerObserver = new IntersectionObserver(stickNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  });

  headerObserver.observe(nav);

}



const allSections = document.querySelectorAll(".section");
const revealSection = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.remove("section--hidden");
      observer.unobserve(entry.target);
    }
  });
};

const rowObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.11
});

allSections.forEach((section) => {
  rowObserver.observe(section);
  section.classList.add("section--hidden");
});


//////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

// MODALS
const openModal = function(overlay, modal) {
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');
}
const closeModal = function(overlay, modal) {
    overlay.classList.add('hidden');
    modal.classList.add('hidden');
}


// // Get DOM elements
const accordionItems = document.querySelectorAll('.faq__accordion--item');

accordionItems.forEach((accordionItem) => {
  const title = accordionItem.querySelector('.accordion__content--title');
  const content = accordionItem.querySelector('.faq__accordion--content');

  title.addEventListener('click', () => {
    const isOpen = accordionItem.classList.contains('faq__open');

    accordionItems.forEach((item) => {
      item.classList.remove('faq__open');
      item.querySelector('.faq__accordion--content').style.display = 'none';
    });

    if (!isOpen) {
      accordionItem.classList.add('faq__open');
      content.style.display = 'block';
    }
  });
});



const slider = function() {
  
    const testimonialContainer = document.querySelector('.testimonial__slide');
    const testimonialSlides = Array.from(document.querySelectorAll('.testimonial__slide--item'));
    const dots = Array.from(document.querySelectorAll('.dot'));

    const gap = 40; // Adjust the gap between slide items as needed

    let currentSlide = testimonialSlides.findIndex((slide) => slide.classList.contains('testimonial__slide--active'));
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

        if(testimonialContainer) {
          const containerWidth = testimonialContainer.offsetWidth;
          currentTranslate = -((testimonialSlides[currentSlide].offsetLeft) - (containerWidth - testimonialSlides[currentSlide].offsetWidth) / 2);

          animateSlide();

          testimonialSlides.forEach((slide, i) => {
              slide.classList.toggle('testimonial__slide--active', i === currentSlide);
          });
        }
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


    if(document.querySelector('.prev-btn'))
      document.querySelector('.prev-btn').addEventListener('click', () => {
          prevSlide = currentSlide;
          currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
          showSlide(currentSlide);
          stopAutoplay();
          startAutoplay();
      });

    if(document.querySelector('.next-btn'))
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


}
slider()


const stats = function() {
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
    if(statsSection)
      observer.observe(statsSection);
}
stats()
