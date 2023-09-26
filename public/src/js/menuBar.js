
// MOBILE NAVIGATION

const navMenuBtn = document.querySelector(".navigation-controls");
const navList = document.querySelector(".nav__list-m");
const icon = document.querySelector('.navigation-icon');

if (navMenuBtn) {
  navMenuBtn.addEventListener("click", function() {
    if (icon.classList.contains('fa-close')) {
      navList.style.transform = 'translateX(100%)';
      setTimeout(() => {
        navList.style.visibility = 'hidden';
      }, 500);
    } else {
      navList.style.visibility = 'visible';
      navList.style.transform = 'translateX(0)';
    }
    icon.classList.toggle('fa-close');
  });
}


if (window.innerWidth >= 750) {

  const obsCallback = function (entries, observer) {
    entries.forEach((entry) => {
      console.log(entry);
    });
  };

  const obsOptions = {
    root: null,
    threshold: [0, 0.2],
  };

  const nav = document.querySelector('.header')
  const observer = new IntersectionObserver(obsCallback, obsOptions);
  const navHeight = nav.getBoundingClientRect().height;
  // console.log(navHeight);

  const stickNav = function (entries) {
    const [entry] = entries; // Destructuring

    if (!entry.isIntersecting) nav.classList.add("sticky");
    else nav.classList.remove("sticky");
  };

  const headerObserver = new IntersectionObserver(stickNav, {
    root: null,
    threshold: .5,

    rootMargin: `-${navHeight}px`,
  });

  if(document.querySelector('.hero__section')) {
    headerObserver.observe(document.querySelector(".hero__section"));
  }
} else if (window.innerWidth <= 750) {
  const nav = document.querySelector('.header');
  const navHeight = nav.getBoundingClientRect().height;

  const stickNav = function (entries) {
    const [entry] = entries;

    if (!entry.isIntersecting) {
      nav.classList.add("sticky");
    } else {
      nav.classList.remove("sticky");
    }
  };

  const headerObserver = new IntersectionObserver(stickNav, {
    root: null,
    threshold: 0.1,
    rootMargin: `-${navHeight}px`,
  });

  headerObserver.observe(nav);

}