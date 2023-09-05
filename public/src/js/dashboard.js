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
// const dashboradWidth = mainDashboard.getBoundingClientRect();

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
    // const markup = `<div class="alert alert--${type}">${msg}</div>`;
    const markup = `
        <div class="alert alert--${type}">
            ${msg}&nbsp;
            <picture>
                <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/${type === 'error' ? '1f61f' : '2728'}/512.webp" type="image/webp">
                <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/${type === 'error' ? '1f61f/512.gif" alt="😟"' : '2728/512.gif" alt="✨"'} width="32" height="32">
            </picture>
        </div>`;
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


const shoppingCart = document.querySelector('.shopping__cart');
const shoppingCartBtn = document.querySelector('.shop-cart')
document.body.addEventListener('click', function(e) {
    e.stopPropagation();
    if(!shoppingCart?.classList.contains('hidden')) shoppingCart?.classList.add('hidden');
    if(!profileBox?.classList.contains('hidden')) profileBox?.classList.add('hidden');
    if(!notifyBox?.classList.contains('hidden')) notifyBox?.classList.add('hidden');
})
// notification and profile dropdown
if (notifyIcon) {
    notifyIcon.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the click event from propagating to the mainDashboard
        notifyBox.classList.toggle('hidden');
        if(!shoppingCart?.classList.contains('hidden') || !profileBox?.classList.contains('hidden'));
            shoppingCart?.classList.add('hidden');
            profileBox?.classList.add('hidden');
    });
}
if (profileImg) {
    profileImg.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the click event from propagating to the mainDashboard and body
        profileBox.classList.toggle('hidden');
        if(!shoppingCart?.classList.contains('hidden') || !notifyBox?.classList.contains('hidden'));
            shoppingCart?.classList.add('hidden');
            notifyBox?.classList.add('hidden');
    });
}
if(shoppingCartBtn) {
    shoppingCartBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        shoppingCart.classList.toggle('hidden');
        if(!profileBox?.classList.contains('hidden') || !notifyBox?.classList.contains('hidden'));
            profileBox?.classList.add('hidden');
            notifyBox?.classList.add('hidden');
    })
}
if(document.querySelector('.shopping-cart')) {
    document.querySelector('.shopping-cart').setAttribute('data-digits', JSON.parse(localStorage.getItem('cartData'))?.cartCount || 0);
}
if(document.querySelector('.dashboard-cart')) {
    document.querySelector('.dashboard-cart').textContent = JSON.parse(localStorage.getItem('cartData'))?.cartCount || 0;
}


const menuLogout = document.querySelector('.menu__logout');
const navLogout = document.querySelector('.nav__logout');
const adminLogout = document.querySelector('.admin__menu--logout');
const buyerNavLogout = document.querySelector('.buyer__nav--logout');
const buyerMenuLogout = document.querySelector('.buyer__menu--logout');

const logoutUser = async function(role) {
    try {
        showLoadingOverlay();

        const res = await fetch('/api/users/logout');
        if(!res.ok) {
            hideLoadingOverlay();
            return;
        }
        const data = await res.json();
        if(data.status === 'success') {
            showAlert('success', 'Logging Out...')
            location.assign(role === 'admin' ? '/admin/login' : role === 'buyer' ? '/buyers/login' : '/login')
        }
    } catch(err) {
       hideLoadingOverlay();
       showAlert('error', 'something went wrong')
    }
}

if(adminLogout) {
    adminLogout.addEventListener('click', function(e) {
        logoutUser('admin');
    })
}
if(buyerNavLogout) {
    buyerNavLogout.addEventListener('click', function(e) {
        logoutUser('buyer');
    })
}
if(buyerMenuLogout) {
    buyerMenuLogout.addEventListener('click', function(e) {
        logoutUser('buyer');
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

// const productForm = document.querySelector('.product__form-create');
// const productUpdateForm = document.querySelector('.product__form-update');
// const productUpdateAdminForm = document.querySelector('.product__form-admin-update');

const productCreate = document.querySelector('.product-create') // btn
const productEdit = document.querySelectorAll('.product-edit'); // btn
const productAdminEdit = document.querySelectorAll('.admin-product-edit'); // btn

const productUpdateOverlay = document.querySelector('.product-update__overlay');
const productUpdateModal = document.querySelector('.product-update__modal');

const productOverlay = document.querySelector('.product__overlay');
const productModal = document.querySelector('.product__modal');
const productOverlayClose = document.querySelector('.form__close-icon');

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


// // Upload functionality
// const showUploadModal = function() {
//     const html = `
//         <div class="product__overlay">
//             <div class="product__modal">
//                 <i class="fa-solid fa-close icon form__close-icon"></i>
//                 <h3 class="dashboard__heading">Add new product</h3>
//                 <form class="product__form product__form-create">

//                     <div class="form__body-generic">
//                         <div id="uploader__image--card">
//                             <img id="uploader__image" src="/asset/img/products/product-default.png" alt="" />
//                             <div id="uploader__image--label-box">
//                                 <input name="image" id="uploader__image--input" type="file" name='image' accept="image/png, image/jpeg">
//                                 <label id="uploader__image--label" for="uploader__image--input"><i class="fa-solid fa-camera"></i> Add image</label>
//                             </div>
//                         </div>
//                     </div>

//                     <div class="form__body-generic">
//                         <label class="form__label" for="product__name">Product Name</label>
//                         <input class="form__input" id="product__name" type="text" name="product__name" required="" placeholder="Product name"/>
//                     </div>
//                     <div class="form__body-generic">
//                         <label class="form__label" for="product__summary">Product Summary</label>
//                         <textarea class="textarea form__input" id="product__summary" style="height: 6rem;" type="text" name="product__summary" required="" placeholder="Product Summary (not more than 120 characters)"></textarea>
//                     </div>
//                     <div class="form__body-generic">
//                         <label class="form__label" for="product__description">Product Description</label>
//                         <textarea class="textarea form__input" id="product__description" style="height: 15rem;" type="text" name="product__description" required="" placeholder="Product Description"></textarea>
//                     </div>
//                     <div class="form__grid-generic">
//                         <div class="form__body-generic">
//                             <label class="form__label" for="product__price">Product Price</label>
//                             <input class="form__input" id="product__price" type="text" name="product__price" required="" placeholder="Product price (NGN)"/>
//                         </div>
//                         <div class="form__body-generic">
//                             <label class="form__label" for="product__commission">Product Commission</label>
//                             <input class="form__input" id="product__commission" type="text" name="product__commission" required="" placeholder="Product Commission in (%)"/>
//                         </div>
//                     </div>
//                     <div class="form__grid3-generic">
//                         <div class="form__body-generic">
//                             <label class="form__label" for="product__type">Product Type</label>
//                             <select class="form__select" id="product__type" name="product__type">
//                                 <option value="physical">Physical Product</option>
//                                 <option value="digital">Digital Product</option>
//                             </select>
//                         </div>
//                         <div class="form__body-generic">
//                             <label class="form__label" for="product__category">Product Category</label>
//                             <select class="form__select" id="product__category" name="product__category">
//                                 <option value="physical">All categories</option>
//                                 <option class="category__item" data-item="all">All </option>
//                                 <option class="category__item" data-item="arts">Arts</option>
//                                 <option class="category__item" data-item="betting">Betting</option>
//                                 <option class="category__item" data-item="books">Books</option>
//                                 <option class="category__item" data-item="business">Business</option>
//                                 <option class="category__item" data-item="computers">Computers</option>
//                                 <option class="category__item" data-item="cooking">Cooking</option>
//                                 <option class="category__item" data-item="e-Business-and-e-Marketing">E-Business and E-Marketing</option>
//                                 <option class="category__item" data-item="education">Education</option>
//                                 <option class="category__item" data-item="entertainment">Entertainment</option>
//                                 <option class="category__item" data-item="food-and-Wine">Food and Wine</option>
//                                 <option class="category__item" data-item="games">Games</option>
//                                 <option class="category__item" data-item="green-products">Green Products</option>
//                                 <option class="category__item" data-item="health-and-fitness">Health and Fitness</option>
//                                 <option class="category__item" data-item="home-and-garden">Home and Garden</option>
//                                 <option class="category__item" data-item="internet">Internet</option>
//                                 <option class="category__item" data-item="investing">Investing</option>
//                                 <option class="category__item" data-item="jobs">Jobs</option>
//                                 <option class="category__item" data-item="languages">Languages</option>
//                                 <option class="category__item" data-item="reciepe">Reciepe</option>
//                                 <option class="category__item" data-item="parenting-and-Families">Parenting and Families</option>
//                                 <option class="category__item" data-item="self-Help">Self-Help</option>
//                                 <option class="category__item" data-item="spirituality">Spirituality</option>
//                                 <option class="category__item" data-item="sports">Sports</option>
//                             </select>
//                         </div>

//                         <div class="form__body-generic">
//                             <label class="form__label" for="product__recurring">Recurring Commissions</label>
//                             <select class="form__select" id="product__recurring" name="product__type">
//                                 <option value="no">No</option>
//                                 <option value="yes">Yes</option>
//                             </select>
//                         </div>
//                     </div>

//                     <div class="product__sub-images">
//                         <p class="form__label photo-head">Product sub images | Maximum of 6 upload</p>
//                         <div class="sub-images">
//                             <img class="sub-image" src="/asset/img/products/product-default.png" alt="product sub image"/>
                            
//                         </div>
//                         <input class="btn-upload btn__image-upload sub-images-input" type="file" accept="image/*" id="imagesubs" name="image" multiple max="6" />

//                     </div>

//                     <div class="product__banners">
//                         <p class="form__label photo-head">Product banner | Maximum of 4 upload</p>
//                         <div class="banners">
//                             <img class="banner" src="/asset/img/products/product-default.png" alt="product sub banner"/>
                           
//                         </div>

//                         <input class="btn-upload btn__banner-upload banner-input" type="file" accept="image/*" id="imagebanners" name="image" multiple max="4" />
                        
//                     </div>
//                         <button class="btn form__submit form__submit-generic" type="submit">Add product
//                         </button>
//                 </form>
//             </div>
//         </div>
//     `;
  
//     document.body.insertAdjacentHTML('afterbegin', html);
// }
// Upload functionality

const showUploadModal = function() {
    const html = `
        <div class="product__overlay">
            <div class="product__modal">
                <i class="fa-solid fa-close icon form__close-icon"></i>
                <h3 class="dashboard__heading">Add new product</h3>
                <form class="product__form product__form-create">

                    <div class="form__body-generic">
                        <div id="uploader__image--card">
                            <img id="uploader__image" src="/asset/img/products/product-default.png" alt="" />
                            <div id="uploader__image--label-box">
                                <input name="image" id="uploader__image--input" type="file" name='image' accept="image/png, image/jpeg">
                                <label id="uploader__image--label" for="uploader__image--input"><i class="fa-solid fa-camera"></i> Add image</label>
                            </div>
                        </div>
                    </div>


                    <div class="form__body-generic">
                        <label class="form__label" for="product__name">Product Name</label>
                        <input class="form__input" id="product__name" type="text" name="name" required="" placeholder="Product name"/>
                    </div>
                    <div class="form__body-generic">
                        <label class="form__label" for="product__summary">Product Summary (Short Summary)</label>
                        <textarea class="textarea form__input" id="product__summary" style="height: 6rem;" type="text" name="summary" required="" placeholder="Product Summary (not more than 120 characters)"></textarea>
                    </div>
                    <div class="form__body-generic">
                        <label class="form__label" for="product__description">Product Description (Details)</label>
                        <textarea class="textarea form__input" id="product__description" style="height: 15rem;" type="text" name="description" required="" placeholder="Product Description"></textarea>
                    </div>
                    <div class="form__grid-generic">
                        <div class="form__body-generic">
                            <label class="form__label" for="product__price">Product Price (NGN)</label>
                            <input class="form__input" id="product__price" type="number" name="price" required="" placeholder="Product price (NGN)"/>
                        </div>
                        <div class="form__body-generic">
                            <label class="form__label" for="product__commission">Product Commission in (%)</label>
                            <input class="form__input" id="product__commission" type="number" name="commissionPercentage" required="" placeholder="Product Commission in (%)"/>
                        </div>
                    </div>
                    <div class="form__grid3-generic">
                        <div class="form__body-generic">
                            <label class="form__label" for="product__type">Product Type</label>
                            <select class="form__select" id="product__type" name="type">
                                <option value="Physical">Physical Product</option>
                                <option value="Digital">Digital Product</option>
                            </select>
                        </div>
                        <div class="form__body-generic">
                            <label class="form__label" for="product__category">Product Category</label>
                            <select class="form__select" id="product__category" name="niche">
                                <option style="display:none">All categories</option>
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
                            <select class="form__select" id="product__recurring" name="recurringCommission">
                                <option value=false>No</option>
                                <option value=true>Yes</option>
                            </select>
                        </div>
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
const showUpdateModal = (productName, productImage) => {
    const html = `
        <div class="product-update__overlay">
            <div class="product-update__modal">
                <i class="fa-solid fa-close icon form__close-icon"></i>
                <h3 class="dashboard__heading">Update ${productName}</h3>

                <form class="product__form product__form-update product__form-admin-update">

                    <div class="form__body-generic">
                        <div id="uploader__image--card">
                            <img id="uploader__image" src="/asset/img/products/${productImage}" alt="" />
                            <div id="uploader__image--label-box">
                                <input name="image" id="uploader__image--input" class="upload-image" type="file" name='image' accept="image/png, image/jpeg">
                                <label id="uploader__image--label" for="uploader__image--input"><i class="fa-solid fa-camera"></i> Add image</label>
                            </div>
                        </div>
                    </div>
                    <div class="form__body-generic">
                        <label class="form__label" for="product__update__name">Product Name</label>
                        <input class="form__input" id="product-update__name" value='${productName}' type="text" name="product__name" required="" placeholder="Product name"/>
                    </div>
                    <div class="form__body-generic">
                        <label class="form__label" for="product-update__summary">Product Summary</label>
                        <textarea class="textarea form__input" id="product-update__summary" style="height: 6rem;" type="text" name="product__summary" required="" placeholder="Product Summary (not more than 120 characters)"></textarea>
                    </div>
                    <div class="form__body-generic">
                        <label class="form__label" for="product-update__description">Product Description</label>
                        <textarea class="textarea form__input" id="product-update__description" style="height: 15rem;" type="text" name="product__description" required="" placeholder="Product Description"></textarea>
                    </div>
                    <div class="form__grid-generic">
                        <div class="form__body-generic">
                            <label class="form__label" for="product-update__price">Product Price</label>
                            <input class="form__input" id="product-update__price" type="number" name="product__price" required="" placeholder="Product price (NGN)"/>
                        </div>
                        <div class="form__body-generic">
                            <label class="form__label" for="product-update__commission">Product Commission</label>
                            <input class="form__input" id="product-update__commission" type="number" name="product__commission" required="" placeholder="Product Commission in (%)"/>
                        </div>
                    </div>
                    <div class="form__grid3-generic">
                        <div class="form__body-generic">
                            <label class="form__label" for="product-update__type">Product Type</label>
                            <select class="form__select" id="product-update__type" name="product__type">
                                <option value="physical">Physical Product</option>
                                <option value="digital">Digital Product</option>
                            </select>
                        </div>
                        <div class="form__body-generic">
                            <label class="form__label" for="product-update__category">Product Category</label>
                            <select class="form__select" id="product-update__category" name="product__category">
                                <option style="display:none">All categories</option>
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
                            <label class="form__label" for="product-update-update__recurring">Recurring Commissions</label>
                            <select class="form__select" id="product-update__recurring" name="product__type">
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="product__sub-images">
                        <p class="form__label photo-head">Product sub images Maximim of 6 upload</p>
                        <div class="sub-images">
                            <img class="sub-image sub-image1" src="asset/img/product-default.png" alt="product sub image"/>
                            
                        </div>
                        <input class="btn-upload btn__image-upload sub-images-input" type="file" accept="image/*" id="imagesubs" name="image" multiple max="6" />

                    </div>

                    <div class="product__banners">
                        <p class="form__label photo-head">Product banner Maximum of 4 upload</p>
                        <div class="banners">
                            <img class="banner banner1" src="asset/img/product-default.png" alt="product sub image"/>
                           
                        </div>

                        <input class="btn-upload btn__banner-upload banner-input" type="file" accept="image/*" id="banner" name="imagebanners" multiple max="4" />
                        
                    </div>
                    <button class="btn form__submit form__submit-generic" type="submit">Add product
                    </button>
                </form>
            </div>
        </div>
    
    `;
    document.body.insertAdjacentHTML('afterbegin', html);
}



const imageInput = document.getElementById('uploader__image--input');
const imagePreview = document.getElementById('uploader__image');
if(imageInput) {
    imageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            imagePreview.src = imageUrl;
        }
    });
}






const postProduct = async function(form, type, id) {
    let url, method;
    try {
        if(type === 'create') {
            url = '/api/products';
            method = 'POST'
        }
        if(type === 'update') {
            url = `/api/products/${id}`;
            method = 'PATCH'
        }
        showLoadingOverlay()
        const res = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form)
        });
        console.log(res)

        if (!res.ok) {
            hideLoadingOverlay()
            showAlert('error', 'Product upload failed');
            return;
        }

        const data = await res.json();
        console.log(res, data);
        
        if(data.status === 'success') {
            hideLoadingOverlay();
            if(type === 'create') {
                showAlert('success', 'Product Created successfully..');
            }else {
                showAlert('success', 'Product Updated successfully..');
            }
            window.location.reload(true);
            return;
        }

    } catch (err) {
        console.log(err);
        hideLoadingOverlay();
    }
};


// Create product

if (productCreate) {
    productCreate.addEventListener('click', function (e) {
        const existingModal = document.querySelector('.product__overlay');
        if (existingModal) {
            return;
        }
        showUploadModal();
    
        document.querySelector('.form__close-icon').addEventListener('click', function (e) {
            closeUploadModal();
        });

        document.body.addEventListener('submit', (e) => {
            const target = e.target;
            if (target.classList.contains('product__form-create')) {
                e.preventDefault();

                document.getElementById('uploader__image--input').addEventListener('change', (event) => {
                    const file = event.target.files[0];
                    if (file) {
                        const imageUrl = URL.createObjectURL(file);
                        document.getElementById('uploader__image').src = imageUrl;
                    }
                });

                const form = new FormData(target);

//                 const fileInput = document.getElementById('uploader__image--input');
// if (fileInput.files.length > 0) {
//     const file = fileInput.files[0];
//     // Append the file to the FormData
//     form.append('image', file);
// }

                const formData = {};
                for (const [key, value] of form) {
                    formData[key] = value;
                    console.log(key, value)
                }
                postProduct(formData, 'create');
            }
        });
    });
} 



if(productAdminEdit) {
    productAdminEdit.forEach(el => el.addEventListener('click', function() {
        const productName = el.dataset.productname;
        const editingProductId = el.dataset.id;
        const productImage = el.dataset.productimage;
        const existingModal = document.querySelector('.product-update__overlay');
        if (existingModal) {
            return; 
        }
        showUpdateModal(productName, productImage);

        document.querySelector('.form__close-icon').addEventListener('click', function(e) {
            closeUpdateModal();
        })

        document.body.addEventListener('submit', function(e) {
            const target = e.target;    
            
            if(target.classList.contains('product__form-admin-update')) {
                e.preventDefault();
                const form = new FormData();
                const inputFiles = document.querySelectorAll('.sub-images-input, .banner-input');

                form.append('image', document.getElementById('uploader__image--input').files[0])
                form.append('name', document.querySelector('#product-update__name').value)
                form.append('summary', document.querySelector('#product-update__summary').value)
                form.append('description', document.querySelector('#product-update__description').value)
                form.append('price', document.querySelector('#product-update__price').value)
                form.append('commission', document.querySelector('#product-update__commission').value)
                form.append('type', document.querySelector('#product-update__type').value)
                form.append('niche', document.querySelector('#product-update__category').value)
                form.append('recurring', document.querySelector('#product-update__recurring').value)
                // Append all selected images to the FormData object
                inputFiles.forEach(input => {
                    const files = input.files;
                    for (let i = 0; i < files.length; i++) {
                        form.append('images', files[i]);
                    }
                });

                postProduct(form, 'update', editingProductId)
            }
        });
    }));
}


if(productEdit) {
    productEdit.forEach(el => el.addEventListener('click', function() {
        const productName = el.dataset.productname;
        const editingProductId = el.dataset.id;
        console.log(editingProductId)


        const productImage = el.dataset.productimage;
        const existingModal = document.querySelector('.product-update__overlay');
        if (existingModal) {
            return; 
        }
        showUpdateModal(productName, productImage);

        document.querySelector('.form__close-icon').addEventListener('click', function(e) {
            closeUpdateModal();
        })
        console.log('I was logged from update product modal')

        document.body.addEventListener('submit', function(e) {
            const target = e.target;
            
            if(target.classList.contains('product__form-update')) {
                e.preventDefault();
                const form = new FormData();
                const inputFiles = document.querySelectorAll('.sub-images-input, .banner-input');

                form.append('image', document.getElementById('uploader__image--input').files[0])
                form.append('name', document.querySelector('#product-update__name').value)
                form.append('summary', document.querySelector('#product-update__summary').value)
                form.append('description', document.querySelector('#product-update__description').value)
                form.append('price', document.querySelector('#product-update__price').value)
                form.append('commission', document.querySelector('#product-update__commission').value)
                form.append('type', document.querySelector('#product-update__type').value)
                form.append('category', document.querySelector('#product-update__category').value)
                form.append('recurring', document.querySelector('#product-update__recurring').value)
                // Append all selected images to the FormData object
                inputFiles.forEach(input => {
                    const files = input.files;
                    for (let i = 0; i < files.length; i++) {
                        form.append('images', files[i]);
                    }
                });

                console.log(form)
                postProduct(form, 'update', editingProductId);
            }
        });
    }));
}


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

/*
// User Update
const updateUser = async function(name, email, phone, country, state, region, zipCode) {
    try {
        showLoadingOverlay();
        const res = await fetch('/api/users/updateMe', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name, email, phone, country, state, region, zipCode,
            }),
        });

        if(!res.ok) {
            showAlert('error', 'Update failed')
            hideLoadingOverlay();
            return;
        }

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
        showAlert('error', 'Something Went Wrong');
        hideLoadingOverlay()
    }
}

const userFormUpdate = document.querySelector('.form-profile-data');
if(userFormUpdate) {
    userFormUpdate.addEventListener('submit', function(e) {
        e.preventDefault();
        const formUpdateName = document.querySelector('#fullName').value
        const formUpdateEmail = document.querySelector('#email').value
        const formUpdatePhone = document.querySelector('#phone').value
        const formUpdateCountry = document.querySelector('#country').value
        const formUpdateState = document.querySelector('#state').value
        const formUpdateCityRegion = document.querySelector('#city-region').value
        const formUpdatezipCode = document.querySelector('#zip-postal').value
        updateUser(formUpdateName, formUpdateEmail, formUpdatePhone, formUpdateCountry, formUpdateState, formUpdateCityRegion, formUpdatezipCode);
        console.log(formUpdateName, formUpdateEmail, formUpdatePhone, formUpdateCountry, formUpdateState, formUpdateCityRegion, formUpdatezipCode);
    });
}
*/

const uploadProfileImage = async function(form) {
    try {
        showLoadingOverlay()
        const res = await fetch('/api/users/uploadProfileImage', {
            method: 'PATCH',
            body: form
        });

        if(!res.ok) {
            showAlert('error', 'Error uploading image');
            hideLoadingOverlay();
            return;
        }

        const data = await res.json();
        console.log(res, data)
        
        if(data.status === 'success') {
            hideLoadingOverlay();
            window.location.reload(true)
        }

    } catch(err) {}
}

const profileImage = document.querySelector('.form-image-data');
if(profileImage)
    profileImage.addEventListener('submit', function(e) {
        e.preventDefault();

        const form = new FormData();
        form.append('image', document.getElementById('uploader__image--input').files[0]);
        console.log(form)
        uploadProfileImage(form);
    });




// type is either 'password' or 'data or image or bank'
const updateSettings = async (form, type) => {
    try {
      showLoadingOverlay();
        let url;
        if(type === 'password') url = '/api/users/updateMyPassword'
        if(type === 'data') url ='/api/users/updateMe';
        if(type === 'bank') url ='/api/users/updateMyBank';
    
        const res = await fetch(url, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });

        console.log(res)
        if(!res.ok) {
          showAlert('error', 'Error updating data')  
          hideLoadingOverlay();
          return; 
        }

        const data = await res.json();
        console.log(data)
        if(type === 'password' && data.message === 'Your current password is wrong.') {
          hideLoadingOverlay();
          showAlert('error', data.message);
        }
        if (data.status === 'success') { 
          hideLoadingOverlay();
          showAlert('success', `${type.toUpperCase()} updated successfully!`);
          location.reload(true)
        }
    } catch (err) {
        hideLoadingOverlay();
        showAlert('error', 'Something went wrong');
    }
}


const userDataForm = document.getElementById('form-data');
if (userDataForm)
  userDataForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const country = document.getElementById('country').value;
    const state = document.getElementById('state').value;
    const region = document.getElementById('city-region').value;
    const zipCode = Number(document.getElementById('zip-postal').value);
    const formData = { fullName, email, phone, country, state, region, zipCode}
    updateSettings(formData, 'data');
  });


const vendorDataForm = document.getElementById('form-data-vendor');
if (vendorDataForm)
  vendorDataForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const businessName = document.getElementById('businessName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const country = document.getElementById('country').value;
    const state = document.getElementById('state').value;
    const region = document.getElementById('city-region').value;
    const zipCode = Number(document.getElementById('zip-postal').value);
    const formData = { fullName, businessName, email, phone, country, state, region, zipCode}
    updateSettings(formData, 'data');
  });



const userPasswordForm = document.querySelector('.form-password-data') 
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent ='Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const formData = { passwordCurrent, password, passwordConfirm }
    console.log(formData)
    updateSettings(formData, 'password' );
    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
});


const userBankForm = document.querySelector('.form-payment-data') 
if (userBankForm)
  userBankForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    document.querySelector('.btn--save-bank').textContent = 'Updating...';

    const bankName = document.getElementById('paymentBankName').value;
    const bankAccountNumber = document.getElementById('paymentAcctNum').value;
    const bankHolderName = document.getElementById('holdersName').value;
    const formData = { bankName, bankAccountNumber, bankHolderName }
    console.log(formData)
    updateSettings( formData, 'bank')
    document.querySelector('.btn--save-bank').textContent = 'Add payment account';
});



//////////////////////////////////////
//////////////////////////////////////

const showMyDeleteModal = function(item) {
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

const closeAdjacentDeleteModal = () => {
  const deleteOverlay = document.querySelector('.delete__overlay');
  if (deleteOverlay) {
    deleteOverlay.remove();
  }
};

const deleteMyAccount = async function(role) {
  try {
    showLoadingOverlay();
    await fetch(`/api/users/deleteAccount`, {
      method: 'DELETE',
    });

    showAlert('success', 'Account deleted successfully!');
    location.reload(true);
    location.assign(`${role === 'affiliate' ? '/affiliate#signup' : role === 'vendor' ? '/vendor' : '/signup'}`);
    
  } catch (err) {
    hideLoadingOverlay();
    showAlert('error', 'Something went wrong!');
  }
} 


const deleteAccount = document.querySelector('.delete-data')

if(deleteAccount)
    deleteAccount.addEventListener('submit', function(e) {
    e.preventDefault()

    showMyDeleteModal('Account');
    const userRole = e.target.dataset.role;

    document.querySelector('.btn-yes').addEventListener('click', async function() {
        await deleteMyAccount(userRole);
    })
    document.querySelector('.btn-no').addEventListener('click', () => {
        closeAdjacentDeleteModal();
    })
    document.querySelector('.delete__icon').addEventListener('click', () => {
        closeAdjacentDeleteModal();
    } )
    })