console.log('i see u affiliate')

const signupForm = document.querySelector('.signup');

const showLoadingOverlay = () => {
  spinOverlay.style.visibility = 'visible';
};
const hideLoadingOverlay = () => {
  spinOverlay.style.visibility = 'hidden';
};

// ALERTS
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
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

const showEmailVerificationModal = (email) => {
    const modalContainer = document.querySelector('.email__drop-down');
    const emailSpan = modalContainer.querySelector('.user__email');
    emailSpan.textContent = `@${email.toLowerCase()}`;
    modalContainer.classList.remove('hidden');
};
  
const closeEmailVerificationModal = () => {
    const modalContainer = document.querySelector('.email__drop-down');
    modalContainer.classList.add('hidden');
//     location.assign('/login');
    location.reload(true);
};
  
const closeButton = document.querySelector('.verify__close--icon');
if (closeButton) {
    closeButton.addEventListener('click', closeEmailVerificationModal);
}
  

// signup
const signup = async (fullName, email, role, password, passwordConfirm, username, country, phone) => {
  try {
    if(role === 'vendor' || role === 'admin' || role === 'buyer') return;
    showLoadingOverlay();

    const res = await fetch('/api/users/signup-affiliate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, email, role, password, passwordConfirm, username, country, phone }),
    });

    if (!res.ok) {
      throw new Error('Error signing up');
    }

    const data = await res.json();
    if(data.message === 'Email already Exist') {
      showAlert('error', data.message);
      hideLoadingOverlay();
    }
    if(data.message === 'Username already Exist') {
      showAlert('error', data.message);
      hideLoadingOverlay();
    }
    if (data.status === 'success') {
      showAlert('success', data.message || 'Successful');
      showEmailVerificationModal(email);
    } else if (data.status === 'fail') {
      throw new Error(data.message || 'Error signing up');
    }
  } catch (err) {
      showAlert('error', err.message || 'Something went wrong. Please try again!');
  } finally {
    hideLoadingOverlay();
  }
};
// email confirmation
const showEmailConfirmationModal = () => {
     const modalContainer = document.querySelector('.email-confirmed__modal');
     modalContainer.classList.remove('hidden');
};
const closeEmailConfirmationModal = () => {
     const modalContainer = document.querySelector('.email-confirmed__modal');
     modalContainer.classList.add('hidden');
};

// Event listener for close icon in the email confirmation modal
const closeIcons = document.querySelectorAll('.email-confirm__close--icon');
   closeIcons.forEach((icon) => {
     icon.addEventListener('click', closeEmailConfirmationModal);
});
   
if (signupForm) {
  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const fullName = document.querySelector('.signup__fullname').value;
    const email = document.querySelector('.signup__email').value;
    const password = document.querySelector('.signup__passwordMain').value;
    const passwordConfirm = document.querySelector('.signup__passwordconfirm').value;
    const username = document.querySelector('.signup__username').value;
    const country = document.querySelector('.signup__country').value;
    const phone = +document.querySelector('.signup__phone').value;
    const role = document.querySelector('#role').value;
    signup(fullName, email, role, password, passwordConfirm, username, country, phone);
  })
}


