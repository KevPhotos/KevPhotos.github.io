$(document).ready(function () {

   // Initiate JS animate scroll screen
   AOS.init({
      once: true
   });

   // LOADER
   window.addEventListener("load", function (event) {
      $('#preloader').fadeOut('slow');
   });

   // NAVBAR
   if (window.matchMedia("(min-width: 720px)").matches) {
      $(window).scroll(function () {
         if ($(window).scrollTop() >= 500) {
            $('nav').fadeIn();
         } else {
            $('nav').fadeOut();
         }
      });
   }
   if (window.matchMedia("(max-width: 720px)").matches) {
      document.addEventListener('swiped-right', function () {
         $('nav').animate({
            left: '0'
         });
      });
      $('nav').click(function () {
         $('nav').animate({
            left: '-1000px'
         });
      });
      document.addEventListener('swiped-left', function () {
         $('nav').animate({
            left: '-1000px'
         });
      });
      setTimeout(function(){
         $('#modal_nav').removeClass('hiden_modal');
      }, 5000);
   }

   // MODAL
   $('.close').click(function () {
      $('.modal').addClass('hiden_modal');
   });

   $('.modal').click(function (e) {
      if (e.target == e.currentTarget) {
         $(this).addClass('hiden_modal');
      }
   });

   // SCROLL LINK
   $("a[href*='#']:not([href='#'])").click(function () {
      if (
         location.hostname == this.hostname &&
         this.pathname.replace(/^\//, "") == location.pathname.replace(/^\//, "")
      ) {
         var anchor = $(this.hash);
         anchor = anchor.length ? anchor : $("[name=" + this.hash.slice(1) + "]");
         if (anchor.length) {
            $("html, body").animate({
               scrollTop: anchor.offset().top
            }, 0);
         }
      }
   });

   // HOME BACKGROUND CAROUSEL
   const home_container = document.getElementById("home");
   const pictures = [
      "assets/img/home2.jpg",
      "assets/img/home3.jpg",
      "assets/img/home.jpg",
   ]
   const backgroundSlide = (images, container, step) => {
      images.forEach((image, index) => (
         setTimeout(() => {
            container.style.backgroundImage = `url(${image})`
         }, step * (index + 1))
      ))
      setTimeout(() => backgroundSlide(images, container, step), step * images.length)
   }
   backgroundSlide(pictures, home_container, 5000);

   // SCROLL-UP BUTTON
   $(window).scroll(function () {
      if ($(window).scrollTop() >= 500) {
         $('#back_top').fadeIn();
      } else {
         $('#back_top').fadeOut();
      }
   });

   // SCROLL BUTTON MAIN HOME PICTURE
   $('#scroll_button').on('click', function (e) {
      e.preventDefault();
      $('html, body').animate({
         scrollTop: $($('#biographie')).offset().top
      }, 0, 'linear');
   });

   // JS ANIMATION
   $('.main-animate').fadeOut().delay(1000).fadeIn(1500);
   $('#scroll_button').fadeOut().delay(2000).fadeIn(1500);

});