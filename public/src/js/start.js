const profileImg = document.querySelector('.nav__image')
const menuImg = document.querySelector('.menu__profile-image');
const formImg = document.querySelector('.form__user-photo');
const dashboard = document.querySelector('.section__dashboard');

const userData = dashboard.getAttribute('data-user');
const imageUrl = JSON.parse(userData)['image'];
profileImg.src = imageUrl;
menuImg.src = imageUrl;
formImg.src = imageUrl;
console.log('i am connected')