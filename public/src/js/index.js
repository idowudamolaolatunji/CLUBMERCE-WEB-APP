const loginFrom = document.querySelector('.login');
const signupForm = document.querySelector('.signup');
const logoutAll = document.querySelectorAll('#logout');


// const spinner = document.querySelector('.spinner-overlay');
const menu = document.querySelector('.menubar-control');
const menuButton = document.querySelector('.menu__button');

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

const adminAuthForm = document.querySelector('#admin-login');


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
// ALERTS
const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
};


// FORMS functions
const login = async (email, password, role) => {
    try {
        const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role }),
        });

        if (!res.ok) {
            throw new Error('Login request failed');
        }
    
        console.log(res)
        spinOverlay.style.visibility = 'visible';
    
        const data = await res.json();
        console.log(res, data)
    
        if (data.data.role === 'admin') {
            showAlert('error', 'Admins cannot log in through this form.');
            spinOverlay.style.visibility = 'hidden';
            return;
        }
    
        if (data.status === 'success') {
            showAlert('success', data.message);
            window.setTimeout(() => {
                // Redirect immediately after displaying success message
                location.assign('/dashboard');
                spinOverlay.style.visibility = 'hidden'
            }, 1500);
    
        } else {
            throw new Error(data.message || 'Login failed');
        }
    } catch (err) {
        showAlert('error', err.message || 'Something went wrong, please try again!');
    }
};
if(loginFrom) {
    loginFrom.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.querySelector('.login__email').value;
        const password = document.querySelector('.login__password').value;
        const role = document.querySelector('.login__role').value;
        login(email, password, role);

        console.log(email, password, role)
    });
}

// MODALS
const openModal = function(overlay, modal) {
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');
}
const closeModal = function(overlay, modal) {
    overlay.classList.add('hidden');
    modal.classList.add('hidden');
}

// Function to display the email verification modal
const showEmailVerificationModal = (email) => {
    // const modalContainer = document.querySelector('.email-verify__modal');
    const modalContainer = document.querySelector('.email__drop-down');
    const emailSpan = modalContainer.querySelector('.user__email');
    emailSpan.textContent = email;
    modalContainer.classList.remove('hidden');
};

// Function to close the email verification modal
const closeEmailVerificationModal = () => {
    const modalContainer = document.querySelector('.email__drop-down');
    modalContainer.classList.add('hidden');
};



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



const adminAuthLogin = async (email, password) => {
    try {
        console.log(email, password);
        
        const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        
        spinOverlay.style.visibility = 'visible'
        // we await the response
        const data = await res.json();
        if (data.status === 'success') {
            if(data.data.role !== 'admin' ) {
                showAlert('error', 'Only admins can log in through this form.');
                spinOverlay.style.visibility = 'hidden';
                return;
            }
        
            window.setTimeout(() => {
                showAlert('success', data.message);
                location.assign('/dashboard');
                spinOverlay.style.visibility = 'hidden'
            }, 2000);
        } else {
            window.setTimeout(() => {
                spinOverlay.style.visibility = 'hidden';
                window.location.reload(true)
            }, 500)
        }
    } catch (err) {
        showAlert('error', err.message || 'Something went wrong, Please try again!')
    }
}

const logout = async () => {
    try {
        const res = await fetch('/api/users/logout');
        const data = await res.json();
        if (data.status === 'success') {
            showAlert('success', 'Logged out successfully.');
      
            // Redirect the admin user to the admin login page
            if (data.data.role === 'admin') {
              location.assign('/auth/admin');
            } else {
              // Redirect other users to the default login page
              location.assign('/login');
            }
        } else {
        showAlert('error', 'Logout failed. Please try again.');
        }
    } catch (err) {
        showAlert('error', 'Something went wrong. Please try again.');
    }
};


const signup = async (...body) => {
    try {
        const [fullName, email, password, passwordConfirm, username, country, phone, role] = body
        console.log({fullName, email, password, passwordConfirm, username, country, phone, role});

        const res = await fetch('/api/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({fullName, email, password, passwordConfirm, username, country, phone, role}),
        });
            spinOverlay.style.visibility = 'visible'
            const data = await res.json();

            if (data.status === 'success') {
                showAlert('success', data.data.message);
                spinOverlay.style.visibility = 'hidden';
                // Add code here to display the email verification modal
                showEmailVerificationModal(email);
              } else if (data.status === 'fail') {
                throw new Error(data.message || 'Error signing up');
              }
    } catch (err) {
        showAlert('error', err)
    }
}

// Event listener for close button in the email verification modal
const closeButton = document.querySelector('.verify__close--icon');
if(closeButton) {
    closeButton.addEventListener('click', closeEmailVerificationModal);


// FORMS controllers

// if(adminAuthForm) {
//     adminAuthForm.addEventListener('submit', function(e) {
//         e.preventDefault();
//         const email = document.querySelector('#admin-email').value;
//         const password = document.querySelector('#admin-password').value;
//         adminAuthLogin(email, password);
//     });
// }
if(logoutAll) logoutAll.forEach(el => el.addEventListener('click', logout));

if(signupForm) {
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const fullName = document.querySelector('.signup__fullname').value;
        const email = document.querySelector('.signup__email').value;
        const password = document.querySelector('.signup__passwordMain').value;
        const passwordConfirm = document.querySelector('.signup__passwordconfirm').value;
        const usernname = document.querySelector('.signup__username').value;
        const country = document.querySelector('.signup__country').value;
        const phone = document.querySelector('.signup__phone').value;
        const role = document.querySelector('.signup__role').value;
        signup(fullName, email, password, passwordConfirm, usernname, country, phone, role);
    })
}


const uploadBtn = document.querySelector('.add-btn');
const productOverlay = document.querySelector('.product__overlay');
const productModal = document.querySelector('.product__modal');
const productClose = document.querySelector('.form__close');
const productForm = document.querySelector('.product__form');

if(uploadBtn)
    uploadBtn.addEventListener('click', function() {
        openModal(productOverlay, productModal);
        console.log('clicked')
    });

if(productClose)
    productClose.addEventListener('click', function() {
        closeModal(productOverlay, productModal)
    });


const UploadProduct = async function(name, summary, description, price, commission, type, category, tools, link, recurring) {
    try {
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name, summary, description, price, commission, type, category, tools, link, recurring}),
        });
        const data = await res.json();
        console.log(res, data);
    } catch(err) {
        console.log(err)
    }
}

if(productForm)
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.querySelector('#product__name').value
        const summary = document.querySelector('#product__summary').value
        const description = document.querySelector('#product__description').value
        const price = document.querySelector('#product__price').value
        const commission = document.querySelector('#product__commission').value
        const type = document.querySelector('#product__type').value
        const category = document.querySelector('#product__category').value
        const tools = document.querySelector('#product__tools').value
        const link = document.querySelector('#product__link').value
        const recurring = document.querySelector('#product__recurring').value
        UploadProduct(name, summary, description, price, commission, type, category, tools, link, recurring)
    });



// const orderProductPage = async function() {
//     try {
//          const res = await fetch(`/product-sales/${userSlug}/${productSlug}`, { method: 'GET' })
         
//          if(res.status === 'success')
//              // Redirect to the order page
//              window.location.href = `/order-page/:${productSlug}`;
//          else {
//              return;
//          }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }
 

// const updateSettings = async() => {
//     try {
//         const url =
//           type === 'password'
//             ? 'http://127.0.0.1:3000/api/users/updateMyPassword'
//             : 'http://127.0.0.1:3000/api/users/updateMe';
    
//         const res = await fetch(url, {
//           method: 'PATCH',
//           data
//         });
    
//         if (res.data.status === 'success') {
//           showAlert('success', `${type.toUpperCase()} updated successfully!`);
//         }
//       } catch (err) {
//         showAlert('error', err.response.data.message);
//       }
// }
// const forgotPasswordForm = document.querySelector('.forgot__form');



// const userDataForm = document.querySelector('')

// if (userDataForm)
//   userDataForm.addEventListener('submit', e => {
//     e.preventDefault();
//     const form = new FormData();
//     form.append('name', document.getElementById('name').value);
//     form.append('email', document.getElementById('email').value);
//     form.append('photo', document.getElementById('photo').files[0]);
//     console.log(form);

//     updateSettings(form, 'data');
//   });

// if (userPasswordForm)
//   userPasswordForm.addEventListener('submit', async e => {
//     e.preventDefault();
//     document.querySelector('.btn--save-password').textContent = 'Updating...';

//     const passwordCurrent = document.getElementById('password-current').value;
//     const password = document.getElementById('password').value;
//     const passwordConfirm = document.getElementById('password-confirm').value;
//     await updateSettings(
//       { passwordCurrent, password, passwordConfirm },
//       'password'
//     );

//     document.querySelector('.btn--save-password').textContent = 'Save password';
//     document.getElementById('password-current').value = '';
//     document.getElementById('password').value = '';
//     document.getElementById('password-confirm').value = '';
//   });



// DROPDOWNS
const notifyIcon = document.querySelector('.notification__icon');
const notifyBox = document.querySelector('.notification__hovered')
const profileImg = document.querySelector('.nav__image')
const profileBox = document.querySelector('.Profile__hovered')


if(notifyIcon)
    notifyIcon.addEventListener('click', () => notifyBox.classList.toggle('hidden'));
    document.querySelector('.main__dashboard').addEventListener('click', () => notifyBox.classList.add('hidden'))

if(profileImg)
    profileImg.addEventListener('click', (e) => profileBox.classList.toggle('hidden'))
    document.querySelector('.main__dashboard').addEventListener('click', () => profileBox.classList.add('hidden'))


// MENUS
const mainDashboard = document.querySelector('.main__dashboard')
const dashboradWidth = mainDashboard.getBoundingClientRect();


if (menu) {
    menu.addEventListener('click', function(e) {
        document.querySelector('.section__bottom').classList.toggle('close');
        if(e.target.classList.contains('fa-close')) {
            e.target.classList.remove('fa-close')
            e.target.classList.add('fa-bars')
        } else {
            e.target.classList.add('fa-close')
            e.target.classList.remove('fa-bars')
        }
        console.log(e.target.classList)
        menuButton.classList.toggle('hidden');
    });

    if (dashboradWidth.right <= 950) {
        menu.classList.remove('fa-close');
        menu.classList.add('fa-bars');
        menu.addEventListener('click', function(e) {
            document.querySelector('.section__bottom').classList.toggle('open');
            if(e.target.classList.contains('fa-bars')) {
                e.target.classList.remove('fa-bars')
                e.target.classList.add('fa-close')
            } else {
                e.target.classList.add('fa-bars')
                e.target.classList.remove('fa-close')
            }
            console.log(e.target.classList)
            menuButton.classList.toggle('hidden');
        });
    }
}





// forgotPassword.addEventListener('click', () => openModal( forgotOverlay, forgotModal));
// forgotOverlay.addEventListener('click', () => closeModal(forgotOverlay, forgotModal));
// forgotClose.addEventListener('click', () => closeModal(forgotOverlay, forgotModal));

// emailVerifyOverlay.addEventListener('click', () => closeModal(emailVerifyOverlay, emailVerifyModal));
// emailVerifyClose.addEventListener('click', () => closeModal(emailVerifyOverlay, emailVerifyModal));

// emailVerifyOverlay.addEventListener('click', () => closeModal(emailVerifyOverlay, emailConfirmModal));
// emailConfirmClose.addEventListener('click', () => closeModal(emailVerifyOverlay, emailConfirmModal));
const hoplinkForm = document.querySelector('.hoplink-form');
const hoplinkOpen = document.querySelectorAll('.promote');
const hoplinkGetOverlay = document.querySelector('.get__overlay')
const hoplinkGetModal = document.querySelector('.get__modal')
const hoplinkClose = document.querySelector('.hoplink__icon');


if(hoplinkOpen)
    hoplinkOpen.forEach(el =>
        el.addEventListener('click', () => {
            openModal(hoplinkGetOverlay, hoplinkGetModal) 
            document.body.style.overflow = 'hidden';
        })
    );

const getHoplink = async function(username, trackingId) {
    try {
        const res = await fetch(`/api/promotion/generate-affiliate-link/:productSlug`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username, trackingId}),
        });
        console.log(productSlug)
        if(!res) throw new Error('Error')
        const data = await res.json();
        console.log(res, data)
    } catch (err) {
        console.log(err)
    }
}


if(hoplinkForm) {
    hoplinkForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const hoplinkUsername = document.querySelector('.hoplink-username').value;
        const hoplinkTrackId = document.querySelector('.hoplink-trackingid').value;

        console.log('submited', hoplinkUsername, hoplinkTrackId);
       getHoplink(hoplinkUsername, hoplinkTrackId);
    })


    hoplinkClose.addEventListener('click', () => {
        closeModal(hoplinkGetOverlay, hoplinkGetModal)
        document.body.style.overflowY = 'visible';
    })
}


// const hoplinkCopyOverlay = document.querySelector('.copy__overlay')
// const hoplinkCopyModal = document.querySelector('.copy__modal')
// const hoplinkCopyOk = document.querySelector('.btnOk');
// hoplinkCopyOk.addEventListener('click', () => {
//     closeModal(hoplinkCopyOverlay, hoplinkCopyModal)
//     document.body.style.overflowY = 'visible';
// })













const updateUser = async function(name, email, phone, country, state, cityRegion, zipPostal) {
    try {
        const res = await fetch('/api/users/updateMe', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name, email, phone, country, state, cityRegion, zipPostal,
            }),
        });

        const data = await res.json();
        console.log(res, data);

        if (data.status === 'success') {
            window.setTimeout(() => {
                showAlert('success', data.message);
                window.location.reload(true);
            }, 1500);
        }

    } catch(err) {
        showAlert('error', err.Response.data.message)
    }
}

const formUpdate = document.querySelector('.form-profile-data');
if(formUpdate) {
    formUpdate.addEventListener('submit', function(e) {
        e.preventDefault();
        const formUpdateName = document.querySelector('#fullName').value
        const formUpdateEmail = document.querySelector('#email').value
        const formUpdatePhone = document.querySelector('#phone').value
        const formUpdateCountry = document.querySelector('#country').value
        const formUpdateState = document.querySelector('#state').value
        const formUpdateCityRegion = document.querySelector('#city-region').value
        const formUpdateZipPostal = document.querySelector('#zip-postal').value
        updateUser(formUpdateName, formUpdateEmail, formUpdatePhone, formUpdateCountry, formUpdateState, formUpdateCityRegion, formUpdateZipPostal);
    });
}

}