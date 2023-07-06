const loginFrom = document.querySelector('.login');
const signupForm = document.querySelector('.signup');
const logoutNav = document.querySelector('#logoutNavBtn');
const logoutMenu = document.querySelector('#logoutMenu');
const logoutMenuBtn = document.querySelector('#logoutMenuBtn');
// const spinner = document.querySelector('.spinner-overlay');
const menu = document.querySelector('.menubar-control');
const menuButton = document.querySelector('.menu__button');

const spinOverlay = document.querySelector('#spinOverlay');
const spin = document.querySelector('.spin');

const forgotPassword = document.querySelector('.forgot')
const forgotModal = document.querySelector('.forgot-password__modal');
const forgotClose = document.querySelector('.forgot__close--icon');
const emailVerifyModal = document.querySelector('.email-verify__modal');
const emailVerifyClose = document.querySelector('.email-verify__close--icon');
const emailConfirmModal = document.querySelector('.email-confirmed__modal');
const emailConfirmClose = document.querySelector('.email-confirmed__close--icon');

const adminAuthForm = document.querySelector('#admin-login');


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

// MODALS
const openModal = function(overlay, modal) {
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');
}
const closeModal = function(overlay, modal) {
    overlay.classList.add('hidden');
    modal.classList.add('hidden');
}


// FORMS functions
const login = async (email, password, role) => {
    try {
        console.log(email, password, role);
        
        const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role }),
        });
        // before the reposne gets back...
        // spinner.classList.remove('hidden');
        spinOverlay.style.visibility = 'visible'
        
        
        // we await the response
        const data = await res.json();
        if(data.data.role === 'admin') {
            return location.assign('/login');
        }
        
        if (data.status === 'success') {
            window.setTimeout(() => {
                showAlert('success', data.message);
                // spinner.classList.add('hidden');
                location.assign('/dashboard');
                spinOverlay.style.visibility = 'hidden'
            }, 2500);
        }
    } catch (err) {
        showAlert('error', err.message || 'Something went wrong, Please try again!')
    }
}


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
        if(!data.data.role === 'admin' ) return;
        
        if (data.status === 'success') {
            window.setTimeout(() => {
                showAlert('success', data.message);
                location.assign('/dashboard');
                spinOverlay.style.visibility = 'hidden'
            }, 2000);
        }
    } catch (err) {
        showAlert('error', err.message || 'Something went wrong, Please try again!')
    }
}

const logout = async () => {
    try {
        const res = await fetch('/api/users/logout');
        const data = await res.json();
        spinOverlay.style.visibility = 'visible'
        if(data.status === 'error' || data.status === 'success')
            showAlert('success', 'Bye for now...');
            location.assign('/login')
            window.location.reload(true)
            spinOverlay.style.visibility = 'hidden'
    } catch (err) {
        return;
    }
}


const signup = async (...body) => {
    try {
        const [fullName, email, password, passwordConfirm, username, country, phone, role] = body
        console.log({fullName, email, password, passwordConfirm, username, country, phone, role});

        const res = await fetch('/api/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({fullName, email, password, passwordConfirm, username, country, phone, role}),
        });
        spinner.classList.remove('hidden');
        if(!spinner.classList.contains('hidden')) 
            spinOverlay.style.visibility = 'visible'
        const data = await res.json();

        if(data.status === 'success') {
            showAlert('success', data.data.message)
            spinOverlay.style.visibility = 'hidden'
            window.location.reload(true);
        } else if (data.status === 'fail') {
            throw new Error(data.message || 'Error signing up');
        }
    } catch (err) {
        showAlert('error', err)
    }
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


// FORMS controllers
if(loginFrom) {
    loginFrom.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.querySelector('.login__email').value;
        const password = document.querySelector('.login__password').value;
        const role = document.querySelector('.login__role').value;
        login(email, password, role);
    });
}
if(adminAuthForm) {
    adminAuthForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.querySelector('#admin-email').value;
        const password = document.querySelector('#admin-password').value;
        adminAuthLogin(email, password);
    });
}
if(logoutNav) logoutNav.addEventListener('click', logout);
if(logoutMenu) logoutMenu.addEventListener('click', logout);
if(logoutMenuBtn) logoutMenuBtn.addEventListener('click', logout);
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


/*
// DROPDOWNS
const notifyIcon = document.querySelector('.notification__icon');
const notifyBox = document.querySelector('.notification__hovered')
const profileImg = document.querySelector('.nav__image')
const profileBox = document.querySelector('.Profile__hovered')

if(notifyIcon)
    notifyIcon.addEventListener('click', () => notifyBox.classList.toggle('hidden'));
    document.querySelector('.main__dashboard').addEventListener('click', () => notifyBox.classList.add('hidden'))

if(notifyIcon)
    profileImg.addEventListener('click', (e) => profileBox.classList.toggle('hidden'))
    document.querySelector('.main__dashboard').addEventListener('click', () => profileBox.classList.add('hidden'))



// ACCORDIONS
const accordionItem = document.querySelector('.faq__accordion--item');
const accordionContentTitle = document.querySelectorAll('.accordion__content--title')
const accordionContent = document.querySelectorAll('.faq__accordion--content');



// MENUS
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
}


const mainDashboard = document.querySelector('.main__dashboard')
const dashboradWidth = mainDashboard.getBoundingClientRect();

if(dashboradWidth.right <= 950) {
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
*/

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


if(hoplinkForm)
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

// document.querySeletor('a').addEventListener('click', () => spinOverlay.style.visibility = 'visible')