'use strict';

const forgotPassword = document.querySelector('.forgot')
const forgotOverlay = document.querySelector('.forgot-password__drop-down');
const forgotModal = document.querySelector('.forgot-password__modal');
const forgotClose = document.querySelector('.forgot__close--icon');

const emailVerifyOverlay = document.querySelector('.email__drop-down');
const emailVerifyModal = document.querySelector('.email-verify__modal');
const emailVerifyClose = document.querySelector('.email-verify__close--icon');

const emailConfirmModal = document.querySelector('.email-confirmed__modal');
const emailConfirmClose = document.querySelector('.email-confirmed__close--icon');

const openModal = function(overlay, modal) {
    overlay.classList.remove('hidden');
    modal.classList.remove('hidden');
}
const closeModal = function(overlay, modal) {
    overlay.classList.add('hidden');
    modal.classList.add('hidden');
}

// forgotPassword.addEventListener('click', openModal.bind(this, forgotOverlay, forgotModal));
forgotOverlay.addEventListener('click', closeModal.bind(this, forgotOverlay, forgotModal));
forgotClose.addEventListener('click', closeModal.bind(this, forgotOverlay, forgotModal));

emailVerifyOverlay.addEventListener('click', closeModal.bind(this, emailVerifyOverlay, emailVerifyModal));
emailVerifyClose.addEventListener('click', closeModal.bind(this, emailVerifyOverlay, emailVerifyModal));

emailVerifyOverlay.addEventListener('click', closeModal.bind(this, emailVerifyOverlay, emailConfirmModal));
emailConfirmClose.addEventListener('click', closeModal.bind(this, emailVerifyOverlay, emailConfirmModal));


//////////////////////////////////////////////////////////////////////////////////


const login = fetch('localhost:3000/api/products');
login.then(res => {
    console.log(res);
})