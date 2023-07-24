/*
const searchForm = document.querySelector('.nav__search');
const searchResults = document.getElementById('search-result')
console.log('i am connected')


searchForm.addEventListener('keyup', function(e) {
    e.preventDefault();
    const searchInput = document.querySelector('.nav__input');

    
    if(matchNotAccepted[0] === searchInput.value) {
        searchResults.innerHTML = '';
        return;
    }

    if(searchInput.value !== '') {
        fetch('/api/products/search-product', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({payload: searchInput.value}),
        }).then(res => res.json()).then(data => {
            const {payload} = data;
            console.log(payload);
            searchResults.innerHTML = '';
            let markup;

            
            if(searchInput.value === '' || searchInput.value === ' ') {
                searchResults.innerHTML = '';
                searchResults.style.backgroundColor = 'transparent';
                searchResults.style.boxShadow = 'none'
                return;
            }
            if(payload.length < 1) {
                searchResults.innerHTML = '<p>No result found</p>';
                searchResults.style.boxShadow = '0 1rem 4rem rgba(0, 0, 0, 0.15)'
                return;
            }
            payload.forEach((el, i) => {
                console.log(el)
                searchResults.innerHTML = '';
                markup += `<a href="/">${el.name}</a>`;
              
                searchResults.style.backgroundColor = '#fff'
                searchResults.style.boxShadow = '0 1rem 4rem rgba(0, 0, 0, 0.15)'
            })
            if(this.blur()) {
                searchResults.style.backgroundColor = 'transparent';
                searchResults.style.boxShadow = 'none'
            } 
              // Insert the markup into the searchResults div parent container
              searchResults.insertAdjacentHTML('beforeend', markup);

        }).catch(err => console.log(err));
    }
})
*/
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

  fetch('/api/products/search-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payload: searchTerm }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((data) => {
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
      searchResults.classList.remove('hidden')
      searchResults.innerHTML = '';
      searchResults.insertAdjacentHTML('beforeend', markup);

      searchResults.style.backgroundColor = '#fff';
      searchResults.style.boxShadow = '0 1rem 4rem rgba(0, 0, 0, 0.15)';
      

      document.querySelector('.section__dashboard').addEventListener('click', function() {
        searchResults.classList.add('hidden')
      })
    })
    .catch((err) => console.error(err));
});


const categoryList = document.querySelector('.catergory__list');
const productBox = document.querySelector('.products__cards--box');
const spinOverlay = document.querySelector('#spinOverlay');


// Function to fetch products based on the selected category
const fetchProductsByCategory = async (category) => {
    try {
        // Show the spinner overlay
        // spinOverlay.style.visibility = "visible";
    
        const response = await fetch(`/api/products/${category}`);
        const data = await response.json();
        console.log(response, data)
    
        // Clear the product container
        productBox.innerHTML = '';
    
        // Hide the spinner overlay
        // spinOverlay.style.visibility = 'hidden';
    
        // Display the products for the selected category
        data.products.forEach(product => {
            console.log(product)
            const markup = `
                <div class="product__card">
                    <div class="product__side--left">   
                        <div class="side--top">
                            <div class="product__image--container">
                                <img class="product__image" src="../../asset/img/product.jpg"/></div>
                            <div class="product__heading"> 
                                <h2 class="product__title"></h2>
                                <p class="product__niche"></p>
                                <div class="product__content">
                                    <h4 class="product__description"></h4>
                                </div>
                            </div>
                        </div>
                        <div class="side--bottom">
                            <ul class="product__info">
                                <li class="product__info--item"> <i class="fa-solid fa-truck-fast product__icon icon"></i>Digital Product</li>
                                <li class="product__info--item"> <i class="fa-solid fa-tools product__icon icon"></i>Affiliate tools</li>
                                <li class="product__info--item"> <i class="fa-solid fa-link product__icon icon"></i>Unique Link</li>
                                <li class="product__info--item"> <i class="fa-regular fa-square-check product__icon icon"></i>Approved</li>
                                <li class="product__info--item"> <i class="fa-solid fa-rotate product__icon icon"></i>Recurring</li>
                            </ul>
                        </div>
                    </div>
                    <div class="product__side--right"><span class="product__commission">
                        <p class="commision"></p><span class="commission__amount"></span></span><a class="btn product__button promote">Promote</a><a class="product__button page">affiliate page</a>
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
        productBox.innerHTML = '<p>No product found..</p>';
    }
};
  
  // Attach click event to each category item
categoryList.addEventListener('click', (event) => {
    const selectedCategory = event.target.dataset.item.toLowerCase();
    console.log(selectedCategory)
    if (selectedCategory) {
      fetchProductsByCategory(selectedCategory);
    }
});


const selectElement = document.getElementById('select');
const productContainer = document.querySelector('.products__cards--box');

// Function to fetch products based on the selected option
const fetchProducts = async (option) => {
  try {
    const response = await fetch(`/api/products?option=${option}`);
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};


// Function to display products in the product__container
const displayProducts = (products) => {
    // Clear previous products
    productContainer.innerHTML = '';

    // Display each product in the product__container
    products.forEach((product) => {
        const markup = `
            <div class="product__card">
                <div class="product__side--left">   
                    <div class="side--top">
                        <div class="product__image--container">
                            <img class="product__image" src="../../asset/img/product.jpg"/></div>
                        <div class="product__heading"> 
                            <h2 class="product__title"></h2>
                            <p class="product__niche"></p>
                            <div class="product__content">
                                <h4 class="product__description"></h4>
                            </div>
                        </div>
                    </div>
                    <div class="side--bottom">
                        <ul class="product__info">
                            <li class="product__info--item"> <i class="fa-solid fa-truck-fast product__icon icon"></i>Digital Product</li>
                            <li class="product__info--item"> <i class="fa-solid fa-tools product__icon icon"></i>Affiliate tools</li>
                            <li class="product__info--item"> <i class="fa-solid fa-link product__icon icon"></i>Unique Link</li>
                            <li class="product__info--item"> <i class="fa-regular fa-square-check product__icon icon"></i>Approved</li>
                            <li class="product__info--item"> <i class="fa-solid fa-rotate product__icon icon"></i>Recurring</li>
                        </ul>
                    </div>
                </div>
                <div class="product__side--right"><span class="product__commission">
                    <p class="commision"></p><span class="commission__amount"></span></span><a class="btn product__button promote">Promote</a><a class="product__button page">affiliate page</a>
                </div>
            </div>
        `;
        productBox.insertAdjacentHTML('beforeend', markup);
    });
};

// Event listener for the select element
selectElement.addEventListener('change', async (event) => {
  const selectedOption = event.target.value;
  const products = await fetchProducts(selectedOption);
  displayProducts(products);
});
