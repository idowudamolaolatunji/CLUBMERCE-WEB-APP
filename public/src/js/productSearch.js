const spinOverlay = document.querySelector('#spinOverlay');

const showLoadingOverlay = () => {
    spinOverlay.style.visibility = 'visible';
};

const hideLoadingOverlay = () => {
    spinOverlay.style.visibility = 'hidden';
};

document.querySelector('.go-back').addEventListener('click', function(e) {
    showLoadingOverlay();
});

const dashboardSection = document.querySelector('.section__dashboard')
const searchForm = document.querySelector('.nav__search');
const searchResults = document.getElementById('search-result');
console.log('I am connected');

searchForm.addEventListener('keyup', function (e) {
  e.preventDefault();
  const searchInput = document.querySelector('.nav__input');
  const searchTerm = searchInput.value.trim();

  if (searchTerm === '') {
    searchResults.innerHTML = '';
    searchResults.style.backgroundColor = 'transparent';
    searchResults.style.boxShadow = 'none';
    return;
  }

  showLoadingOverlay()
  fetch('/api/products/search-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payload: searchTerm }),
  })
    .then((res) => {
      if (!res.ok) {
        hideLoadingOverlay()
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((data) => {
        hideLoadingOverlay()
        const { payload } = data;
        console.log(payload);
        let markup = '';

      if (payload.length === 0) {
        searchResults.innerHTML = '<p>No result found</p>';
        searchResults.style.backgroundColor = '#fff';
        searchResults.style.boxShadow = '0 1rem 4rem rgba(0, 0, 0, 0.15)';
        return;
      }

      payload.forEach((el) => {
        markup += `<a class='result' target="_blank" href='/marketplace/${el.slug}'>${el.name}</a>`;
      });

      // Clear previous results and insert the markup into the searchResults div parent container
      searchResults.style.transform = 'translateY(0)'; // Use remove() to avoid potential errors
      searchResults.innerHTML = '';
      searchResults.insertAdjacentHTML('beforeend', markup);

      searchResults.style.backgroundColor = '#fff';
      searchResults.style.boxShadow = '0 1rem 4rem rgba(0, 0, 0, 0.15)';
      

      dashboardSection.addEventListener('click', function () {
        searchResults.style.transform = 'translateY(-1000rem)'; // Use remove() to avoid potential errors
      });
    })
    .catch((err) => console.error(err));
});


const categoryList = document.querySelector('.catergory__list');
const productBox = document.querySelector('.products__cards--box');


// Function to fetch products based on the selected category
const fetchProductsByCategory = async (category) => {
    try {
        // Show the spinner during the fetch request
        showLoadingOverlay();
    
        const res = await fetch(`/api/products/niche/${category}`);
        if(!res.ok) return;

        const data = await res.json();
        console.log(data)
        const {products} = data.data;
        if(products.length === 0) {
            hideLoadingOverlay();
            productBox.innerHTML = '<p>No product found..</p>';
            document.querySelector('.dashboard__subheading').textContent = category.split('-').join(' ');
            document.querySelector('.figures').textContent = `Total 0`;
            return;
        }

        // Clear the product container
        productBox.innerHTML = '';
    
        // Hide the spinner overlay
        // spinOverlay.style.visibility = 'hidden';
        document.querySelector('.dashboard__subheading').textContent = category.split('-').join(' ');
        document.querySelector('.figures').textContent = `Total ${products.length || 0}`;
        hideLoadingOverlay()
        // Scroll to the top
        dashboardSection.scrollTop = 0;

        // Display the products for the selected category
        products.forEach(product => {
            console.log(product)
            const markup = `
                <div class="product__card ${product.isBoosted ? 'promoted' : ''}">
                    <div class="product__side--left">   
                        <div class="side--top">
                            <div class="product__image--container">
                                <img class="product__image" src="/asset/img/products/${product.image}"/></div>
                            <div class="product__heading"> 
                                <h2 class="product__title">${product.name}</h2>
                                <p class="product__niche">${product.niche}</p>
                                <button class="product__message person" data-vendor-id=${product.vendor?._id}>
                                    <i class="fa-solid fa-envelope icon"></i>
                                    Chat vendor
                                </button>
                                <div class="product__content">
                                    <h4 class="product__description">${product.summary}...</h4>
                                </div>
                            </div>
                        </div>
                        <div class="side--bottom">
                            <ul class="product__info">
                                <li class="product__info--item"> <i class="fa-solid ${product.type === 'Digital' ? 'fa-file' : 'fa-truck-fast'} product__icon icon"></i>${product.type} Product</li>
                                <li class="product__info--item"> <i class="fa-solid fa-tools product__icon icon"></i>Affiliate tools</li>
                                <li class="product__info--item"> <i class="fa-solid fa-link product__icon icon"></i>Unique Link</li>
                                <li class="product__info--item"> <i class="fa-regular fa-square-check product__icon icon"></i>Approved</li>
                                ${product.recurringCommission ? '<li class="product__info--item"> <i class="fa-solid fa-rotate product__icon icon"></i>Recurring</li>' : ''}
                            </ul>
                        </div>
                    </div>
                    <div class="product__side--right">
                        <span class="product__commission">
                            <p class="commision">avg commission</p>
                            <span class="commission__amount">₦ ${product.price}</span>
                        </span>
                        <a class="btn product__button promote" data-productSlug="${product.slug}">Promote</a>
                        <a class="product__button page" target="_blank" href="/marketplace/${product.slug}">affiliate page</a>
                    </div>
                </div>
            `;
            productBox.insertAdjacentHTML('beforeend', markup);
        });
    } catch (error) {
        // Hide the spinner overlay
        // spinOverlay.style.visibility = "hidden";
    
        console.error('Error fetching products:', error);
        // Display an error message to the user
        productBox.innerHTML = '<p>Something went wrong, Try again</p>';
        hideLoadingOverlay()
    }
};
  
  // Attach click event to each category item
if(categoryList) {
    categoryList.addEventListener('click', (event) => {
        const selectedCategory = event.target.dataset.item;
        console.log(selectedCategory)
        if (selectedCategory) {
        fetchProductsByCategory(selectedCategory);
        }
    });
}

const selectElement = document.querySelectorAll('.select__input');

// Function to fetch products based on the selected option
const fetchProducts = async (option) => {
  try {
    // Show the spinner during the fetch request
    showLoadingOverlay();

    const res = await fetch(`/api/products/category/${option}`);
    if(!res.ok) return;
    const data = await res.json();
    
    const {products} = data.data;
    if(!products.length === 0) {
        hideLoadingOverlay()
        return;
    }
    
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    hideLoadingOverlay()
  }
};

let selectedOption;
// Function to display products in the product__container
const displayProducts = (products, username) => {
    // Clear previous products
    productBox.innerHTML = '';
    hideLoadingOverlay()
    dashboardSection.scrollTop = 0;
    
    // Display each product in the product__container
    document.querySelector('.figures').textContent = `Total ${products.length || 0}`
    document.querySelector('.dashboard__subheading').textContent = selectedOption.split('-').join(' ')
    
    products.forEach((product) => {
        const markup = `
            <div class="product__card ${product.isBoosted ? 'promoted' : ''}">
                <div class="product__side--left">   
                    <div class="side--top">
                        <div class="product__image--container">
                            <img class="product__image" src="/asset/img/products/${product.image}"/></div>
                        <div class="product__heading"> 
                            <h2 class="product__title">${product.name}</h2>
                            <p class="product__niche">${product.niche}</p>
                            <button class="product__message person" data-vendor-id=${product.vendor?._id}>
                                <i class="fa-solid fa-envelope icon"></i>
                                Chat vendor
                            </button>
                            <div class="product__content">
                                <h4 class="product__description">${product.summary}</h4>
                            </div>
                        </div>
                    </div>
                    <div class="side--bottom">
                        <ul class="product__info">
                            <li class="product__info--item"> <i class="fa-solid ${product.type === 'Digital' ? 'fa-file' : 'fa-truck-fast'} product__icon icon"></i>${product.type} Product</li>
                            <li class="product__info--item"> <i class="fa-solid fa-tools product__icon icon"></i>Affiliate tools</li>
                            <li class="product__info--item"> <i class="fa-solid fa-link product__icon icon"></i>Unique Link</li>
                            <li class="product__info--item"> <i class="fa-regular fa-square-check product__icon icon"></i>Approved</li>
                            ${product.recurringCommission ? '<li class="product__info--item"> <i class="fa-solid fa-rotate product__icon icon"></i>Recurring</li>' : ''}
                        </ul>
                    </div>
                </div>
                <div class="product__side--right">
                    <span class="product__commission">
                        <p class="commision">avg commission</p>
                        <span class="commission__amount">₦ ${product.price}</span>
                    </span>
                    <a class="btn product__button promote" data-productSlug="${product.slug}">Promote</a>
                    <a class="product__button page" target="_blank" href="/marketplace/${product.slug}">affiliate page</a>
                </div>
            </div>



            <figure class="product__card-mobile">
                <div class="product__side front ${product.isBoosted ? 'promoted-m' : ''}">
                    <div class="front--top">
                        <div class="product__image--container">
                            <img class="product__image" src="/asset/img/products/${product.image}" alt="${product.name}">
                        </div>
                        <div class="product__heading">
                            <h2 class="product__title">${product.name}</h2>
                            <button class="produt__message-m person" data-vendor-id="${product.vendor?._id}">
                                <i class="fa-solid fa-envelope icon product__icon"></i>
                            </button>
                            <div class="product__content">
                                <h4 class="product__description">${product.summary}...</h4>
                                <a class="product__button page margin__bottom--xsm" target="_blank" href="/marketplace/${product.slug}">affiliate page</a>
                            </div>
                        </div>
                    </div>
                    <div class="front--bottom">
                        <ul class="product__info">
                            <li class="product__info--item">
                                <i class="fa-solid product__icon icon ${product.type !== 'Digital' ? 'fa-truck-fast' : 'fa-file'}"></i>
                                <p>${product.type} Product</p>
                            </li>
                            <li class="product__info--item">
                                <i class="fa-solid fa-tools product__icon icon"></i>
                                <p>Affiliate tools</p>
                            </li>
                            <li class="product__info--item">
                                <i class="fa-solid fa-link product__icon icon"></i>
                                <p>Unique Link</p>
                            </li>
                            <li class="product__info--item">
                                <i class="fa-regular fa-square-check product__icon icon"></i>
                                <p>Approved</p>
                            </li>
                                ${product.recurringCommission ? '<li class="product__info--item"> <i class="fa-solid fa-rotate product__icon icon"></i>Recurring</li>' : ''}
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="product__side back">
                    <div class="link--box">
                        <h2 class="dashboard__heading">Generate HopLink</h2>
                        <p class="hoplink__text">Earn commission for every customer you refer to this product using your personalized affiliate hoplink.</p>
                        <form class="hoplink-form hoplink-mobile" data-productSlug-mobile="${product.slug}">
                            <div class="hoplink__body">
                                <input class="hoplink__input hoplink-username-mobile" type="text" value='${username}' placeholder="Username" required>
                                <p class="hoplink__body--text">Required</p>
                            </div>
                            <button class="btn hoplink__submit" type="submit">Generate Hoplink</button>
                        </form>
                    </div>
                </div>
            </figure>
        `;
        productBox.insertAdjacentHTML('beforeend', markup);
    });
};

// Event listener for the select element
if(selectElement) {
    selectElement.forEach(el => el.addEventListener('change', async(event) => {
        selectedOption = event.target.value;
        const requestingUser = event.target.dataset.user;
        console.log(selectedOption, 'i was clicked..')
        const products = await fetchProducts(selectedOption);
        displayProducts(products, requestingUser);
    }));
}


const chatBtn = document.querySelectorAll('.product__message');
chatBtn.forEach(el => el.addEventListener('click', function(e) {
    const clicked = this.closest('.product__message')
    if(clicked) {
        console.log('i was clicked to chat with this vendor', e.target, e.target.dataset.vendorId);
    }
    // console.log(clicked)
}))


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


// dashboard hoplink
const hoplinkOpen = document.querySelectorAll('.promote');
const hoplinkGetOverlay = document.querySelector('.get__overlay');
const hoplinkGetModal = document.querySelector('.get__modal');
const hoplinkClose = document.querySelector('.hoplink__icon');
const hoplinkModalCopyOk = document.querySelector('.btnModalOk');
const modalCopyButton = document.querySelector('.hoplink__modal-copy-button');
const hoplinkCopyOverlay = document.querySelector('.copy__overlay');
const hoplinkCopyModal = document.querySelector('.copy__modal');
const hoplinkCopyOk = document.querySelector('.btnOk');
const hoplinkText = document.querySelector('.hoplink__copy');
const copyButton = document.querySelector('.hoplink__copy-button');


const openCopyModal = function (link) {
    hoplinkText.textContent = link;
    openModal(hoplinkCopyOverlay, hoplinkCopyModal);
};

// dashboard Hoplink
const getHoplink = async function (username, productSlug) {
    try {
        showLoadingOverlay()
      const res = await fetch(`/api/promotion/generate-affiliate-link/${productSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
  
      if (!res.ok) {
        hideLoadingOverlay()
        throw new Error('Failed to generate affiliate link');
      }
  
      const data = await res.json();
  
      if (data.status === 'success' || data.message === 'Url already exist') {
        hideLoadingOverlay()
        showAlert('success', 'Link created');
        closeModal(hoplinkGetOverlay, hoplinkGetModal);
        openCopyModal(data.link);

        copyButton.addEventListener('click', function() {
            let text = hoplinkText.textContent;
            
            navigator.clipboard.writeText(text)
            .then(() => {
            // Optional: Update the button text to indicate successful copying
            copyButton.innerText = "Copied!";
            })
            .catch((error) => {
            console.error("Failed to copy text:", error);
            });
        })
      } else if (data.message === 'Enter a valid user...' || data.message === 'Please provide your username') {
          hideLoadingOverlay()
          showAlert('error', data.message);
        } else {
          hideLoadingOverlay()
          hoplinkCopyOverlay.classList.add('hidden');
          throw new Error('Invalid response from server');
        }
        
    } catch (err) {
        hideLoadingOverlay()
      showAlert('error', 'Something went wrong');
      console.error(err);
    }
};

  
if (hoplinkClose) {
    hoplinkClose.addEventListener('click', function () {
      closeModal(hoplinkGetOverlay, hoplinkGetModal);
    });
}
  
if (hoplinkModalCopyOk) {
    hoplinkModalCopyOk.addEventListener('click', () => {
      closeModal(hoplinkCopyOverlay, hoplinkCopyModal);
    });
}

let productSlug
if(hoplinkOpen) {
    hoplinkOpen.forEach(function(el) {
        el.addEventListener('click', function() {
            openModal(hoplinkGetOverlay, hoplinkGetModal);
            productSlug = el.dataset.productslug;
        });
    });
}


// modal hoplink
const modalHoplinkForm = document.querySelector('#hoplink');
if (modalHoplinkForm) {
    modalHoplinkForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const hoplinkUsername = document.querySelector('#hoplink-username').value;
    //   const hoplinkTrackId = document.querySelector('#hoplink-trackingid').value;
      
      getHoplink(hoplinkUsername, productSlug);
    });
}

// mobile hoplink
const mobileHoplinkForm = document.querySelector('.hoplink-mobile');
if (mobileHoplinkForm) {
    mobileHoplinkForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const hoplinkUsername = document.querySelector('.hoplink-username-mobile').value;
    //   const hoplinkTrackId = document.querySelector('#hoplink-trackingid').value;

      const productSlug = this.dataset.productslugMobile;
      getHoplink(hoplinkUsername, productSlug);
    });
}