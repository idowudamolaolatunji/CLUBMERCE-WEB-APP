console.log('====== PAYSTACK PAYMENT =======');
// console.log(document.cookie)

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

const checkoutOverlay = document.querySelector('.checkout__overlay');

const payWithPaystack = function(price, quantity, email, sucMessage, errMessage, type) {

    const amountInKobo = calcTotalAmount(price, quantity) * 100;
    var handler = PaystackPop.setup({
        key: 'pk_test_ec63f7d3f340612917fa775bde47924bb4a90af7',
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
            // window.location.reload();
            if(type === 'order') {
                await fetch(`/api/orders/payment-verification/${reference}`);
            } else if(type === 'subscription') {
                await fetch(`/api/subscribe/payment-verification/${reference}`);
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
        const { plan, price, amount, text } = e.target.dataset;
        subAmount = amount;
        if(checkoutOverlay.classList.contains('hidden')) checkoutOverlay.classList.remove('hidden');
        document.querySelector('.product__name').textContent = plan + ' account';
        document.querySelector('.product__price').textContent = price;
        document.querySelector('.product__summary').textContent = text;
    })
})
// order page
document.querySelectorAll('.card-button').forEach((button) => {
    button.addEventListener('click', function(e) {
        const quantity = document.getElementById('quantityNumber').textContent;
        console.log(quantity);

        localStorage.setItem('quantity', quantity);

        // Set the attribute on all elements with the class 'shopping-cart'
        document.querySelectorAll('.shopping-cart').forEach(el => el.setAttribute('data-digits', localStorage.getItem('quantity')));
    })
})
// cart checkout
document.querySelectorAll('.order__checkout--button').forEach((button) => {
    button.addEventListener('click', function(e) {
        if(checkoutOverlay.classList.contains('hidden')) checkoutOverlay.classList.remove('hidden');
    })
})

const closeCheckout = document.querySelector('.close__checkout');
if(closeCheckout) {
    closeCheckout.addEventListener('click', function(e) {
        checkoutOverlay.classList.add('hidden');
    });
}




const orderPaymentForm = document.getElementById('order-checkout');
if(orderPaymentForm) {
    orderPaymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const price = Number(e.target.dataset.price);
        const quantity = Number(e.target.dataset.quantity);
        const email = document.getElementById('email').value;
        const sucMessage = 'Payment complete!';
        const errMessage = 'Transaction was not completed.';


        const user = JSON.parse(e.target.dataset.user);
        payWithPaystack(price, quantity, email, sucMessage, errMessage, 'order');
    });
}

const subscriptionUpgradeForm = document.getElementById('upgrade-checkout');
if(subscriptionUpgradeForm) {
    subscriptionUpgradeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const price = Number(subAmount);
        const quantity = Number(e.target.dataset.quantity);
        const email = document.getElementById('email').value;
        const sucMessage = 'Payment complete!, Subscription done.';
        const errMessage = 'Transaction broke!.';

        const user = JSON.parse(e.target.dataset.user);
        // if(email !== user.email || fullname !== user.fullName) {
        if(email !== user.email ) {
            showAlert('error', 'Enter correct email or full name');
            return;
       } else {
            console.log(price, quantity, email, sucMessage, errMessage, 'subscription', user)
            payWithPaystack(price, quantity, email, sucMessage, errMessage, 'subscription', user);
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
        const sucMessage = 'Payment complete!, Subscription done.';
        const errMessage = 'Transaction broke!.';

        const user = JSON.parse(e.target.dataset.user);
        if(email !== user.email || fullname !== user.fullName) {
             showAlert('error', 'Enter correct email or full name');
             return;
        } else {
            console.log(price, quantity, email, sucMessage, errMessage, 'subscription', user)
            payWithPaystack(price, quantity, email, sucMessage, errMessage, 'subscription');
        }
    });
}

