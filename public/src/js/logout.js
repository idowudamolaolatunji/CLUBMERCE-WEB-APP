//  logout functionality
const logout = async function() {
    try {
        const response = await fetch('/logout');

        if (response.ok) {
            window.location.href = '/login';
        } 
    } catch (err) {
        console.error(err);
        showAlert('error', err.message || 'Logout failed'); // Display an error message to the user
    }
}

if(menuLogout) menuLogout.addEventListener('click', function() {
    logout()
    console.log('i wan to log out')
});
if(navLogout) navLogout.addEventListener('click', logout);
if(adminLogout) adminLogout.addEventListener('click', logout);

