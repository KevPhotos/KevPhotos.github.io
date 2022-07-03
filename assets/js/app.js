$(document).ready(function () {

   "use strict";

   // Initiate JS animate scroll screen
   AOS.init({
      once: true
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

      setTimeout(function () {
         $('#modal_nav').removeClass('hiden_modal');
      }, 10000);
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
            }, 1000);
         }
      }
   });

   // HOME BACKGROUND CAROUSEL
   const home_container = document.getElementById("home");
   const pictures_home = [
      "assets/img/models/bertilleR/bertilleR-2.jpg",
      "assets/img/models/anneLise/anneLiseMin1.jpg",
      "assets/img/models/anthony&Ivain/i&a-3.jpg",
      "assets/img/models/theoMjadeP/theoMjadeP-1.jpg",
   ]
   const backgroundSlide = (images, container, step) => {
      images.forEach((image, index) => (
         setTimeout(() => {
            container.style.backgroundImage = `url(${image})`
         }, step * (index + 1))
      ))
      setTimeout(() => backgroundSlide(images, container, step), step * images.length)
   }
   backgroundSlide(pictures_home, home_container, 5000);

   // BIOGRAPHIE PICTURES SLIDE
   const biographie_container = document.getElementById("img_bio");
   const pictures_biographie = [
      "assets/img/models/kevinGuillaume/kev__photos.jpg",
      "assets/img/models/kevinGuillaume/kevinG_1.jpg",
      "assets/img/models/kevinGuillaume/kevinG_2.jpg",
      "assets/img/models/kevinGuillaume/kevinG_3.jpg",
      "assets/img/models/kevinGuillaume/kevinG_4.jpg",
      "assets/img/models/kevinGuillaume/kevinG_5.jpg",
      "assets/img/models/kevinGuillaume/kev_studio.jpg",
      "assets/img/models/kevinGuillaume/kev__photos_2.jpg",
   ]
   backgroundSlide(pictures_biographie, biographie_container, 5000);

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
      }, 1000, 'linear');
   });

   // JS ANIMATION
   $('.main-animate').fadeOut().delay(1000).fadeIn(1500);
   $('#scroll_button').fadeOut().delay(2000).fadeIn(1500);

});

// STOP MOUSE CLICK
$(document).bind('contextmenu', function(e) {
   e.stopPropagation();
   e.preventDefault();
   e.stopImmediatePropagation();
   return false;
});

// MODELS CAROUSEL
(function () {
   "use strict";

   var carousel = document.getElementsByClassName('carousel')[0],
      slider = carousel.getElementsByClassName('carousel_slider')[0],
      items = carousel.getElementsByClassName('carousel_slider_item'),
      prevBtn = carousel.getElementsByClassName('carousel_prev')[0],
      nextBtn = carousel.getElementsByClassName('carousel_next')[0];

   var width, height, totalWidth, margin = 20,
      currIndex = 0,
      interval, intervalTime = 4000;

   function init() {
      resize();
      move(Math.floor(items.length / 2));
      bindEvents();

      timer();
   }

   function resize() {
      width = Math.max(window.innerWidth * .25, 275),
         height = window.innerHeight * .5,
         totalWidth = width * items.length;

      slider.style.width = totalWidth + "px";

      for (var i = 0; i < items.length; i++) {
         let item = items[i];
         item.style.width = (width - (margin * 2)) + "px";
         item.style.height = height + "px";
      }
   }

   function move(index) {

      if (index < 1) index = items.length;
      if (index > items.length) index = 1;
      currIndex = index;

      for (var i = 0; i < items.length; i++) {
         let item = items[i],
            box = item.getElementsByClassName('item_3d-frame')[0];
         if (i == (index - 1)) {
            item.classList.add('carousel_slider_item--active');
            box.style.transform = "perspective(1200px)";
         } else {
            item.classList.remove('carousel_slider_item--active');
            box.style.transform = "perspective(1200px) rotateY(" + (i < (index - 1) ? 40 : -40) + "deg)";
         }
      }

      slider.style.transform = "translate3d(" + ((index * -width) + (width / 2) + window.innerWidth / 2) + "px, 0, 0)";
   }

   function timer() {
      clearInterval(interval);
      interval = setInterval(() => {
         move(++currIndex);
      }, intervalTime);
   }

   function prev() {
      move(--currIndex);
      timer();
   }

   function next() {
      move(++currIndex);
      timer();
   }

   function bindEvents() {
      window.onresize = resize;
      prevBtn.addEventListener('click', () => {
         prev();
      });
      nextBtn.addEventListener('click', () => {
         next();
      });
   }

   init();

})();