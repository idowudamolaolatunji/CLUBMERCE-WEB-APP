// console.log('====== PAYSTACK PAYMENT =======');

const calcTotalAmount = function(price, quantity ) {
    // Calculate the total amount for the order
    let charges;
    const orderAmount = price * quantity;
    const calcChargesAmount = 3 / 100 * orderAmount

    if(calcChargesAmount > 3000) {
        charges = 3000
    } else {
        charges = calcChargesAmount;
    }
    return totalAmount = orderAmount + charges;
}

document.querySelectorAll('a').forEach(el => el.addEventListener('click', function(e) {
    showLoadingOverlay();
    window.setTimeout(() => {
        hideLoadingOverlay();
    }, 7000);
}));

const successFunction = function(text) {
    const markup = `
        <div class="checkout__overlay">
            <div class="modal-success">
                <picture>
                    <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.webp" type="image/webp">
                    <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif" alt="🎉" width="32" height="32">
                </picture>
                <h3 class="extra__heading">${text}</h3>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', markup)
    setTimeout(() => {
        document.body.remove(markup)
        window.location.reload(true);
    }, 2500)
}

const checkoutOverlay = document.querySelector('.checkout__overlay');

const payWithPaystack = function(price, _, email, sucMessage, errMessage, type, productsArr) {

    const amountInKobo = calcTotalAmount(price, 1) * 100;
    var handler = PaystackPop.setup({
        key: 'pk_live_34cf0528cd04ac9d4f4675db08bf427bfa1509ad',
        // key: 'pk_test_ec63f7d3f340612917fa775bde47924bb4a90af7',
        email: email,
        amount: amountInKobo,
        currency: 'NGN',
        ref: ''+Math.floor((Math.random() * 1000000000) + 1),
        callback: async function(response) {
            //this happens after the payment is completed successfully
            var reference = response.reference;
            if(response.reference === errMessage) {
                showAlert('error', errMessage)
            }
            showAlert('success', sucMessage);
            // Make an AJAX call to your server with the reference to verify the transaction
            if(!checkoutOverlay.classList.contains('hidden')) checkoutOverlay.classList.add('hidden');
            if(type === 'order') {
                
                const res = await fetch(`/api/orders/payment-verification/${reference}`, {
                    headers: {
                        'Custom-Header': JSON.stringify(productsArr)
                    },
                });
                const data = await res.json();
                if(data && data.status === 'success') {
                    successFunction('Order Successful!');
                    // Remove the item from localStorage
                    localStorage.removeItem('cartData');
                } else {
                    showAlert('error', 'Something went wrong!')
                    return;
                }

            } else if(type === 'subscription') {
                const res = await fetch(`/api/subscribe/payment-verification/${reference}`);
                const data = await res.json();

                if(data && data.status === 'success') {
                    successFunction('Upgrade Successful!')
                } else {
                    showAlert('error', 'Something went wrong!')
                    return;
                }
            }
        },
        onClose: function() {
            showAlert('error', errMessage);
        },
    });
    handler.openIframe();
}


// subscribe page
let subAmount;
document.querySelectorAll('.checkout__button').forEach((button) => {
    button.addEventListener('click', function(e) {
        showLoadingOverlay();
        const { plan, price, amount, text } = e.target.dataset;
        subAmount = amount;
        window.setTimeout(() => {
            hideLoadingOverlay();
            if(checkoutOverlay.classList.contains('hidden')) checkoutOverlay.classList.remove('hidden');
            document.querySelector('.product__name').textContent = plan + ' account';
            document.querySelector('.product__price').textContent = price;
            document.querySelector('.product__summary').textContent = text;
        }, 1000)
    })
})

// Set the attribute on all elements with the class 'shopping-cart'
const cart = document.querySelector('.shopping-cart');

// order page
// document.querySelectorAll('.card-button').forEach((button) => {
//     button.addEventListener('click', function(e) {
//         const quantityAmount = document.getElementById('quantityNumber').textContent;
//         const productDetails = JSON.parse(e.target.dataset.product);
//         const storageProductItems = [];
//         storageProductItems.push(productDetails);
//         let cartCount = 1;

//         const cartObj = { cartCount, storageProductItems};
//         localStorage.setItem('cartObj', JSON.stringify(cartObj));

//         const cartStorage = JSON.parse(localStorage.getItem('cartObj'));
//         // const products = cartStorage.storedProduct;
//         const quantity = cartStorage.cartCount;

//         if(!cartStorage) return;
//         else cart.setAttribute('data-digits', quantity);
        

//         const markup = `
//             <div class="checkout--card" data-name="${productDetails.name}">
//                 <div class="checkout--card__image">
//                     <img src="/asset/img/products/${productDetails.image}" alt="product image">
//                 </div>
//                 <div class="checkout--card__info">
//                     <p class="checkout--card__product-name">${productDetails.name}</p>
//                     <span class="checkout--card__figures">
//                         <p class="checkout--card__product-quantity">${quantityAmount} x</p>
//                         <p class="checkout--card__product-price">₦${+productDetails.price * +quantityAmount}</p>
//                     </span>
//                 </div>
//                 <i class="fa-solid fa-close icon delete-cart" data-id="${productDetails.id}"></i>
//             </div>
//         `;

//         const checkoutBox = document.querySelector('.checkout__box');
//         // Check if the product already exists in the cart
//         const existingProduct = checkoutBox.querySelector(`[data-name="${productDetails.name}"]`);

//         if (existingProduct) {
//             // Product already exists, update the quantity
//             const existingQuantityEl = existingProduct.querySelector('.checkout--card__product-quantity');
//             const existingPriceEl = existingProduct.querySelector('.checkout--card__product-price');
//             const newQuantity = quantityAmount;
//             const newPrice = +newQuantity * +productDetails.price;
//             existingQuantityEl.textContent = `${newQuantity} x`;
//             existingPriceEl.textContent = `₦${newPrice}`
//         } else {
//             // Product doesn't exist, insert the new item
//             checkoutBox.insertAdjacentHTML('beforeend', markup);
//         }
//         let priceArr = []
//         document.querySelectorAll('.checkout--card__product-price').forEach(price => {
//             priceArr.push(Number(price.textContent.slice(1)))
//         })
//         const sumTotal = priceArr.reduce((cur, i) => cur + i, 0);
//         document.querySelector('.total-checkout').textContent = `₦${sumTotal}`
//     });
// });

// document.querySelectorAll('.delete-cart').forEach(closeBtn => {
//     closeBtn.addEventListener('click', function(e) {
//         const cartItemId = e.target.dataset.id;
//         console.log(cartItemId, 'me')
//     })
// })



// adds to cart

document.querySelectorAll('.card-button').forEach((button) => {
    button.addEventListener('click', function(e) {
        const quantityAmount = document.getElementById('quantityNumber').textContent;
        const productDetails = JSON.parse(e.target.dataset.product);

        // Retrieve cart data from localStorage or initialize if empty
        let cartData = JSON.parse(localStorage.getItem('cartData')) || { cartCount: 0, storageProductItems: [] };

        // Check if the product already exists in the cart
        const existingProductIndex = cartData.storageProductItems.findIndex(item => item.name === productDetails.name);

        
        if (existingProductIndex !== -1) {
            // Product already exists, update the quantity and price
            cartData.storageProductItems[existingProductIndex].quantity = parseInt(quantityAmount);
            cartData.storageProductItems[existingProductIndex].price = parseInt(quantityAmount) * productDetails.price;
            showAlert('success', 'Updating cart item!');
            showLoadingOverlay();
            location.reload(true);
        } else {
            // Product doesn't exist, add it to the cart
            cartData.storageProductItems.push({
                name: productDetails.name,
                quantity: parseInt(quantityAmount),
                price: parseInt(quantityAmount) * productDetails.price,
                link: window.location.href,
                id: productDetails._id,
                niche: productDetails.niche,
                image: productDetails.image
            });
            showAlert('success', 'Adding item to cart!');
            showLoadingOverlay();
            location.reload(true);
        }

        // Update cart count and store data back in localStorage
        cartData.cartCount = cartData.storageProductItems.length;
        localStorage.setItem('cartData', JSON.stringify(cartData));

        // Update the cart count attribute
        cart.setAttribute('data-digits', cartData.cartCount || 0);
        document.querySelector('.dashboard-cart').textContent = cartData.cartCount || 0;
        displayCartItem()
    });
});

// displays cart
let productsArr = [];
function displayCartItem() {
    const cartStorage = JSON.parse(localStorage.getItem('cartData'));
    const checkoutBox = document.querySelector('.checkout__box');
    // <img src="/../asset/img/products/${product.image}" alt="product image">
    if(cartStorage && cartStorage.storageProductItems) {
        if(checkoutBox) checkoutBox.innerHTML = '';
        
        cartStorage?.storageProductItems?.forEach(product => {
            productsArr.push(product);
            const markup = `
                <a style="color: #333; text-decoration: none;" href="${product.link}">
                    <div class="checkout--card" data-name="${product.name}">
                        <div class="checkout--card__image"></div>
                        <div class="checkout--card__info">
                            <p class="checkout--card__product-name">${product.name}</p>
                            <span class="checkout--card__figures">
                                <p class="checkout--card__product-quantity">${product.quantity} x</p>
                                <p class="checkout--card__product-price">₦${product.price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                            </span>
                        </div>
                        <i class="fa-solid fa-close icon delete-cart" data-id="${product.id}"></i>
                    </div>
                </a>
            `;
            if(checkoutBox) checkoutBox.insertAdjacentHTML('beforeend', markup);
        });
        
        // Calculate and display the total price
        let prices = cartStorage?.storageProductItems?.map(product => product.price);
        const sumTotal = prices.reduce((cur, i) => cur + i, 0);
        if(document.querySelector('.total-checkout')) {
            document.querySelector('.total-checkout').textContent = `₦${sumTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        }
    } else {
        const markup = `<p>No item in your cart!</p>`
        if(checkoutBox) {
            checkoutBox.innerHTML = '';
            checkoutBox.insertAdjacentHTML('beforeend', markup);
        }
    }
}
displayCartItem();


// deletes items from cart
if(document.querySelectorAll('.delete-cart')) {
    document.querySelectorAll('.delete-cart').forEach(closeBtn => {
        closeBtn.addEventListener('click', function(e) {
            console.log('i was clicked')
            const cartItemId = e.target.dataset.id;

            // Retrieve cart data from localStorage
            let cartData = JSON.parse(localStorage.getItem('cartData'));
            cartData.storageProductItems = cartData.storageProductItems.filter(item => item.id !== cartItemId);

            // Update cart count and store data back in localStorage and count
            cartData.cartCount = cartData.storageProductItems.length;
            localStorage.setItem('cartData', JSON.stringify(cartData));
            cart.setAttribute('data-digits', cartData.cartCount || 0);
            document.querySelector('.dashboard-cart').textContent = cartData.cartCount || 0;


            // Remove the deleted item's HTML element from the cart UI
            displayCartItem();
            showAlert('success', 'Deleting cart item!');
            showLoadingOverlay();
            location.reload(true);

            // Recalculate and display the total price
            const allPrices = cartData.storageProductItems.map(product => product.price);
            const sumTotal = allPrices.reduce((cur, price) => cur + price, 0);
            document.querySelector('.total-checkout').textContent = `₦${sumTotal.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        });
    });
}


// cart checkout
let sumTotals;
document.querySelectorAll('.order__checkout--button').forEach((button) => {
    button.addEventListener('click', function(e) {
        sumTotals = Number(document.querySelector('.total-checkout').textContent.slice(1).replace(/,/g, ''));
        document.querySelector('.sumTotal').textContent = `₦${Number(sumTotals).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        
        const isLoggedIn = e.target.dataset.token;
        console.log(isLoggedIn)
        if(!isLoggedIn) {
            showLoadingOverlay();
            showAlert('error', 'You are not logged in!')
            window.location.assign('/buyers/login');
        }
        if(isLoggedIn && sumTotals > 1000 && window.location.href.includes('/order-product/')) {
            showLoadingOverlay();
            showAlert('error', 'Only make orders through dashboard')
            window.location.assign('/buyers/dashboard');
        }
        
        const cartStorage = JSON.parse(localStorage.getItem('cartData'));
        const container = document.querySelector('.checkout__info--box');
        
        if(cartStorage && cartStorage.storageProductItems && sumTotals > 500) {
            if(container) container.innerHTML = '';

            cartStorage.storageProductItems.forEach(item => {
                console.log(item)
                const markup = `
                    <span class="checkout__info">
                        <span>
                            <p class="product__name">${item.name}</p>
                            <p class="product__price">₦${(item.price / item.quantity).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                        </span>
                        <span>
                            <p class="product__summary">${item.niche}</p>
                            <p class="product__quantity">x${item.quantity}</p>
                        </span>
                    </span>
                `;
                if(container) container.insertAdjacentHTML('afterbegin', markup);
            })
        }
        if(!window.location.href.includes('/buyers/order-product') && sumTotals > 500) {
            showLoadingOverlay();
            const cart = document.querySelector('.shopping__cart');
            if(!cart.classList.contains('hidden')) cart.classList.add('hidden');
            window.setTimeout(() => {
                hideLoadingOverlay();
                if(checkoutOverlay.classList.contains('hidden')) checkoutOverlay.classList.remove('hidden');
            }, 1000)
        } else if (sumTotals < 500) {
            showAlert('error', 'No item in cart')
        }
    })
})

const closeCheckout = document.querySelector('.close__checkout');
if(closeCheckout) {
    closeCheckout.addEventListener('click', function(e) {
        checkoutOverlay.classList.add('hidden');
    });
}

// order form
const orderPaymentForm = document.getElementById('order-checkout');
if(orderPaymentForm) {
    orderPaymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const price = Number(sumTotals);
        const storedInfo = JSON.parse(localStorage.getItem('cartData'));
        const email = document.getElementById('email').value;
        const sucMessage = 'Payment Processing...';
        const errMessage = 'Transaction was not completed.';


        const user = JSON.parse(e.target.dataset.user);
        if(email !== user.email) {
            showAlert('error', 'Enter correct email');
            return;
        } else {
            payWithPaystack(price, storedInfo, email, sucMessage, errMessage, 'order', productsArr);
        }
    });
}


// vendor subscription forms
const subscriptionUpgradeForm = document.getElementById('upgrade-checkout');
if(subscriptionUpgradeForm) {
    subscriptionUpgradeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const price = Number(subAmount);
        const quantity = Number(e.target.dataset.quantity);
        const email = document.getElementById('email').value;
        const sucMessage = 'Payment Processing...';
        const errMessage = 'Transaction broke!.';

        const user = JSON.parse(e.target.dataset.user);
        if(email !== user.email || !fullname) {
        // if(email !== user.email ) {
            showAlert('error', 'Enter correct email or full name');
            return;
        } else {
            payWithPaystack(price, quantity, email, sucMessage, errMessage, 'subscription');
        }
    });
}
const onSignupSubscriptionUpgradeForm = document.getElementById('onSignup-upgrade-checkout');
if(onSignupSubscriptionUpgradeForm) {
    onSignupSubscriptionUpgradeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const price = Number(e.target.dataset.price);
        const quantity = Number(e.target.dataset.quantity);
        const email = document.getElementById('email').value;
        const fullname = document.getElementById('fullname').value;
        const sucMessage = 'Payment Processing...';
        const errMessage = 'Transaction broke!.';

        const user = JSON.parse(e.target.dataset.user);
        if(email !== user.email || !fullname) {
             showAlert('error', 'Enter correct email or full name');
             return;
        } else {
            payWithPaystack(price, quantity, email, sucMessage, errMessage, 'subscription');
        }
    });
}

