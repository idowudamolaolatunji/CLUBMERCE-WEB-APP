const deliveredOrderBtn = document.querySelectorAll(".delivered__order");
const completedOrderBtn = document.querySelectorAll(".recieved__order");

// const showLoadingOverlay = () => {
//     spinOverlay.style.visibility = 'visible';
// };
// const hideLoadingOverlay = () => {
//     spinOverlay.style.visibility = 'hidden';
// };
// const hideAlert = () => {
//     const el = document.querySelector('.alert');
//     if (el) el.parentElement.removeChild(el);
// };

// const showAlert = (type, msg) => {
//     hideAlert();
//     const markup = `
//          <div class="alert alert--${type}">
//               ${msg}&nbsp;
//               <picture>
//                    <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/${type === 'error' ? '1f61f' : '2728'}/512.webp" type="image/webp">
//                    <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/${type === 'error' ? '1f61f/512.gif" alt="😟"' : '2728/512.gif" alt="✨"'} width="32" height="32">
//               </picture>
//          </div>`;
//     document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
//     setTimeout(hideAlert, 5000);
// };



const completeOrder = async function(orderId, type) {
    try {
        let url;
        if(type === 'recieved') {
            url = `/api/orders/recieved-order/${orderId}`
        } else if(type === 'delivered') {
            url = `/api/orders/delivered-order/${orderId}`
        }
        showLoadingOverlay();
        const res = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        if(data.status === 'success') {
            showAlert('success', data.message);

            window.setTimeout(() => {
                window.location.reload(true);
            }, 1500);
        } else {
            hideLoadingOverlay();
            showAlert('error', error.message);
        }
        // console.log(data);


    } catch(err) {
        console.log(err);
    }
};


if(completedOrderBtn) {
    completedOrderBtn.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const buyerOrderId = e.target.dataset.buyerorderid;
            console.log(buyerOrderId);
            completeOrder(buyerOrderId, 'recieved');
        });
    });
};


if(deliveredOrderBtn) {
    deliveredOrderBtn.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const vendorOrderId = e.target.dataset.vendororderid;
            console.log(vendorOrderId);
            completeOrder(vendorOrderId, 'delivered');
        });
    });
};