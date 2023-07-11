'use strict';

const uploadBtn = document.querySelector('.add-btn');
const productOverlay = document.querySelector('.product__overlay');
const productModal = document.querySelector('.product__modal');
const productClose = document.querySelector('.form__close');
const productForm = document.querySelector('.product__form');

// DROPDOWNS
const notifyIcon = document.querySelector('.notification__icon');
const notifyBox = document.querySelector('.notification__hovered')
const profileImg = document.querySelector('.nav__image')
const profileBox = document.querySelector('.Profile__hovered')


// MENUS
const menu = document.querySelector('.menubar-control');
const menuButton = document.querySelector('.menu__button');
const mainDashboard = document.querySelector('.main__dashboard')
const dashboradWidth = mainDashboard.getBoundingClientRect();

const menuLogout = document.querySelectorAll('.menu__logout');
const navLogout = document.querySelectorAll('.nav__logout');
const adminLogout = document.querySelectorAll('.admin__menu--logout');


// MODALS
const openModal = function(overlay, modal) {
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');
}
const closeModal = function(overlay, modal) {
    overlay.classList.add('hidden');
    modal.classList.add('hidden');
}


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
        // console.log(e.target.classList)
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
            // console.log(e.target.classList)
            menuButton.classList.toggle('hidden');
        });
    }
}


if(notifyIcon) {
    notifyIcon.addEventListener('click', () => {
        notifyBox.classList.remove('hidden')
        console.log('Clicked notification')
    });
    mainDashboard.addEventListener('click', () => notifyBox.classList.add('hidden'))
}

if(profileImg) {
    profileImg.addEventListener('click', (e) => {
        profileBox.classList.remove('hidden')
        console.log('Clicked profile image')
    })
    mainDashboard.addEventListener('click', () => profileBox.classList.add('hidden'))
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
if(menuLogout) menuLogout.forEach(el => el.addEventListener('click', logout));
if(navLogout) navLogout.forEach(el => el.addEventListener('click', logout));
if(adminLogout) adminLogout.forEach(el => el.addEventListener('click', logout));



if(uploadBtn) {
    uploadBtn.addEventListener('click', function() {
        openModal(productOverlay, productModal);
        console.log('clicked')
    });
}

if(productClose) {
    productClose.addEventListener('click', function() {
        closeModal(productOverlay, productModal)
    });
}

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

if(productForm) {
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
}


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





// forgotPassword.addEventListener('click', () => openModal( forgotOverlay, forgotModal));
// forgotOverlay.addEventListener('click', () => closeModal(forgotOverlay, forgotModal));
// forgotClose.addEventListener('click', () => closeModal(forgotOverlay, forgotModal));

// emailVerifyOverlay.addEventListener('click', () => closeModal(emailVerifyOverlay, emailVerifyModal));
// emailVerifyClose.addEventListener('click', () => closeModal(emailVerifyOverlay, emailVerifyModal));

// emailVerifyOverlay.addEventListener('click', () => closeModal(emailVerifyOverlay, emailConfirmModal));
// emailConfirmClose.addEventListener('click', () => closeModal(emailVerifyOverlay, emailConfirmModal));



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