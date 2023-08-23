console.log('payment and order js');

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
    console.log(orderAmount + charges + 'charges')
    return totalAmount = orderAmount + charges;
}

// ALERTS
const hideAlert = () => {
    const el = document.querySelector('.alert');
    if (el) el.parentElement.removeChild(el);
};
const showAlert = (type, msg) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
};


const payWithPaystack = function(price, quantity, email, sucMessage, errMessage) {

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
            showAlert('success', sucMessage);
            // Make an AJAX call to your server with the reference to verify the transaction
            await fetch(`/api/transactions/payment-verification/${reference}`);
        },
        onClose: function() {
            showAlert('error', errMessage);
        },
    });
    handler.openIframe();
}

const paymentForm = document.getElementById('order-checkout');
if(paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const price = Number(e.target.dataset.price);
        const quantity = Number(e.target.dataset.quantity);
        const email = document.getElementById('email').value;
        const sucMessage = 'Payment complete!';
        const errMessage = 'Transaction was not completed.';
        payWithPaystack(price, quantity, email, sucMessage, errMessage);
    });
}

const subscriptionUpgradeForm = document.getElementById('upgrade-checkout');
if(subscriptionUpgradeForm) {
    subscriptionUpgradeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const price = Number(e.target.dataset.price);
        const quantity = Number(e.target.dataset.quantity);
        const email = document.getElementById('email').value;
        const sucMessage = 'Payment complete!, Subscription done.';
        const errMessage = 'Transaction broke!.';
        payWithPaystack(price, quantity, email, sucMessage, errMessage);
    });
}
const onSignupSubscriptionUpgradeForm = document.getElementById('onSignup-upgrade-checkout');
if(onSignupSubscriptionUpgradeForm) {
    onSignupSubscriptionUpgradeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const price = Number(e.target.dataset.price);
        const quantity = Number(e.target.dataset.quantity);
        const email = document.getElementById('email').value;
        const sucMessage = 'Payment complete!, Subscription done.';
        const errMessage = 'Transaction broke!.';
        payWithPaystack(price, quantity, email, sucMessage, errMessage);
    });
}


/*
const payWithPaystack = function (e) {
    e.preventDefault();

    const price = document.querySelector('.product__price');
    const quantity = document.querySelector('.product__quantity');

    const amountInKobo = calcTotalAmount(price, quantity) * 100;

    var handler = PaystackPop.setup({
        key: 'pk_test_ec63f7d3f340612917fa775bde47924bb4a90af7',
        email: document.getElementById('email').value,
        amount: amountInKobo,
        currency: 'NGN',
        ref: ''+Math.floor((Math.random() * 1000000000) + 1),
        callback: async function(response) {
            //this happens after the payment is completed successfully
            var reference = response.reference;
            alert('Payment complete! Reference: ' + reference);
            // Make an AJAX call to your server with the reference to verify the transaction
            const res = await fetch(`/api/order/payment-verification/${reference}`)
            const data = await res.json();
            console.log(res, data);
        },
        onClose: function() {
            alert('Transaction was not completed, window closed.');
        },
    });
    handler.openIframe();
}
const paymentForm = document.getElementById('order-checkout');
if(paymentForm) {
    paymentForm.addEventListener('submit', payWithPaystack);
}
*/