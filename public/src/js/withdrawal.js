

console.log('I an withdrawing...');


const withdrawalForm = document.querySelector('.withdraw__form');
console.log(withdrawalForm)

if(withdrawalForm) {
    withdrawalForm.addEventListener('submit', function(e) {
        console.log('this is form', e.currentTarget);
        e.preventDefault();
        const user = JSON.parse(e.currentTarget.attributes['data-userobj'].nodeValue);
        console.log(user.role)
    
        if(user.role === 'affiliate') {
            console.log('it is working ooo.......');
        } else {
            console.log('this is the elset');
        }
        console.log(user);
    });
}