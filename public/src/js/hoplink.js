
// // ALERTS
// const hideAlert = () => {
//     const el = document.querySelector('.alert');
//     if (el) el.parentElement.removeChild(el);
// };

// // type is 'success' or 'error'
// const showAlert = (type, msg) => {
//     hideAlert();
//     const markup = `<div class="alert alert--${type}">${msg}</div>`;
//     document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
//     window.setTimeout(hideAlert, 5000);
// };

// // MODALS
// const openModal = function(overlay, modal) {
//     overlay.classList.remove('hidden');
//     modal.classList.remove('hidden');
// }
// const closeModal = function(overlay, modal) {
//     overlay.classList.add('hidden');
//     modal.classList.add('hidden');
// }

// const hoplinkForm = document.querySelector('.hoplink-form');
// const hoplinkModalForm = document.querySelector('#hoplink');
// const hoplinkOpen = document.querySelectorAll('.promote');
// const hoplinkGetOverlay = document.querySelector('.get__overlay')
// const hoplinkGetModal = document.querySelector('.get__modal')
// const hoplinkClose = document.querySelector('.hoplink__icon');
// const hoplinkModalCopyOk = document.querySelector('.btnModalOk');
// const modalCopyButton = document.querySelector('.hoplink__modal-copy-button')


// let productSlug
// if(hoplinkOpen) {
//     hoplinkOpen.forEach(el => el.addEventListener('click', function() {
//         openModal(hoplinkGetOverlay, hoplinkGetModal);
//         productSlug = this.dataset.productSlug;
//         console.log(productSlug)
//     }));
// }

// const getModalHoplink = async function(username, trackingId, productSlug) {
//     try {
//         const res = await fetch(`/api/promotion/generate-affiliate-link/${productSlug}`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({username, trackingId}),
//         });

//         if(!res.ok) return;

//         const data = await res.json();


//         if(data.status === 'success' || data.message === 'Url already exist') {
//             showAlert('success', 'Link created');
//             closeModal(hoplinkGetOverlay, hoplinkGetModal);
//             hoplinkCopyOverlay.classList.toggle('hidden');
//             hoplinkText.textContent = data.link;
            
//             modalCopyButton.addEventListener('click', function() {
//                 let text = hoplinkText.textContent;
                
//                 navigator.clipboard.writeText(text)
//                 .then(() => {
//                 // Optional: Update the button text to indicate successful copying
//                 modalCopyButton.innerText = "Copied!";
//                 })
//                 .catch((error) => {
//                 console.error("Failed to copy text:", error);
//                 });
//             })
//         } else if(data.message === 'Enter a valid user...' || data.message === 'Please provide your username') {
//             hoplinkCopyOverlay.classList.add('hidden');
//             showAlert('error', data.message)
//         }
//     } catch (err) {
//         showAlert('error', 'Something Went Wrong')
//     }
// }

// if(hoplinkModalForm) {
//     hoplinkModalForm.addEventListener('submit', function(e) {
//         e.preventDefault();

//         const hoplinkUsername = document.querySelector('#hoplink-username').value;
//         const hoplinkTrackId = document.querySelector('#hoplink-trackingid').value;
//         getModalHoplink(hoplinkUsername, hoplinkTrackId, productSlug)
//     })
// }


// if(hoplinkClose) {
//     hoplinkClose.addEventListener('click', function() {
//         closeModal(hoplinkGetOverlay, hoplinkGetModal)
//     })
// }

// if(hoplinkModalCopyOk)
//     hoplinkModalCopyOk.addEventListener('click', () => {
//         closeModal(hoplinkCopyOverlay, hoplinkCopyModal);
//     })






// const hoplinkCopyOverlay = document.querySelector('.copy__overlay')
// const hoplinkCopyModal = document.querySelector('.copy__modal')
// const hoplinkCopyOk = document.querySelector('.btnOk');
// const hoplinkText = document.querySelector('.hoplink__copy')
// const copyButton = document.querySelector('.hoplink__copy-button')


// const getHoplink = async function(username, trackingId, productSlug) {
//     try {
//         const res = await fetch(`/api/promotion/generate-affiliate-link/${productSlug}`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({username, trackingId}),
//         });
//         if(!res) throw new Error('Error')
//         const data = await res.json();
//         console.log(res, data)

//         if(data.status === 'success' || data.message === 'Url already exist') {
//             showAlert('success', 'Link created');
//             hoplinkCopyOverlay.classList.toggle('hidden');
//             hoplinkText.textContent = data.link;
            
//             copyButton.addEventListener('click', function() {
//                 let text = hoplinkText.textContent;
                
//                 navigator.clipboard.writeText(text)
//                 .then(() => {
//                 // Optional: Update the button text to indicate successful copying
//                 copyButton.innerText = "Copied!";
//                 })
//                 .catch((error) => {
//                 console.error("Failed to copy text:", error);
//                 });
//             })
//         } else {
//             hoplinkCopyOverlay.classList.add('hidden');
//         }
//     } catch (err) {
//         showAlert('error', 'Something Went Wrong')
//     }
// }


// if(hoplinkForm) {
//     hoplinkForm.addEventListener('submit', function(e) {
//         e.preventDefault();
//         const hoplinkUsername = document.querySelector('.hoplink-username').value;
//         const hoplinkTrackId = document.querySelector('.hoplink-trackingid').value;
//         const param = window.location.pathname.split('/').at(-1)

//         console.log('submited', hoplinkUsername, hoplinkTrackId, param);
//        getHoplink(hoplinkUsername, hoplinkTrackId, param);
//     })
// }

// if(hoplinkCopyOk)
//     hoplinkCopyOk.addEventListener('click', () => {
//         closeModal(hoplinkCopyOverlay, hoplinkCopyModal);
//         location.reload(true);
//     })


// ALERTS
const hideAlert = () => {
    const alert = document.querySelector('.alert');
    if (alert) {
      alert.parentElement.removeChild(alert);
    }
};
  
const showAlert = (type, msg) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    setTimeout(hideAlert, 5000);
};
  
  // MODALS
const openModal = (overlay, modal) => {
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');
};
  
const closeModal = (overlay, modal) => {
    overlay.classList.add('hidden');
    modal.classList.add('hidden');
};
  
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
  

const getHoplink = async function (username, trackingId, productSlug) {
    try {
      const res = await fetch(`/api/promotion/generate-affiliate-link/${productSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, trackingId }),
      });
  
      if (!res.ok) {
        throw new Error('Failed to generate affiliate link');
      }
  
      const data = await res.json();
  
      if (data.status === 'success' || data.message === 'Url already exist') {
        showAlert('success', 'Link created');
        hoplinkCopyOverlay.classList.toggle('hidden');
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
        showAlert('error', data.message);
      } else {
        hoplinkCopyOverlay.classList.add('hidden');
        throw new Error('Invalid response from server');
      }

    } catch (err) {
      showAlert('error', 'Something went wrong');
      console.error(err);
    }
  };
  

if (hoplinkModalCopyOk) {
    hoplinkModalCopyOk.addEventListener('click', () => {
      closeModal(hoplinkCopyOverlay, hoplinkCopyModal);
    });
}
  
  

// this is for the Product page hoplink form
const hoplinkForm = document.querySelector('.hoplink-form');
if (hoplinkForm) {
    hoplinkForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const hoplinkUsername = document.querySelector('.hoplink-username').value;
      const hoplinkTrackId = document.querySelector('.hoplink-trackingid').value;
    //   const productSlug = window.location.pathname.split('/').pop();
      const productSlug = window.location.pathname.split('/').at(-1);
      getHoplink(hoplinkUsername, hoplinkTrackId, productSlug);
    });
}

  
if (hoplinkCopyOk) {
    hoplinkCopyOk.addEventListener('click', () => {
      closeModal(hoplinkCopyOverlay, hoplinkCopyModal);
      location.reload(true);
    });
}
  