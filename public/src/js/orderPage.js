document.addEventListener('DOMContentLoaded', function () {
    let slideIndex = 1;
    showSlide(slideIndex);
  
    function plusSlides(n) {
      showSlide(slideIndex += n);
    }
  
    function currentSlide(n) {
      showSlide(slideIndex = n);
    }
  
    function showSlide(n) {
      const slides = document.querySelectorAll('.slide');
      const dots = document.querySelectorAll('.column');
      if (n > slides.length) {
        slideIndex = 1;
      }
      if (n < 1) {
        slideIndex = slides.length;
      }
      for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
      }
      for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
      }
      slides[slideIndex - 1].style.display = 'block';
      dots[slideIndex - 1].classList.add('active');
    }
  
    document.querySelector('.prev').addEventListener('click', function () {
      plusSlides(-1);
    });
  
    document.querySelector('.next').addEventListener('click', function () {
      plusSlides(1);
    });
  
    const dots = document.querySelectorAll('.column');
    for (let i = 0; i < dots.length; i++) {
      dots[i].addEventListener('click', function () {
        currentSlide(i + 1);
      });
    }
});
  