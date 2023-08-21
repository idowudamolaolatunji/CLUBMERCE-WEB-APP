const spinOverlay = document.querySelector('#spinOverlay');
document.addEventListener("DOMContentLoaded", function() {
  spinOverlay.style.visibility = "visible";
});

window.addEventListener("load", function() {
  spinOverlay.style.visibility = "hidden";
});


const signupForm = document.querySelector('.signup');

const showLoadingOverlay = () => {
  spinOverlay.style.visibility = 'visible';
};
const hideLoadingOverlay = () => {
  spinOverlay.style.visibility = 'hidden';
};

// ALERTS
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  setTimeout(hideAlert, 5000);
};

const showEmailVerificationModal = (email) => {
    const modalContainer = document.querySelector('.email__drop-down');
    const emailSpan = modalContainer.querySelector('.user__email');
    emailSpan.textContent = `@${email.toLowerCase()}`;
    modalContainer.classList.remove('hidden');
};
  
const closeEmailVerificationModal = () => {
    const modalContainer = document.querySelector('.email__drop-down');
    modalContainer.classList.add('hidden');
//     location.assign('/login');
    location.reload(true);
};
  
const closeButton = document.querySelector('.verify__close--icon');
if (closeButton) {
    closeButton.addEventListener('click', closeEmailVerificationModal);
}
  

// signup
const signup = async (fullName, email, role, password, passwordConfirm, username, country, phone) => {
     try {
          if(role !== 'vendor' || role !== 'admin') return;
          showLoadingOverlay();
     
          const res = await fetch('/api/users/signup', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ fullName, email, password, passwordConfirm, username, country, phone }),
          });
     
          if (!res.ok) {
               throw new Error('Error signing up');
          }
     
          const data = await res.json();
          if(data.message === 'Email already Exist') {
               showAlert('error', data.message);
               hideLoadingOverlay();
          }
          if(data.message === 'Username already Exist') {
               showAlert('error', data.message);
               hideLoadingOverlay();
          }
          if (data.status === 'success') {
               showAlert('success', data.message || 'Successful');
               showEmailVerificationModal(email);
          } else if (data.status === 'fail') {
               throw new Error(data.message || 'Error signing up');
          }
     } catch (err) {
          showAlert('error', err.message || 'Something went wrong. Please try again!');
     } finally {
          hideLoadingOverlay();
     }
};
// email confirmation
const showEmailConfirmationModal = () => {
     const modalContainer = document.querySelector('.email-confirmed__modal');
     modalContainer.classList.remove('hidden');
};
const closeEmailConfirmationModal = () => {
     const modalContainer = document.querySelector('.email-confirmed__modal');
     modalContainer.classList.add('hidden');
};

// Event listener for close icon in the email confirmation modal
const closeIcons = document.querySelectorAll('.email-confirm__close--icon');
   closeIcons.forEach((icon) => {
     icon.addEventListener('click', closeEmailConfirmationModal);
});
   
// verify email
const verifyEmail = async function (verificationToken) {
     try {
       // Retrieve the verification token from the URL
     //   const urlParams = new URLSearchParams(window.location.search);
     //   const verificationToken = urlParams.get('token');
   
       // Make a GET request to the backend verification route
       const response = await fetch(`/api/users/verify-email/${verificationToken}`);
   
       if (response.ok) {
         // Verification successful
         const confirmationMessage = `
           <div class="email__drop-down drop-down__shadow">
             <div class="email-confirmed__modal modal">
               <i class="fa-solid fa-close close__icon email-confirm__close--icon"></i>
               <div class="modal__container">
                 <h3 class="extra__heading">Success!</h3>
                 <p class="modal__text">Your email address has been verified successfully!</p>
                 <a class="form__button proceed__button" href="/login">Proceed to login</a>
               </div>
             </div>
           </div>
         `;
   
         // Add the confirmation message to the document body
         document.body.insertAdjacentHTML('beforeend', confirmationMessage);
       } else {
         // Verification failed
         const errorMessage = `
          <div class="email__drop-down drop-down__shadow">
               <div class="email-confirmed__modal modal">
                    <i class="fa-solid fa-close close__icon email-confirm__close--icon"></i>
                    <div class="modal__container">
                         <h3 class="extra__heading">Failed!</h3>
                         <p class="modal__text">Email verification failed. Please try again.</p>
                    </div>
               </div>
          </div>
         `;
   
         // Add the error message to the document body
         document.body.insertAdjacentHTML('beforeend', errorMessage);
       }
     } catch (error) {
       // Handle network or other errors
       console.log(error);
       const errorMessage = `
         <div class="email__drop-down drop-down__shadow">
           <div class="email-confirmed__modal modal">
             <i class="fa-solid fa-close close__icon email-confirm__close--icon"></i>
             <div class="modal__container">
               <h3 class="extra__heading">Error!</h3>
               <p class="modal__text">An error occurred. Please try again later.</p>
             </div>
           </div>
         </div>
       `;
   
       // Add the error message to the document body
       document.body.insertAdjacentHTML('beforeend', errorMessage);
     }
}


function getVerificationTokenFromURL() {
     const urlParams = new URLSearchParams(window.location.search);
     return urlParams.get('token');
}
// Check if a verification token exists in the URL
const verificationToken = getVerificationTokenFromURL();
if (verificationToken) {
     verifyEmail(verificationToken);
}
if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const fullName = document.querySelector('.signup__fullname').value;
    const email = document.querySelector('.signup__email').value;
    const password = document.querySelector('.signup__passwordMain').value;
    const passwordConfirm = document.querySelector('.signup__passwordconfirm').value;
    const username = document.querySelector('.signup__username').value;
    const country = document.querySelector('.signup__country').value;
    const phone = +document.querySelector('.signup__phone').value;
    const role = e.target.dataset.role;
//     const role = document.querySelector('.signup__role').value;
    signup(fullName, email, role, password, passwordConfirm, username, country, phone);
  })
}



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


// LEC 16) A Better Way: The Intersection Observer API
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
