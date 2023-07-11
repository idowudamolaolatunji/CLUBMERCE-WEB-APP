const loginFrom = document.querySelector('.login');
const signupForm = document.querySelector('.signup');
const adminAuthForm = document.querySelector('#admin-login');
const spinOverlay = document.querySelector('#spinOverlay');


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

// Function to display the email verification modal
// const showEmailVerificationModal = (email) => {
//     // const modalContainer = document.querySelector('.email-verify__modal');
//     const modalContainer = document.querySelector('.email__drop-down');
//     const emailSpan = modalContainer.querySelector('.user__email');
//     emailSpan.textContent = email;
//     modalContainer.classList.remove('hidden');
// };

// // Function to close the email verification modal
// const closeEmailVerificationModal = () => {
//     const modalContainer = document.querySelector('.email__drop-down');
//     modalContainer.classList.add('hidden');
// };

// // Event listener for close button in the email verification modal
// const closeButton = document.querySelector('.verify__close--icon');
// if(closeButton) {
//     closeButton.addEventListener('click', closeEmailVerificationModal);
// }


// FORMS functions
const login = async (email, password, role) => {
    try {
        const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role }),
        });
        spinOverlay.style.visibility = 'visible';

        if (!res.ok) {
            throw new Error('Login request failed');
        }
    
        const data = await res.json();
        console.log(res, data)
    
        if (data.data.role === 'admin') {
            showAlert('error', 'Admins cannot log in through this form.');
            spinOverlay.style.visibility = 'hidden';
            return;
        }
    
        if (data.status === 'success') {
            window.setTimeout(() => {
                // Redirect immediately after displaying success message
                location.assign('/dashboard');
                spinOverlay.style.visibility = 'hidden'
            }, 3000);
            showAlert('success', data.message);
            
        } else if(data.status === 'fail') {
            spinOverlay.style.visibility = 'hidden';
            console.log(res)
            throw new Error(data.message || 'Login failed');
        }
    } catch (err) {
        spinOverlay.style.visibility = 'hidden';
        showAlert('error', err.message || 'Something went wrong, please try again!');
    }
};


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


const signup = async (...body) => {
    try {
        const [fullName, email, password, passwordConfirm, username, country, phone, role] = body
        // console.log({fullName, email, password, passwordConfirm, username, country, phone, role});

        const res = await fetch('/api/users/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({fullName, email, password, passwordConfirm, username, country, phone, role}),
        });
        spinOverlay.style.visibility = 'visible'

        if(!res.ok) {
            showAlert('error', 'Either user already exist or wrong credentials');
            spinOverlay.style.visibility = 'hidden';
            // return location.reload(true);
        }

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
        console.log(err)
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

if(adminAuthForm) {
    adminAuthForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.querySelector('#admin-email').value;
        const password = document.querySelector('#admin-password').value;
        adminAuthLogin(email, password);
    });
}


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