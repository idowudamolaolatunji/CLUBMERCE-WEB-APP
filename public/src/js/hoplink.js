
const spinOverlay = document.querySelector('#spinOverlay');

const showLoadingOverlay = () => {
    spinOverlay.style.visibility = 'visible';
};
const hideLoadingOverlay = () => {
    spinOverlay.style.visibility = 'hidden';
};

document.addEventListener("DOMContentLoaded", function() {
    showLoadingOverlay();
});
window.addEventListener("load", function() {
    hideLoadingOverlay()
});

// ALERTS
const hideAlert = () => {
    const alert = document.querySelector('.alert');
    if (alert) {
      alert.parentElement.removeChild(alert);
    }
};
  
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
      showLoadingOverlay();

      const res = await fetch(`/api/promotion/generate-affiliate-link/${productSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, trackingId }),
      });
  
      if (!res.ok) {
        hideLoadingOverlay();
        throw new Error('Failed to generate affiliate link');
      }
  
      const data = await res.json();
  
      if (data.status === 'success' || data.message === 'Url already exist') {
        showAlert('success', 'Link created');
        hoplinkCopyOverlay.classList.toggle('hidden');
        openCopyModal(data.link);
        hideLoadingOverlay();

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
        hideLoadingOverlay();
      } else {
        hoplinkCopyOverlay.classList.add('hidden');
        hideLoadingOverlay();
        throw new Error('Invalid response from server');
      }

    } catch (err) {
      showAlert('error', 'Something went wrong');
      hideLoadingOverlay();
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
    //   const hoplinkTrackId = document.querySelector('#hoplink-trackingid').value;
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
  