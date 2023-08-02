// DROPDOWNS
const notifyIcon = document.querySelector('.notification__icon');
const notifyBox = document.querySelector('.notification__hovered')
const profileBox = document.querySelector('.Profile__hovered')
const profileImg = document.querySelector('.nav__image')


// MENUS
const menu = document.querySelector('.menubar-control');
const menuButton = document.querySelector('.menu__button');
const mainDashboard = document.querySelector('.main__dashboard')
const sectionBottom = document.querySelector('.section__bottom');
const dashboradWidth = mainDashboard.getBoundingClientRect();

const spinOverlay = document.querySelector('#spinOverlay');

const showLoadingOverlay = () => {
    spinOverlay.style.visibility = 'visible';
};
const hideLoadingOverlay = () => {
    spinOverlay.style.visibility = 'hidden';
};

// document.addEventListener("DOMContentLoaded", function() {
//     showLoadingOverlay();
// });
// window.addEventListener("load", function() {
//     hideLoadingOverlay()
// });

document.querySelectorAll('a').forEach(el => el.addEventListener('click', function(e) {
    showLoadingOverlay();
}));


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

const imageInput = document.getElementById('uploader__image--input');
const imagePreview = document.getElementById('uploader__image');

// Event listener for file input change
if(imageInput) {
    imageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
    
        // Check if a file was selected
        if (file) {
            // Create a temporary URL for the selected image
            const imageUrl = URL.createObjectURL(file);
            
            // Update the image 'src' attribute with the temporary URL
            imagePreview.src = imageUrl;
        }
    });
}


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


const menuLogout = document.querySelector('.menu__logout');
const navLogout = document.querySelector('.nav__logout');
const adminLogout = document.querySelector('.admin__menu--logout');
const buyerLogout = document.querySelector('.buyer__menu--logout');

const logoutUser = async function() {
    try {
        showLoadingOverlay();

        const res = await fetch('/apl/users/logout');
        if(!res.ok) {
            hideLoadingOverlay();
            return;
        }

        const data = await res.json();
        consle.log(data)


    } catch(err) {
        console.log(err)
    }
}

if(adminLogout) {
    adminLogout.addEventListener('click', function(e) {
        logoutUser();
    })
}
if(buyerLogout) {
    buyerLogout.addEventListener('click', function(e) {
        logoutUser();
    })
}

if(menuLogout) {
    menuLogout.addEventListener('click', function(e) {
        logoutUser();
    })
}
if(navLogout) {
    navLogout.addEventListener('click', function(e) {
        logoutUser();
    })
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



// upload functionality

const productUpdateAdminForm = document.querySelector('.product__form-admin-update');
const productUpdateForm = document.querySelector('.product__form-update');
const productCreate = document.querySelector('.product-create')
const productEdit = document.querySelectorAll('.product-edit');
const productAdminEdit = document.querySelectorAll('.admin-product-edit');

const productUpdateOverlay = document.querySelector('.product-update__overlay');
const productUpdateModal = document.querySelector('.product-update__modal');

const productOverlay = document.querySelector('.product__overlay');
const productModal = document.querySelector('.product__modal');
const productOverlayClose = document.querySelector('.form__close-icon');
const productForm = document.querySelector('.product__form');

const closeUploadModal = () => {
    const productOverlay = document.querySelector('.product__overlay');
    if (productOverlay) {
      productOverlay.remove();
    }
};
const closeUpdateModal = () => {
    const productUpdateOverlay = document.querySelector('.product-update__overlay');
    if (productUpdateOverlay) {
      productUpdateOverlay.remove();
    }
};


// Upload functionality
const showUploadModal = function() {
    const html = `
        <div class="product__overlay">
            <div class="product__modal">
                <i class="fa-solid fa-close icon form__close-icon"></i>
                <h3 class="dashboard__heading">Add new product</h3>
                <form class="product__form">

                    <div class="form__body-generic">
                        <div id="uploader__image--card">
                            <img id="uploader__image" src="/asset/img/avatar.png" alt="" />
                            <div id="uploader__image--label-box">
                                <input name="photo" id="uploader__image--input" type="file" accept="image/png, image/jpeg">
                                <label id="uploader__image--label" for="uploader__image--input"><i class="fa-solid fa-camera"></i> Add photo</label>
                            </div>
                        </div>
                    </div>

                    <div class="form__body-generic">
                        <label class="form__label" for="product__name">Product Name</label>
                        <input class="form__input" id="product__name" type="text" name="product__name" required="" placeholder="Product name"/>
                    </div>
                    <div class="form__body-generic">
                        <label class="form__label" for="product__summary">Product Summary</label>
                        <textarea class="form__input" id="product__summary" style="height: 6rem;" type="text" name="product__summary" required="" placeholder="Product Summary (not more than 120 characters)"></textarea>
                    </div>
                    <div class="form__body-generic">
                        <label class="form__label" for="product__description">Product Description</label>
                        <textarea class="form__input" id="product__description" style="height: 15rem;" type="text" name="product__description" required="" placeholder="Product Description"></textarea>
                    </div>
                    <div class="form__grid-generic">
                        <div class="form__body-generic">
                            <label class="form__label" for="product__price">Product Price</label>
                            <input class="form__input" id="product__price" type="text" name="product__price" required="" placeholder="Product price (NGN)"/>
                        </div>
                        <div class="form__body-generic">
                            <label class="form__label" for="product__commission">Product Commission</label>
                            <input class="form__input" id="product__commission" type="text" name="product__commission" required="" placeholder="Product Commission in (%)"/>
                        </div>
                    </div>
                    <div class="form__grid3-generic">
                        <div class="form__body-generic">
                            <label class="form__label" for="product__type">Product Type</label>
                            <select class="form__select" id="product__type" name="product__type">
                                <option value="physical">Physical Product</option>
                                <option value="digital">Digital Product</option>
                            </select>
                        </div>
                        <div class="form__body-generic">
                            <label class="form__label" for="product__category">Product Category</label>
                            <select class="form__select" id="product__category" name="product__category">
                                <option value="physical">All categories</option>
                                <option class="category__item" data-item="all">All </option>
                                <option class="category__item" data-item="arts">Arts</option>
                                <option class="category__item" data-item="betting">Betting</option>
                                <option class="category__item" data-item="books">Books</option>
                                <option class="category__item" data-item="business">Business</option>
                                <option class="category__item" data-item="computers">Computers</option>
                                <option class="category__item" data-item="cooking">Cooking</option>
                                <option class="category__item" data-item="e-Business-and-e-Marketing">E-Business and E-Marketing</option>
                                <option class="category__item" data-item="education">Education</option>
                                <option class="category__item" data-item="entertainment">Entertainment</option>
                                <option class="category__item" data-item="food-and-Wine">Food and Wine</option>
                                <option class="category__item" data-item="games">Games</option>
                                <option class="category__item" data-item="green-products">Green Products</option>
                                <option class="category__item" data-item="health-and-fitness">Health and Fitness</option>
                                <option class="category__item" data-item="home-and-garden">Home and Garden</option>
                                <option class="category__item" data-item="internet">Internet</option>
                                <option class="category__item" data-item="investing">Investing</option>
                                <option class="category__item" data-item="jobs">Jobs</option>
                                <option class="category__item" data-item="languages">Languages</option>
                                <option class="category__item" data-item="reciepe">Reciepe</option>
                                <option class="category__item" data-item="parenting-and-Families">Parenting and Families</option>
                                <option class="category__item" data-item="self-Help">Self-Help</option>
                                <option class="category__item" data-item="spirituality">Spirituality</option>
                                <option class="category__item" data-item="sports">Sports</option>
                            </select>
                        </div>

                        <div class="form__body-generic">
                            <label class="form__label" for="product__recurring">Recurring Commissions</label>
                            <select class="form__select" id="product-update__recurring" name="product__type">
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>
                    </div>

                    <div class="product__sub-images">
                        <p class="form__label photo-head">Product sub images (Max of 6) upload</p>
                        <div class="sub-images">
                            <img class="sub-image sub-image1" src="asset/img/product-default.png" alt="product sub image"/>
                            <img class="sub-image sub-image2" src="asset/img/product-default.png" alt="product sub image"/>
                            <img class="sub-image sub-image3" src="asset/img/product-default.png" alt="product sub image"/>
                            <img class="sub-image sub-image4" src="asset/img/product-default.png" alt="product sub image"/>
                            <img class="sub-image sub-image5" src="asset/img/product-default.png" alt="product sub image"/>
                            <img class="sub-image sub-image6" src="asset/img/product-default.png" alt="product sub image"/>
                        </div>
                        <input class="btn-upload btn__image-upload" type="file" accept="image/*" id="image" name="image" multiple max="6" />

                    </div>

                    <div class="product__banners">
                        <p class="form__label photo-head">Product banner (Max of 4) upload</p>
                        <div class="banners">
                            <img class="banner banner1" src="asset/img/product-default.png" alt="product sub image"/>
                            <img class="banner banner2" src="asset/img/product-default.png" alt="product sub image"/>
                            <img class="banner banner3" src="asset/img/product-default.png" alt="product sub image"/>
                            <img class="banner banner4" src="asset/img/product-default.png" alt="product sub image"/>
                        </div>

                        <input class="btn-upload btn__banner-upload" type="file" accept="image/*" id="banner" name="image" multiple max="4" />
                        
                    </div>
                        <button class="btn form__submit form__submit-generic" type="submit">Add product
                        </button>
                </form>
            </div>
        </div>
    `;
  
    document.body.insertAdjacentHTML('afterbegin', html);
}
// ${product.banners.forEach(img => `<img class="banner banner1" src="asset/img/${img}" alt="product sub image"/>`)}


// update markup
const showUpdateModal = (productName) => {
    const html = `
        <div class="product-update__overlay">
            <div class="product-update__modal">
                <i class="fa-solid fa-close icon form__close-icon"></i>
                <h3 class="dashboard__heading">Update ${productName}</h3>
                <form class="product__form">

                    <div class="form__body-generic">
                        <div id="uploader__image--card">
                            <img id="uploader__image" src="/asset/img/avatar.png" alt="" />
                            <div id="uploader__image--label-box">
                                <input name="photo" id="uploader__image--input" type="file" accept="image/png, image/jpeg">
                                <label id="uploader__image--label" for="uploader__image--input"><i class="fa-solid fa-camera"></i> Add photo</label>
                            </div>
                        </div>
                    </div>
                    <div class="form__body-generic">
                        <label class="form__label" for="product__name">Product Name</label>
                        <input class="form__input" id="product-update__name" value='${productName}' type="text" name="product__name" required="" placeholder="Product name"/>
                    </div>
                    <div class="form__body-generic">
                        <label class="form__label" for="product__summary">Product Summary</label>
                        <textarea class="form__input" id="product-update__summary" style="height: 6rem;" type="text" name="product__summary" required="" placeholder="Product Summary (not more than 120 characters)"></textarea>
                    </div>
                    <div class="form__body-generic">
                        <label class="form__label" for="product__description">Product Description</label>
                        <textarea class="form__input" id="product-update__description" style="height: 15rem;" type="text" name="product__description" required="" placeholder="Product Description"></textarea>
                    </div>
                    <div class="form__grid-generic">
                        <div class="form__body-generic">
                            <label class="form__label" for="product__price">Product Price</label>
                            <input class="form__input" id="product-update__price" type="text" name="product__price" required="" placeholder="Product price (NGN)"/>
                        </div>
                        <div class="form__body-generic">
                            <label class="form__label" for="product__commission">Product Commission</label>
                            <input class="form__input" id="product-update__commission" type="text" name="product__commission" required="" placeholder="Product Commission in (%)"/>
                        </div>
                    </div>
                    <div class="form__grid3-generic">
                        <div class="form__body-generic">
                            <label class="form__label" for="product__type">Product Type</label>
                            <select class="form__select" id="product-update__type" name="product__type">
                                <option value="physical">Physical Product</option>
                                <option value="digital">Digital Product</option>
                            </select>
                        </div>
                        <div class="form__body-generic">
                            <label class="form__label" for="product__category">Product Category</label>
                            <select class="form__select" id="product-update__category" name="product__category">
                                <option value="physical">All categories</option>
                                <option class="category__item" data-item="all">All </option>
                                <option class="category__item" data-item="arts">Arts</option>
                                <option class="category__item" data-item="betting">Betting</option>
                                <option class="category__item" data-item="books">Books</option>
                                <option class="category__item" data-item="business">Business</option>
                                <option class="category__item" data-item="computers">Computers</option>
                                <option class="category__item" data-item="cooking">Cooking</option>
                                <option class="category__item" data-item="e-Business-and-e-Marketing">E-Business and E-Marketing</option>
                                <option class="category__item" data-item="education">Education</option>
                                <option class="category__item" data-item="entertainment">Entertainment</option>
                                <option class="category__item" data-item="food-and-Wine">Food and Wine</option>
                                <option class="category__item" data-item="games">Games</option>
                                <option class="category__item" data-item="green-products">Green Products</option>
                                <option class="category__item" data-item="health-and-fitness">Health and Fitness</option>
                                <option class="category__item" data-item="home-and-garden">Home and Garden</option>
                                <option class="category__item" data-item="internet">Internet</option>
                                <option class="category__item" data-item="investing">Investing</option>
                                <option class="category__item" data-item="jobs">Jobs</option>
                                <option class="category__item" data-item="languages">Languages</option>
                                <option class="category__item" data-item="reciepe">Reciepe</option>
                                <option class="category__item" data-item="parenting-and-Families">Parenting and Families</option>
                                <option class="category__item" data-item="self-Help">Self-Help</option>
                                <option class="category__item" data-item="spirituality">Spirituality</option>
                                <option class="category__item" data-item="sports">Sports</option>
                            </select>
                        </div>
                        <div class="form__body-generic">
                            <label class="form__label" for="product__recurring">Recurring Commissions</label>
                            <input class="form__input" id="product-update__recurring" type="checkbox" name="product__recurring"/>
                            <select class="form__select" id="product-update__recurring" name="product__type">
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="product__sub-images">
                        <p class="form__label photo-head">Product sub images (Max of 6) upload</p>
                        <div class="sub-images">
                            <img class="sub-image sub-image1" src="asset/img/product-default.png" alt="product sub image"/>
                            <img class="sub-image sub-image2" src="asset/img/product-default.png" alt="product sub image"/>
                            <img class="sub-image sub-image3" src="asset/img/product-default.png" alt="product sub image"/>
                            <img class="sub-image sub-image4" src="asset/img/product-default.png" alt="product sub image"/>
                            <img class="sub-image sub-image5" src="asset/img/product-default.png" alt="product sub image"/>
                            <img class="sub-image sub-image6" src="asset/img/product-default.png" alt="product sub image"/>
                        </div>
                        <input class="btn-upload btn__image-upload" type="file" accept="image/*" id="image" name="image" multiple max="6" />

                    </div>

                    <div class="product__banners">
                        <p class="form__label photo-head">Product banner (Max of 4) upload</p>
                        <div class="banners">
                            <img class="banner banner1" src="asset/img/product-default.png" alt="product sub image"/>
                            <img class="banner banner2" src="asset/img/product-default.png" alt="product sub image"/>
                            <img class="banner banner3" src="asset/img/product-default.png" alt="product sub image"/>
                            <img class="banner banner4" src="asset/img/product-default.png" alt="product sub image"/>
                        </div>

                        <input class="btn-upload btn__banner-upload" type="file" accept="image/*" id="banner" name="image" multiple max="4" />
                        
                    </div>
                    <button class="btn form__submit form__submit-generic" type="submit">Add product
                    </button>
                </form>
            </div>
        </div>
    
    `;
    document.body.insertAdjacentHTML('afterbegin', html);
}

const fileInputImage = document.getElementById('image');
const fileInputBanner = document.getElementById('banner');
const banners = document.querySelectorAll('.banners');
const images = document.querySelectorAll('.images');

//  fileInput.addEventListener('change', handleFileUpload);
if(fileInputImage)
    fileInputImage.addEventListener('change', function(e) {
        // handleFileUpload(e, 'img', images, 6);
        handleFileUpload(e, images, 6);
        
    });
if(fileInputBanner)
    fileInputBanner.addEventListener('change', function(e) {
        handleFileUpload(e, banners, 4);
    });

function handleFileUpload(event, constant, amount) {
    // Reset the src attributes of all images
    constant.forEach((sub) => {
        sub.src = '';
    });

    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        if (i >= amount) break; // Ensure we only display up to amount images

        const file = files[i];
        const reader = new FileReader();

        reader.onload = function (e) {
        constant[i].src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
}

// Create product
if(productCreate) {
    productCreate.addEventListener('click', function(e) {
        const existingModal = document.querySelector('.product__overlay');
        if (existingModal) {
            return; 
        }
        showUploadModal();

        document.querySelector('.form__close-icon').addEventListener('click', function(e) {
            closeUploadModal();
        })
    })
}

let editingProductId;
if(productAdminEdit) {
    productAdminEdit.forEach(el => el.addEventListener('click', function() {
        const productName = el.dataset.product;
        const editingProductId = el.dataset.id;
        const existingModal = document.querySelector('.product-update__overlay');
        if (existingModal) {
            return; 
        }
        showUpdateModal(productName);

        document.querySelector('.form__close-icon').addEventListener('click', function(e) {
            closeUpdateModal();
        })
    }));
}
if(productEdit) {
    productEdit.forEach(el => el.addEventListener('click', function() {
        const productName = el.dataset.product;
        const editingProductId = el.dataset.id;
        console.log(productName, editingProductId);
        const existingModal = document.querySelector('.product-update__overlay');
        if (existingModal) {
            return; 
        }
        showUpdateModal(productName);

        document.querySelector('.form__close-icon').addEventListener('click', function(e) {
            closeUpdateModal();
        })
    }));
}


// const uploadProduct = async function(name, summary, description, price, commission, type, category, tools, link, recurring) {
const postProduct = async function(formData, type) {
    try {
        let url, method;
        if(type === 'create') {
            url = '/api/products';
            method = 'POST'
        }
        if(type === 'update') {
            url = `/api/products/${editingProductId}`;
            method = 'PATCH'
        }
        showLoadingOverlay()
        const res = await fetch('/api/products', {
            method: 'POST',
            // headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify({ name, summary, description, price, commission, type, category, tools, link, recurring }),
            body: JSON.stringify(formData)
        });

        if (!res.ok) {
            hideLoadingOverlay()
            showAlert('success', 'Product upload failed');
            return;
        }

        const data = await res.json();
        console.log(res, data);
        
        if(data.status === 'success') {
            hideLoadingOverlay();
            showAlert('success', 'Product Updated successfully..');
            window.location.reload(true);
            return;
        } 

    } catch (err) {
        console.log(err);
        hideLoadingOverlay()
    }
};

/*
if (productForm) {
    productForm.addEventListener('submit', function(e) {
        
        e.preventDefault();
        const form = new FormData();
        form.append('name', document.querySelector('#product__name').value);
        form.append('summary', document.querySelector('#product__summary').value);
        form.append('summary', document.querySelector('#product__description').value);
        form.append('price', document.querySelector('#product__price').value);
        form.append('commission', document.querySelector('#product__commission').value);
        form.append('type', document.querySelector('#product__type').value);
        form.append('category', document.querySelector('#product__category').value);
        form.append('tools', document.querySelector('#product__tools').checked);
        form.append('recurring', document.querySelector('#product__recurring').checked);
        form.append('link', document.querySelector('#product__link').checked);
        postProduct(form, 'create')

        const imageFiles = document.getElementById('image').files;
        const bannerFiles = document.getElementById('banner').files;

        for (let i = 0; i < imageFiles.length; i++) {
            form.append('subImages', imageFiles[i]);
        }

        for (let i = 0; i < bannerFiles.length; i++) {
            form.append('banners', bannerFiles[i]);
        }
        uploadProduct(form)
    });
}
*/


if (productForm) {
    productForm.addEventListener('submit', function(e) {
        
        e.preventDefault();
        const form = new FormData();
        const name = document.querySelector('#product__name').value;
        const summary = document.querySelector('#product__summary').value;
        const description = document.querySelector('#product__description').value;
        const price = document.querySelector('#product__price').value;
        const commission =  document.querySelector('#product__commission').value;
        const type = document.querySelector('#product__type').value;
        const category = document.querySelector('#product__category').value;
        const recurring = document.querySelector('#product__link').checked;
        const data = {name, summary, description, price, commission, type, category, recurring}
        updateProduct(data, 'create')
        console.log(data)
    });
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
        const recurring = document.querySelector('#product-update__recurring').value
        const data = {name, summary, description, price, commission, type, category, recurring}
        updateProduct(data, 'update')
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
        const recurring = document.querySelector('#product-update__recurring').value
        const data = {name, summary, description, price, commission, type, category, recurring}
        updateProduct(data, 'update')
    });
}


// User Update
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


