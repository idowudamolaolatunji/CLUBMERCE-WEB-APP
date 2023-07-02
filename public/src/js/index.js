const loginFrom = document.querySelector('.login');
const signupForm = document.querySelector('.signup');
const logoutBtn = document.querySelectorAll('#logout');
const spinner = document.querySelector('.spinner-overlay');
const menu = document.querySelector('.menubar-control');
const menuButton = document.querySelector('.menu__button');

const forgotPassword = document.querySelector('.forgot')
const forgotModal = document.querySelector('.forgot-password__modal');
const forgotClose = document.querySelector('.forgot__close--icon');
const emailVerifyModal = document.querySelector('.email-verify__modal');
const emailVerifyClose = document.querySelector('.email-verify__close--icon');
const emailConfirmModal = document.querySelector('.email-confirmed__modal');
const emailConfirmClose = document.querySelector('.email-confirmed__close--icon');

// const forgotOverlay = document.querySelector('.forgot-password__drop-down');
// const emailVerifyOverlay = document.querySelector('.email__drop-down');

console.log('connected');

// const swiper = new Swiper('.swiper', {
//     // Optional parameters
//     direction: 'vertical',
//     loop: true,

//     // If we need pagination
//     pagination: {
//     el: '.swiper-pagination',
//     },

//     // Navigation arrows
//     navigation: {
//     nextEl: '.swiper-button-next',
//     prevEl: '.swiper-button-prev',
//     }
// });

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
        spinner.classList.remove('hidden');
        if(!spinner.classList.contains('hidden')) 
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh'
        
        // we await the response
        const data = await res.json();
        console.log(data, res, data.status);
        
        if (data.status === 'success') {
            window.setTimeout(() => {
                showAlert('success', data.message);
                document.body.style.overflow = 'hidden';
                // if (data.data.user.role === 'affiliate')
                //     location.assign('/affiliate-dashboard');
                // if (data.data.user.role === 'vendor')
                //     location.assign('/vendor-dashboard');
                // if (data.data.user.role === 'admin')
                //     location.assign('/all-perfomance');
                spinner.classList.add('hidden');
                location.assign('/dashboard');
            }, 2000);
            document.body.style.overflow = 'auto';
        } else if(data.status === 'fail') {
            spinner.classList.add('hidden');
            document.body.style.overflow = 'scroll';
            throw new Error(data.message);
        }
    } catch (err) {
        showAlert('error', err.message || 'Something went wrong, Please try again!')
        spinner.classList.add('hidden');
        document.body.style.height = 'auto';
        document.body.style.overflow = 'scroll';
    }
}


const logout = async () => {
    try {
        const res = await fetch('/api/users/logout');
        const data = await res.json();
        console.log(data, res);
        if (data.status ==='success') 
            
            window.location.reload(true);
            location.assign('/login');
    } catch (err) {
        showAlert('alert--error', err)
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
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
        const data = await res.json();

        if(data.status === 'success') {
            showAlert('success', data.data.message)
            window.location.reload(true);
        } else if (data.status === 'fail') {
            spinner.classList.add('hidden');
            document.body.style.overflow = 'scroll';
            throw new Error(data.message);
        }
    } catch (err) {
        showAlert('error', err)
    }
}


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
if(logoutBtn) 
    logoutBtn.forEach(el => el.addEventListener('click', logout));
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


// DROPDOWNS
const notifyIcon = document.querySelector('.notification__icon');
const notifyBox = document.querySelector('.notification__hovered')
notifyIcon.addEventListener('click', () => notifyBox.classList.toggle('hidden'));
document.querySelector('.main__dashboard').addEventListener('click', () => notifyBox.classList.add('hidden'))


const profileImg = document.querySelector('.nav__image')
const profileBox = document.querySelector('.Profile__hovered')
profileImg.addEventListener('click', (e) => profileBox.classList.toggle('hidden'))
document.querySelector('.main__dashboard').addEventListener('click', () => profileBox.classList.add('hidden'))



// ACCORDIONS
const accordionItem = document.querySelector('.faq__accordion--item');
const accordionContentTitle = document.querySelectorAll('.accordion__content--title')
const accordionContent = document.querySelectorAll('.faq__accordion--content');


// accordionItem.addEventListener('click', function(e) {
//     console.log('tar:', e.target, 'currTar:', e.currentTarget)
    
//     const clicked = e.target.closest('.faq__accordion--item');
//     console.log('clicked: ', clicked);
//     if(!clicked) return;

// });


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


// forgotPassword.addEventListener('click', () => openModal( forgotOverlay, forgotModal));
// forgotOverlay.addEventListener('click', () => closeModal(forgotOverlay, forgotModal));
// forgotClose.addEventListener('click', () => closeModal(forgotOverlay, forgotModal));

// emailVerifyOverlay.addEventListener('click', () => closeModal(emailVerifyOverlay, emailVerifyModal));
// emailVerifyClose.addEventListener('click', () => closeModal(emailVerifyOverlay, emailVerifyModal));

// emailVerifyOverlay.addEventListener('click', () => closeModal(emailVerifyOverlay, emailConfirmModal));
// emailConfirmClose.addEventListener('click', () => closeModal(emailVerifyOverlay, emailConfirmModal));

const hoplinkGetOverlay = document.querySelector('.get__overlay')
const hoplinkCopyOverlay = document.querySelector('.copy__overlay')
const hoplinkGetModal = document.querySelector('.get__modal')
const hoplinkCopyModal = document.querySelector('.copy__modal')
const hoplinkOpen = document.querySelectorAll('.promote');
const hoplinkClose = document.querySelector('.hoplink__icon');
const hoplinkCopyOk = document.querySelector('.btnOk');

hoplinkOpen.forEach(el =>
    el.addEventListener('click', () => {
        openModal(hoplinkGetOverlay, hoplinkGetModal) 
        document.body.style.overflow = 'hidden';
    })
);
hoplinkClose.addEventListener('click', () => {
    closeModal(hoplinkGetOverlay, hoplinkGetModal)
    document.body.style.overflowY = 'visible';
})

hoplinkCopyOk.addEventListener('click', () => {
    closeModal(hoplinkCopyOverlay, hoplinkCopyModal)
    document.body.style.overflowY = 'visible';
})




const updateUser = async function(name, email, phone, country, state, cityRegion, zipPostal) {
    try {
        const res = await fetch('/api/users/update', {
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


