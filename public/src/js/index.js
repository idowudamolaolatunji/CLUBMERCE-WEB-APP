// import { login, signup } from './auth';

const loginFrom = document.querySelector('.login');
const signupForm = document.querySelector('.signup')


const login = async (email, password, role) => {
    console.log(email, password, role);
    try {
        const res = await fetch("api/users/login", {
            method: "POST",
            body: {email, password, role}
        })

        console.log(res)
    } catch(err) {
        console.log(err);
    }
}

const signup = async (...body) => {
    console.log(...body)
    const {fullName, email, password, passwordConfirm, username, country, phone, gender, role} = body;
    // try {
    //     const res = await axios({
    //         method: 'POST',
    //         url: "http://127.0.0.1:3000/api/users/signup",
    //         data: {
    //             fullName,
    //             email,
    //             password,
    //             passwordConfirm,
    //             username,
    //             country,
    //             phone,
    //             gender,
    //             role
    //         }
    //     });

    //     console.log(res)
    // } catch(err) {
    //     console.log(err);
    // }
}

if(loginFrom) {
    loginFrom.addEventListener('submit', function(e) {
        e.preventDefault();
    
        const email = document.querySelector('.login__email').value;
        const password = document.querySelector('.login__password').value;
        const role = document.querySelector('.login__role').value;
        login(email, password, role);
    });
}
    
if(signupForm) 
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
    
        const fullName = document.querySelector('.signup__fullname').value;
        const email = document.querySelector('.signup__email').value;
        const password = document.querySelector('.signup__password').value;
        const passwordConfirm = document.querySelector('.signup__passwordconfirm').value;
        const usernname = document.querySelector('.signup__username').value;
        const country = document.querySelector('.signup__country').value;
        const gender = document.querySelector('.signup__gender').value;
        const phone = document.querySelector('.signup__phone').value;
        const role = document.querySelector('.signup__role').value;
        signup(fullName, email, password, passwordConfirm, usernname, country, gender, phone, role);
    })
    

const menuButton = document.querySelector('menu__button')
const menuOpen = document.querySelector('.menu__open')
if (menuOpen) 
    menuOpen.addEventListener('click', function(e) {
        document.querySelector('.section__bottom').classList.toggle('open');
        menuButton.classList.toggle('hidden')
        e.target.classList.toggle('fa-open')
        e.target.classList.toggle('fa-close')
    });


console.log('connected')

const notifyIcon = document.querySelector('.notification__icon');
const notifyBox = document.querySelector('.notification__hovered')

notifyIcon.addEventListener('click', () => notifyBox.classList.toggle('hidden'));


const profileImg = document.querySelector('.nav__image')
const profileBox = document.querySelector('.Profile__hovered')

profileImg.addEventListener('click', () => profileBox.classList.toggle('hidden'))


const accordionContainer = document.querySelector('.faq__accordion');
const accordionItem = document.querySelectorAll('.faq__accordion--item');
const accordionContent = document.querySelector('.faq__accordion--content');

accordionContainer.addEventListener('click', function(e) {
    // console.log(e.target, e.currentTarget)
    
    const clicked = e.target.closest('.faq__accordion--item')
    if(!clicked) return;

    accordionItem.forEach(accordion => accordion.classList.remove('faq__open'));
    clicked.classList.add('faq__open')

})
