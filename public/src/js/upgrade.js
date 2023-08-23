


var paymentForm = document.getElementById('upgrade-checkout');
paymentForm.addEventListener('submit', payWithPaystack, false);
function payWithPaystack() {
  var handler = PaystackPop.setup({
    key: 'pk_test_ec63f7d3f340612917fa775bde47924bb4a90af7',
    email: document.getElementById('email').value,
    amount: document.getElementById('amount').value * 100,
    currency: 'NGN',
    callback: async function(response) {
      //this happens after the payment is completed successfully
      var reference = response.reference;
      alert('Payment complete! Reference: ' + reference);
      // Make an AJAX call to your server with the reference to verify the transaction
      const res = await fetch('/api/')
    },
    onClose: function() {
      alert('Transaction was not completed, window closed.');
    },
  });
  handler.openIframe();
}