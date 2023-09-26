const loginForm = document.querySelector('.user-login');
const adminAuthForm = document.querySelector('#admin-login');
const signupForm = document.querySelector('.signup');
const spinOverlay = document.querySelector('#spinOverlay');

const buyerSignupForm = document.querySelector('#buyer-signup');
const buyerAuthForm = document.querySelector('#buyer-login');

const navMenuBtn = document.querySelector(".navigation-controls");
const navList = document.querySelector(".nav__list");
const icon = document.querySelector('.navigation-icon');


const showLoadingOverlay = () => {
     spinOverlay.style.visibility = 'visible';
};
const hideLoadingOverlay = () => {
     spinOverlay.style.visibility = 'hidden';
};
document.addEventListener("DOMContentLoaded", function() {
     showLoadingOverlay();
});
window.addEventListener("load", function() {
     hideLoadingOverlay()
});
const proceed = document.querySelector('.proceed__button');
if(proceed) {
  proceed.addEventListener('click', function() {
    showLoadingOverlay();
  })
}



// ALERTS
const hideAlert = () => {
     const el = document.querySelector('.alert');
     if (el) el.parentElement.removeChild(el);
};

const showAlert = (type, msg) => {
     hideAlert();
     const markup = `
          <div class="alert alert--${type}">
               ${msg}&nbsp;
               <picture>
                    <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/${type === 'error' ? '1f61f' : '2728'}/512.webp" type="image/webp">
                    <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/${type === 'error' ? '1f61f/512.gif" alt="😟"' : '2728/512.gif" alt="✨"'} width="32" height="32">
               </picture>
          </div>`;
     document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
     setTimeout(hideAlert, 5000);
};


const login = async (email, password) => {
     try {
          showLoadingOverlay();
          console.log(email, password)

          const res = await fetch('/api/users/login', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ email, password }),
          });
          console.log(res)
          if (!res.ok) {
               showAlert('error', 'Login failed, Check internet connection');
               hideLoadingOverlay();
          }
          const data = await res.json();
          console.log(data)
          if(data.message === 'Email address not verified, Check your mail' || data.message === 'Account no longer active' || data.message === 'Incorrect email or password') {{
               hideLoadingOverlay();
               showAlert('error', data.message);
               return;
          }}
          if (data.data.user.role === 'buyer' || data.data.user.role === 'admin') {
               hideLoadingOverlay();
               showAlert('error', 'Only affiliates or vendors can log in through this form.');
               return;
          }
          if (data.status === 'success') {
               showAlert('success', 'Authentication Successful!');
               setTimeout(() => {
               location.assign('/dashboard');
               }, 3000);
          } else if (data.status === 'fail') {
               hideLoadingOverlay();
               throw new Error(data.message);
          }
     } catch (err) {
          hideLoadingOverlay();
          showAlert('error', err.message || 'Something went Wrong');
     }
};

const loginAdmin = async (email, password) => {
     try {
          showLoadingOverlay();

          const res = await fetch('/api/users/login-admin', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ email, password }),
          });
          if (!res.ok) {
               throw new Error('Login request failed, Check internet connection!');
          }

          const data = await res.json();
          
          if (data.data.user.role !== 'admin') {
               hideLoadingOverlay();
               showAlert('error', 'Only admins can log in through this form.');
               return;
          }
          if (data.status === 'success') {
               showAlert('success', 'Authentication Successful');
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
const loginBuyer = async (email, password) => {
     try {
          showLoadingOverlay();

          const res = await fetch('/api/users/login-buyer', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ email, password }),
          });

          const data = await res.json();
          if(data.message === 'Email address not verified, Check your mail' || data.message === 'Account no longer active' || data.message === 'Incorrect email or password!') {{
               hideLoadingOverlay();
               showAlert('error', data.message);
               return;
          }}
          if (!res.ok) {
               throw new Error('Login request failed');
          }
          if (data.data.user.role !== 'buyer') {
               hideLoadingOverlay();
               showAlert('error', 'Only buyers can log in through this form.');
               return;
          }

          if (data.status === 'success') {
               showAlert('success', 'Authentication Successful');
               setTimeout(() => {
                    location.assign('/buyers/dashboard');
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
const signup = async (businessName, email, role, password, passwordConfirm, username, country, phone) => {
    try {
         if(role === 'admin' || role === 'affiliate' || role === 'buyer') return;
         const type = window.location.href.split('/').at(-1);
        showLoadingOverlay();
    
        const res = await fetch('/api/users/signup-vendor', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ businessName, email, role, password, passwordConfirm, username, country, phone, type}),
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


// signup for buyers
const signupBuyer = async (fullName, email, password, passwordConfirm, username) => {
     try {
          showLoadingOverlay();
     
          const res = await fetch('/api/users/signup-buyer', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ fullName, email, password, passwordConfirm, username }),
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
// const verifyEmail = async function (verificationToken) {
//      try {
//        // Retrieve the verification token from the URL
//      //   const urlParams = new URLSearchParams(window.location.search);
//      //   const verificationToken = urlParams.get('token');
   
//        // Make a GET request to the backend verification route
//        const response = await fetch(`/api/users/verify-email/${verificationToken}`);
   
//        if (response.ok) {
//          // Verification successful
//          const confirmationMessage = `
//            <div class="email__drop-down drop-down__shadow">
//              <div class="email-confirmed__modal modal">
//                <i class="fa-solid fa-close close__icon email-confirm__close--icon"></i>
//                <div class="modal__container">
//                  <h3 class="extra__heading">Success!</h3>
//                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0,0,256,256"
//                     style="fill:#737373;">
//                     <g fill="#737373" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(5.12,5.12)"><path d="M25,2c-12.69071,0 -23,10.3093 -23,23c0,12.6907 10.30929,23 23,23c12.69071,0 23,-10.3093 23,-23c0,-12.6907 -10.30929,-23 -23,-23zM25,4c11.60983,0 21,9.39017 21,21c0,11.60983 -9.39017,21 -21,21c-11.60983,0 -21,-9.39017 -21,-21c0,-11.60982 9.39017,-21 21,-21z"></path></g></g>
//                  </svg>
//                  <p class="modal__text">Your email address has been verified successfully!</p>
//                  <a class="form__button proceed__button" href="/login">Proceed to login</a>
//                </div>
//              </div>
//            </div>
//          `;
   
//          // Add the confirmation message to the document body
//          document.body.insertAdjacentHTML('beforeend', confirmationMessage);
// }


// function getVerificationTokenFromURL() {
//      const urlParams = new URLSearchParams(window.location.search);
//      return urlParams.get('token');
// }
// // Check if a verification token exists in the URL
// const verificationToken = getVerificationTokenFromURL();
// if (verificationToken) {
//      verifyEmail(verificationToken);
// }

   

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.querySelector('.login__email').value;
        const password = document.querySelector('.login__password').value;
        login(email, password);
    });
}

if (adminAuthForm) {
    adminAuthForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.querySelector('#admin-email').value;
        const password = document.querySelector('#admin-password').value;
        loginAdmin(email, password);
    });
}
if(buyerAuthForm) {
    buyerAuthForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const email = document.querySelector('#buyer-email').value;
        const password = document.querySelector('#buyer-password').value;
        loginBuyer(email, password);
    });
}
/////////////////////////////////////////////////
/////////////////////////////////////////////////
if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const businessName = document.querySelector('.signup__businessName').value;
        const email = document.querySelector('.signup__email').value;
        const password = document.querySelector('.signup__passwordMain').value;
        const passwordConfirm = document.querySelector('.signup__passwordconfirm').value;
        const username = document.querySelector('.signup__username').value;
        const country = document.querySelector('.signup__country').value;
        const phone = document.querySelector('.signup__phone').value;
        const role = document.querySelector('#role').value;
        signup(businessName, email, role, password, passwordConfirm, username, country, phone);
        console.log(businessName, email, role, password, passwordConfirm, username, country, phone);
    });
}
if (buyerSignupForm) {
    buyerSignupForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const fullName = document.querySelector('.buyer-signup__fullname').value;
        const email = document.querySelector('.buyer-signup__email').value;
        const password = document.querySelector('.buyer-signup__passwordMain').value;
        const passwordConfirm = document.querySelector('.buyer-signup__passwordconfirm').value;
        const username = document.querySelector('.buyer-signup__username').value;
        signupBuyer(fullName, email, password, passwordConfirm, username);
    });
}
