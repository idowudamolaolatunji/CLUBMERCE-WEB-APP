const loginForm = document.querySelector('.login');
const signupForm = document.querySelector('.signup');
const adminAuthForm = document.querySelector('#admin-login');
const spinOverlay = document.querySelector('#spinOverlay');

const navMenuBtn = document.querySelector(".navigation-controls");
const navList = document.querySelector(".nav__list");
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

const showLoadingOverlay = () => {
     spinOverlay.style.visibility = 'visible';
};

const hideLoadingOverlay = () => {
     spinOverlay.style.visibility = 'hidden';
};

const login = async (email, password, role) => {
     try {
          showLoadingOverlay();

          const res = await fetch('/api/users/login', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ email, password, role }),
          });

          if (!res.ok) {
               throw new Error('Login request failed');
          }

          const data = await res.json();

          if (data.data.role === 'admin') {
               hideLoadingOverlay();
               showAlert('error', 'Admins cannot log in through this form.');
               return;
          }

          if (data.status === 'success') {
               showAlert('success', 'Auth Successful!');
               setTimeout(() => {
               location.assign('/dashboard');
               }, 3000);
          } else if (data.status === 'fail') {
               throw new Error(data.message || 'Login failed');
          }
     } catch (err) {
          hideLoadingOverlay();
          showAlert('error', err.message || 'Something went wrong, please try again!');
     }
};

const adminAuthLogin = async (email, password) => {
     try {
          showLoadingOverlay();

          const res = await fetch('/api/users/login-admin', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ email, password }),
          });

          if (!res.ok) {
               throw new Error('Login request failed');
          }

          const data = await res.json();

          if (data.status === 'success') {
               if (data.data.role === 'vendor' || data.data.role === 'affiliate') {
                    hideLoadingOverlay();
                    showAlert('error', 'Only admins can log in through this form.');
                    return;
               }

               showAlert('success', 'Auth Successful');
               setTimeout(() => {
                    location.assign('/dashboard');
               }, 2000);
          } else {
               setTimeout(() => {
                    hideLoadingOverlay();
                    window.location.reload(true);
               }, 500);
          }
     } catch (err) {
          hideLoadingOverlay();
          showAlert('error', err.message || 'Something went wrong. Please try again!');
     }
};


const showEmailVerificationModal = (email) => {
    const modalContainer = document.querySelector('.email__drop-down');
    const emailSpan = modalContainer.querySelector('.user__email');
    emailSpan.textContent = email;
    modalContainer.classList.remove('hidden');
};
  
const closeEmailVerificationModal = () => {
    const modalContainer = document.querySelector('.email__drop-down');
    modalContainer.classList.add('hidden');
    location.reload();
};
  
const closeButton = document.querySelector('.verify__close--icon');
if (closeButton) {
    closeButton.addEventListener('click', closeEmailVerificationModal);
}
  

// signup
const signup = async (fullName, email, password, passwordConfirm, username, country, phone, role) => {
     try {
          showLoadingOverlay();
     
          const res = await fetch('/api/users/signup', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ fullName, email, password, passwordConfirm, username, country, phone, role }),
          });
     
          if (!res.ok) {
               throw new Error('Error signing up');
          }
     
          const data = await res.json();
     
          if (data.status === 'success') {
               showAlert('success', data.data.message || 'Successful');
               showEmailVerificationModal(email);
          } else if (data.status === 'fail') {
               location.reload(true)
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
       const response = await fetch(`/api/auth/verify-email/${verificationToken}`);
   
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

   

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.querySelector('.login__email').value;
    const password = document.querySelector('.login__password').value;
    const role = document.querySelector('.login__role').value;
    login(email, password, role);
  });
}

if (adminAuthForm) {
  adminAuthForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.querySelector('#admin-email').value;
    const password = document.querySelector('#admin-password').value;
    adminAuthLogin(email, password);
  });
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
    const phone = document.querySelector('.signup__phone').value;
    const role = document.querySelector('.signup__role').value;
    signup(fullName, email, password, passwordConfirm, username, country, phone, role);
  });
}
