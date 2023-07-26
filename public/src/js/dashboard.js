

// DROPDOWNS
const notifyIcon = document.querySelector('.notification__icon');
const notifyBox = document.querySelector('.notification__hovered')
const profileImg = document.querySelector('.nav__image')
const profileBox = document.querySelector('.Profile__hovered')


// MENUS
const menu = document.querySelector('.menubar-control');
const menuButton = document.querySelector('.menu__button');
const mainDashboard = document.querySelector('.main__dashboard')
const sectionBottom = document.querySelector('.section__bottom');
const dashboradWidth = mainDashboard.getBoundingClientRect();

const menuLogout = document.querySelectorAll('.menu__logout');
const navLogout = document.querySelectorAll('.nav__logout');
const adminLogout = document.querySelectorAll('.admin__menu--logout');
const spinOverlay = document.querySelector('#spinOverlay');


const showLoadingOverlay = () => {
    spinOverlay.style.visibility = 'visible';
};

const hideLoadingOverlay = () => {
    spinOverlay.style.visibility = 'hidden';
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
    menu.addEventListener('click', function(event) {
        sectionBottom.classList.toggle('close');
        menuButton.classList.toggle('hidden');

        if (event.target.classList.contains('fa-close')) {
            event.target.classList.remove('fa-close');
            event.target.classList.add('fa-bars');
        } else {
            event.target.classList.add('fa-close');
            event.target.classList.remove('fa-bars');
        }
    });

    const dashboardWidth = {
        right: window.innerWidth
    };

    if (dashboardWidth.right <= 950) {
        menu.classList.remove('fa-close');
        menu.classList.add('fa-bars');
        menu.addEventListener('click', function(event) {
            sectionBottom.classList.toggle('open');
            menuButton.classList.toggle('hidden');

            if (event.target.classList.contains('fa-bars')) {
                event.target.classList.remove('fa-bars');
                event.target.classList.add('fa-close');
            } else {
                event.target.classList.add('fa-bars');
                event.target.classList.remove('fa-close');
            }
        });
    }
}

// notification and profile dropdown
if (notifyIcon) {
    notifyIcon.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click event from propagating to the mainDashboard
        notifyBox.classList.toggle('hidden');
    });

    mainDashboard.addEventListener('click', () => {
        notifyBox.classList.add('hidden');
    });
}

if (profileImg) {
    profileImg.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click event from propagating to the mainDashboard and body
        profileBox.classList.toggle('hidden');
    });

    mainDashboard.addEventListener('click', () => {
        profileBox.classList.add('hidden');
    });

    document.body.addEventListener('click', () => {
        profileBox.classList.add('hidden');
    });
}


//  logout functionality
const logout = async function() {
    try {
        const token = getCookie('jwt'); // Retrieve the token from the cookie
        console.log(token)
        if (!token) {
            throw new Error('Token not found in the cookie');
        }

        const response = await fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Include the token in the request headers
            }
        });

        if (response.ok) {
            window.location.href = '/login';
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Logout failed');
        }
    } catch (err) {
        console.error(err);
        showAlert('error', err.message || 'Logout failed'); // Display an error message to the user
    }
}

// if(menuLogout) menuLogout.addEventListener('click', logout);
// if(navLogout) navLogout.addEventListener('click', logout);
// if(adminLogout) adminLogout.addEventListener('click', logout);


// Function to retrieve the value of a specific cookie
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(`${name}=`)) {
            return cookie.substring(name.length + 1); // Extract the value of the cookie
        }
    }
    return null; // Cookie not found
}


// Delete functionality
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

const adminProductDelete = document.querySelectorAll('.admin-product-delete');
const adminUserDelete = document.querySelectorAll('.admin-user-delete');
const vendorProductDelete = document.querySelectorAll('.product-delete');
const closeAdjacentModal = () => {
    const deleteOverlay = document.querySelector('.delete__overlay');
    if (deleteOverlay) {
      deleteOverlay.remove();
    }
};

// Function to delete the product
const deleteProduct = async function(productId) {
    // Perform the delete request using the product ID
    try {
        showLoadingOverlay();
        const res = await fetch(`/api/products/${productId}`, {
            method: 'DELETE',
        });

        if(!res.ok) {
            hideLoadingOverlay()
            return;
        }

        const data = await res.json();
        console.log(data);

        if (data.status === 'success') {
            window.setTimeout(() => {
                showAlert('success', 'Product Deleted Successfully..');
                location.reload(true)
                hideLoadingOverlay()
            }, 1500);
        }
    } catch (error) {
        console.error(error);
        hideLoadingOverlay()
    }
}
// Function to delete the product
const userDelete = async function(userId) {
    // Perform the delete request using the product ID
    try {
        showLoadingOverlay();
        const res = await fetch(`/api/users/${userId}`, {
            method: 'DELETE',
        });

        if(!res.ok) {
            hideLoadingOverlay()
            return;
        }

        const data = await res.json();
        console.log(data);

        if (data.status === 'success') {
            window.setTimeout(() => {
                showAlert('success', 'User Deleted Successfully..');
                location.reload(true)
                hideLoadingOverlay()
            }, 1500);
        }
    } catch (error) {
        hideLoadingOverlay();
        console.error(error);
    }
}


if(adminProductDelete) {
    adminProductDelete.forEach(el => el.addEventListener('click', function(e) {
        const existingModal = document.querySelector('.delete__overlay');
        const productId = el.dataset.id;
        if (existingModal) {
            return; 
        }
        showDeleteModal('product');
        console.log(productId)

        document.querySelector('.btn-yes').addEventListener('click', function() {
            deleteProduct(productId);
        })
        document.querySelector('.btn-no').addEventListener('click', () => {
            closeAdjacentModal();
        })
        document.querySelector('.delete__icon').addEventListener('click', () => {
            closeAdjacentModal();
        } )
    }));
}

if(adminUserDelete) {
    adminUserDelete.forEach(el => el.addEventListener('click', function(e) {
        const userId = el.dataset.id;
        const existingModal = document.querySelector('.delete__overlay');
        if (existingModal) {
            return; 
        }
        showDeleteModal('user');
        console.log(userId)

        document.querySelector('.btn-yes').addEventListener('click', function() {
            userDelete(userId);
        })
        document.querySelector('.btn-no').addEventListener('click', () => {
            closeAdjacentModal();
        })
        document.querySelector('.delete__icon').addEventListener('click', () => {
            closeAdjacentModal();
        } )
    }));
}

if(vendorProductDelete) {
    vendorProductDelete.forEach(el => el.addEventListener('click', function(e) {
        const productId = el.dataset.id;
        console.log(el, el.dataset)
        const existingModal = document.querySelector('.delete__overlay');
        if (existingModal) {
            return; 
        }
        showDeleteModal('product');
        console.log(productId)

        document.querySelector('.btn-yes').addEventListener('click', function() {
            deleteProduct(productId);
        })
        document.querySelector('.btn-no').addEventListener('click', () => {
            closeAdjacentModal();
        })
        document.querySelector('.delete__icon').addEventListener('click', () => {
            closeAdjacentModal();
        })
    }));
}



// update functionality

const productUpdateAdminForm = document.querySelector('.product__form-admin-update');
const productUpdateForm = document.querySelector('.product__form-update');
const productCreate = document.querySelector('.product-create')
const productEdit = document.querySelectorAll('.product-edit');
const productAdminEdit = document.querySelectorAll('.admin-product-edit');

const productUploadOverlay = document.querySelector('.product-update__overlay');
const productUploadModal = document.querySelector('.product-update__modal');

const productOverlay = document.querySelector('.product__overlay');
const productModal = document.querySelector('.product__modal');
const productOverlayClose = document.querySelector('.form__close-icon');
const productForm = document.querySelector('.product__form');



// Create product
if(productOverlayClose) {
    productOverlayClose.addEventListener('click', function() {
        closeModal(productOverlay, productModal)
    });
}

if(productCreate) {
    productCreate.addEventListener('click', function(e) {
        console.log('i want to create a product')
        openModal(productOverlay, productModal)
    })
}
const uploadProduct = async function(name, summary, description, price, commission, type, category, tools, link, recurring) {
    try {
        showLoadingOverlay()
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, summary, description, price, commission, type, category, tools, link, recurring }),
        });

        if (!res.ok) {
            hideLoadingOverlay()
            throw new Error('Product upload failed');
        }

        const data = await res.json();
        console.log(res, data);
        
        if(data) hideLoadingOverlay()

    } catch (err) {
        console.log(err);
        hideLoadingOverlay()
    }
};

if (productForm) {
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.querySelector('#product__name').value;
        const summary = document.querySelector('#product__summary').value;
        const description = document.querySelector('#product__description').value;
        const price = document.querySelector('#product__price').value;
        const commission = document.querySelector('#product__commission').value;
        const type = document.querySelector('#product__type').value;
        const category = document.querySelector('#product__category').value;
        const tools = document.querySelector('#product__tools').value;
        const link = document.querySelector('#product__link').value;
        const recurring = document.querySelector('#product__recurring').value;

        uploadProduct(name, summary, description, price, commission, type, category, tools, link, recurring);
    });
}


if(productAdminEdit) {
    productAdminEdit.forEach(el => el.addEventListener('click', function() {
        openModal(productUploadOverlay, productUploadModal);
        console.log('I was clicked by an admin')
    }));
}
if(productEdit) {
    productEdit.forEach(el => el.addEventListener('click', function() {
        openModal(productUploadOverlay, productUploadModal);
        console.log('I was clicked by this vendor')
    }));
}

if(productOverlayClose) {
    productOverlayClose.addEventListener('click', function() {
        closeModal(productOverlay, productModal);
        closeModal(productUploadOverlay, productUploadModal)
    });
}

const updateProduct = async function(name, summary, description, price, commission, type, category, tools, link, recurring) {
    try {
        showLoadingOverlay();
        const res = await fetch(`/api/products/${productId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({name, summary, description, price, commission, type, category, tools, link, recurring}),
        });
        const data = await res.json();
        hideLoadingOverlay()
        console.log(res, data);
        
        if(data.status === 'success') {
            window.setTimeout(() => {
                hideLoadingOverlay()
                showAlert('success', data.message);
                location.reload(true)
            }, 1500);
        }
    } catch(err) {
        showAlert('error', data.message);
        hideLoadingOverlay()
    }
}


if(productUpdateAdminForm) {
    productUpdateAdminForm.addEventListener('submit', function(e) {
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
        updateProduct(name, summary, description, price, commission, type, category, tools, link, recurring)
    });
}

if(productUpdateForm) {
    productUpdateForm.addEventListener('submit', function(e) {
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
        updateProduct(name, summary, description, price, commission, type, category, tools, link, recurring)
    });
}





const updateUser = async function(name, email, phone, country, state, cityRegion, zipPostal) {
    try {
        showLoadingOverlay();
        const res = await fetch('/api/users/updateMe', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name, email, phone, country, state, cityRegion, zipPostal,
            }),
        });

        const data = await res.json();
        hideLoadingOverlay()
        console.log(res, data);

        if (data.status === 'success') {
            window.setTimeout(() => {
                hideLoadingOverlay()
                showAlert('success', data.message);
                location.reload(true);
            }, 1500);
        }

    } catch(err) {
        showAlert('error', data.message)
        hideLoadingOverlay()
    }
}

// const userFormUpdate = document.querySelector('.form-profile-data');
// if(userFormUpdate) {
//     userFormUpdate.addEventListener('submit', function(e) {
//         e.preventDefault();
//         const formUpdateName = document.querySelector('#fullName').value
//         const formUpdateEmail = document.querySelector('#email').value
//         const formUpdatePhone = document.querySelector('#phone').value
//         const formUpdateCountry = document.querySelector('#country').value
//         const formUpdateState = document.querySelector('#state').value
//         const formUpdateCityRegion = document.querySelector('#city-region').value
//         const formUpdateZipPostal = document.querySelector('#zip-postal').value
//         updateUser(formUpdateName, formUpdateEmail, formUpdatePhone, formUpdateCountry, formUpdateState, formUpdateCityRegion, formUpdateZipPostal);
//     });
// }


