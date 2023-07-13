'use strict';

const uploadBtn = document.querySelector('.add-btn');
const productOverlay = document.querySelector('.product__overlay');
const productModal = document.querySelector('.product__modal');
const productClose = document.querySelector('.form__close-icon');
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


const forgotPassword = document.querySelector('.forgot')
const forgotModal = document.querySelector('.forgot-password__modal');
const forgotClose = document.querySelector('.forgot__close--icon');
const emailVerifyModal = document.querySelector('.email-verify__modal');
const emailVerifyClose = document.querySelector('.email-verify__close--icon');
const emailConfirmModal = document.querySelector('.email-confirmed__modal');
const emailConfirmClose = document.querySelector('.email-confirmed__close--icon');

// const forgotOverlay = document.querySelector('.forgot-password__drop-down');
// const emailVerifyOverlay = document.querySelector('.email__drop-down');


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
    });
    mainDashboard.addEventListener('click', () => notifyBox.classList.add('hidden'))
}

if(profileImg) {
    profileImg.addEventListener('click', (e) => {
        profileBox.classList.toggle('hidden')
    })
    mainDashboard.addEventListener('click', () => profileBox.classList.add('hidden'))
    document.body.addEventListener('click', () => profileBox.classList.add('hidden'))
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

if(productClose) {
    productClose.addEventListener('click', function() {
        closeModal(productOverlay, productModal)
    });
}

if(uploadBtn) {
    uploadBtn.addEventListener('click', function() {
        openModal(productOverlay, productModal);
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


// delete product
const showDeleteModal = function(item) {
    const html = `
      <div class="delete__overlay">
          <div class='delete__modal'>
              <i class="fa-solid fa-close delete__icon"></i>
              <p class="delete__text">
                  Are you sure you want to delete this ${item}?
              </p>
              <div class="delete__action">
                  <button class="delete__button btn-yes">Yes</button>
                  <button class="delete__button btn-no">No</button>
              </div>
          </div>
      </div>
    `;
  
    document.body.insertAdjacentHTML('afterbegin', html);
}

const deleteButton = document.querySelectorAll('.btn-delete');
const closeAdjacentModal = () => {
    const deleteOverlay = document.querySelector('.delete__overlay');
    if (deleteOverlay) {
      deleteOverlay.remove();
    }
  };


if(deleteButton)
    deleteButton.forEach(el => el.addEventListener('click', function(e) {
        const productId = this.dataset.productId; // Get the product ID from the data attribute
        const existingModal = document.querySelector('.delete__overlay');
        if (existingModal) {
            return; // Exit the function if the modal already exists
        }
        showDeleteModal('product');
        console.log(productId)

        document.querySelector('.btn-yes').addEventListener('click', function() {
            // Call the deleteProduct function with the product ID
            deleteProduct(productId);
            location.reload(true)
        })
        document.querySelector('.btn-no').addEventListener('click', () => {
        closeAdjacentModal();
        })
        document.querySelector('.delete__icon').addEventListener('click', () => {
            closeAdjacentModal();
        } )
    }));

// Function to delete the product
async function deleteProduct (productId) {
    // Perform the delete request using the product ID
    try {
        const res = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
        })
            
        const data = await res.json()
        console.log(data);
        
    } catch(error)  {
        console.error(error);
    }
}



/*
// update 
// const updateBtn = document.querySelector('.add-btn');
// const productUploadOverlay = document.querySelector('.product-update__overlay');
// const productUploadModal = document.querySelector('.product-update__modal');
// const productUpdateClose = document.querySelector('.form-update__close-icon');
// const productUploadForm = document.querySelector('.product__form');



if(updateBtn) {
    updateBtn.addEventListener('click', function() {
        openModal(productOverlay, productModal);
        console.log('clicked')
    });
}

if(productUpdateClose) {
    productClose.addEventListener('click', function() {
        closeModal(productOverlay, productModal)
    });
}

const UploadUpdateProduct = async function(name, summary, description, price, commission, type, category, tools, link, recurring) {
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


if(productUploadForm) {
    productUploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.querySelector('#product-update__name').value
        const summary = document.querySelector('#product-update__summary').value
        const description = document.querySelector('#product-update__description').value
        const price = document.querySelector('#product-update__price').value
        const commission = document.querySelector('#product-update__commission').value
        const type = document.querySelector('#product-update__type').value
        const category = document.querySelector('#product-update__category').value
        const tools = document.querySelector('#product-update__tools').value
        const link = document.querySelector('#product-update__link').value
        const recurring = document.querySelector('#product-update__recurring').value
        UploadUpdateProduct(name, summary, description, price, commission, type, category, tools, link, recurring)
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



// const forgotPasswordForm = document.querySelector('.forgot__form');






