const spinOverlay = document.querySelector('#spinOverlay');

const showLoadingOverlay = () => {
  spinOverlay.style.visibility = 'visible';
};
const hideLoadingOverlay = () => {
  spinOverlay.style.visibility = 'hidden';
};

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

console.log('i am connected via updateSettings')



// type is either 'password' or 'data or image or bank'
const updateSettings = async (form, type) => {
    try {
      showLoadingOverlay();
        let url;
        if(type === 'password') url = '/api/users/updateMyPassword'
        if(type === 'data') url ='/api/users/updateMe';
        if(type === 'bank') url ='/api/users/updateMyBank';
        if(type === 'image') url ='/api/users/uploadImage';

    
        const res = await fetch(url, {
          method: 'PATCH',
          body: JSON.stringify(form),
        });
        console.log(res)
        if(!res.ok) {
          hideLoadingOverlay();
          return; 
        }

        const data = await res.json();
        if(type === 'password' && data.message === 'Your current password is wrong.') {
          hideLoadingOverlay();
          showAlert('error', data.message);
        }
        if (data.status === 'success') { 
          hideLoadingOverlay();
          showAlert('success', `${type.toUpperCase()} updated successfully!`);
        }
    } catch (err) {
        hideLoadingOverlay();
        showAlert('error', 'Something went wrong');
    }
}

/*
const userImageBtn = document.querySelector('.img__upload--btn');
if(userImageBtn) {
  userImageBtn.addEventListener('click', function(e) {
    e.preventDefault();

    // let image
    // const chosenImage = document.getElementById('photo').files[0].name.includes(' ');
    // if(chosenImage) {
    //   image = document.getElementById('photo').files[0].name.split(' ').join('-');
    // } else {
    //   image = document.getElementById('photo').files[0].name;
    // }
    // console.log(image);

    const fileInput = document.getElementById('photo');
    const image = fileInput.files[0];

    // Check if an image is selected
    if (!image) {
      showAlert('error', 'Please select an image file.');
      return;
    }

    const form = new FormData();
    form.append('image', image);

    console.log(form)
    updateSettings(form, 'image');
    
  })
}
*/

const userDataForm = document.getElementById('form-data');
if (userDataForm)
  userDataForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const country = document.getElementById('country').value;
    const state = document.getElementById('state').value;
    const cityRegion = document.getElementById('city-region').value;
    const zipPostal = document.getElementById('zip-postal').value;
    const formData = { fullName, email, phone, country, state, cityRegion, zipPostal}
    console.log(formData)
    await updateSettings(formData, 'data');
  });


const vendorDataForm = document.getElementById('form-data-vendor');
if (vendorDataForm)
  vendorDataForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const businessName = document.getElementById('businessName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const country = document.getElementById('country').value;
    const state = document.getElementById('state').value;
    const cityRegion = document.getElementById('city-region').value;
    const zipPostal = document.getElementById('zip-postal').value;
    const formData = { fullName, businessName, email, phone, country, state, cityRegion, zipPostal}
    console.log(formData)
    await updateSettings(formData, 'data');
  });



const userPasswordForm = document.querySelector('.form-password-data') 
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent ='Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
});


const userBankForm = document.querySelector('.form-payment-data') 
if (userBankForm)
  userBankForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    document.querySelector('.btn--save-bank').textContent = 'Updating...';

    const bankName = document.getElementById('paymentBankName').value;
    const bankAccountNumber = document.getElementById('paymentAcctNum').value;
    const holdersName = document.getElementById('HoldersName').value;
    await updateSettings(
      { bankName, bankAccountNumber, holdersName },
      'bank'
    );

    document.querySelector('.btn--save-bank').textContent = 'Add payment account';
});


const showDeleteModal = function(item) {
    const html = `
      <div class="delete__overlay">
          <div class='delete__modal'>
              <i class="fa-solid fa-close delete__icon"></i>
              <p class="delete__text">
                  Are you sure you want to delete this ${item}?
              </p>
              <div class="delete__action">
                  <button class="delete__button btn-yes">Yes</button>
                  <button class="delete__button btn-no">No</button>
              </div>
          </div>
      </div>
    `;
  
    document.body.insertAdjacentHTML('afterbegin', html);
}

const closeAdjacentModal = () => {
  const deleteOverlay = document.querySelector('.delete__overlay');
  if (deleteOverlay) {
    deleteOverlay.remove();
  }
};

const deleteMyAccount = async function(userId) {
  try {
    showLoadingOverlay();
    const res = await fetch(`/api/products/${userId}`, {
      method: 'DELETE',
    });

    const data = await res.json();
    console.log(data);

    if(data.status === 'success') {
      showAlert('success', 'Account deleted successfully!');
      window.setTimeout(() => {
        // location.reload(true)
        location.assign('/signup')
      }, 1500);
    }
  } catch (err) {
    hideLoadingOverlay();
    showAlert('error', 'Something went wrong!');
  }
} 


const deleteAccount = document.querySelector('.delete-data')

if(deleteAccount)
deleteAccount.addEventListener('submit', function(e) {
  e.preventDefault()

  showDeleteModal('Account');
  const userId = e.target.dataset.id;
  console.log(userId)

  document.querySelector('.btn-yes').addEventListener('click', async function() {
    await deleteMyAccount(userId);
  })
  document.querySelector('.btn-no').addEventListener('click', () => {
      closeAdjacentModal();
  })
  document.querySelector('.delete__icon').addEventListener('click', () => {
      closeAdjacentModal();
  } )
})