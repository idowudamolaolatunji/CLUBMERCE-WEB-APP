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
const getHoplink = async function (username, trackingId, productSlug) {
    try {
        showLoadingOverlay()
      const res = await fetch(`/api/promotion/generate-affiliate-link/${productSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, trackingId }),
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
