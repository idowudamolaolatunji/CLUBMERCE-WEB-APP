
// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
    try {
        let url;
        if(type === 'password') url = 'http://127.0.0.1:3000/api/users/updateMyPassword'
        if(type === 'data') url ='http://127.0.0.1:3000/api/users/updateMe';
        if(type === 'bank info') url ='http://127.0.0.1:3000/api/users/updateMyBank';

    
        const res = await fetch(url, {
          method: 'PATCH',
          data
        });
    
        if (res.data.status === 'success') {
          showAlert('success', `${type.toUpperCase()} updated successfully!`);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
}

const userDataForm = document.querySelector('.form-profile-data')
if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('fullName' ? ('fullName', document.getElementById('fullName').value) : ('businessName', document.getElementById('businessName').value));
    // form.append('fullName', document.getElementById('fullName').value);
    // form.append('businessName', document.getElementById('businessName').value);
    form.append('email', document.getElementById('email').value);
    form.append('phone', document.getElementById('phone').value);
    form.append('country', document.getElementById('country').value);
    form.append('state', document.getElementById('state').value);
    form.append('city-region', document.getElementById('city-region').value);
    form.append('zip-postal', document.getElementById('zip-postal').value);
    form.append('photo', document.getElementById('photo').files[0]);
    console.log(form);
    updateSettings(form, 'data');
});


const userPasswordForm = document.querySelector('.form-password-data') 
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

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
  userBankForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-bank').textContent = 'Updating...';

    const bankName = document.getElementById('paymentBankName').value;
    const bankAccountNumber = document.getElementById('paymentAcctNum').value;
    const holdersName = document.getElementById('HoldersName').value;
    await updateSettings(
      { bankName, bankAccountNumber, holdersName },
      'bank info'
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

