'use strict';

const hoplinkForm = document.querySelector('.hoplink-form');
const hoplinkOpen = document.querySelectorAll('.promote');
const hoplinkGetOverlay = document.querySelector('.get__overlay')
const hoplinkGetModal = document.querySelector('.get__modal')
const hoplinkClose = document.querySelector('.hoplink__icon');


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

// MODALS
const openModal = function(overlay, modal) {
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');
}
const closeModal = function(overlay, modal) {
    overlay.classList.add('hidden');
    modal.classList.add('hidden');
}

const hoplinkCopyOverlay = document.querySelector('.copy__overlay')
const hoplinkCopyModal = document.querySelector('.copy__modal')
const hoplinkCopyOk = document.querySelector('.btnOk');
const hoplinkText = document.querySelector('.hoplink__copy')
const copyButton = document.querySelector('.hoplink__copy-button')


hoplinkCopyOk.addEventListener('click', () => {
    closeModal(hoplinkCopyOverlay, hoplinkCopyModal);
    location.reload(true);
})


if(hoplinkOpen) {
    hoplinkOpen.forEach(el =>
        el.addEventListener('click', () => {
            openModal(hoplinkGetOverlay, hoplinkGetModal);
        })
    );
}


const getHoplink = async function(username, trackingId, productSlug) {
    try {
        const res = await fetch(`/api/promotion/generate-affiliate-link/${productSlug}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username, trackingId}),
        });
        if(!res) throw new Error('Error')
        const data = await res.json();
        console.log(res, data)

        if(data.status === 'success' || data.message === 'Url already exist') {
            showAlert('success', 'Link created');
            hoplinkCopyOverlay.classList.toggle('hidden');
            hoplinkText.textContent = data.link;
            
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
        } else {
            hoplinkCopyOverlay.classList.add('hidden');
        }
    } catch (err) {
        showAlert('error', 'Something Went Wrong')
    }
}


if(hoplinkForm) {
    hoplinkForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const hoplinkUsername = document.querySelector('.hoplink-username').value;
        const hoplinkTrackId = document.querySelector('.hoplink-trackingid').value;
        const param = window.location.pathname.split('/').at(-1)

        console.log('submited', hoplinkUsername, hoplinkTrackId, param);
       getHoplink(hoplinkUsername, hoplinkTrackId, param);
    })
}



if(hoplinkClose) {
    hoplinkClose.addEventListener('click', () => {
        closeModal(hoplinkGetOverlay, hoplinkGetModal);
        console.log('close me...')
    })
}


