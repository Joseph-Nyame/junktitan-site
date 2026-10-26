(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('mobile-nav');

  if (toggle && mobileNav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      mobileNav.hidden = !open;
    };

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1120) setOpen(false);
    });
  }

  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  var video = document.querySelector('.video-frame video');
  var videoBtn = document.querySelector('.video-toggle');
  if (video && videoBtn) {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var syncVideo = function () {
      var paused = video.paused;
      videoBtn.textContent = paused ? 'Play' : 'Pause';
      videoBtn.setAttribute('aria-pressed', String(!paused));
    };

    if (reduceMotion.matches) video.pause();
    videoBtn.addEventListener('click', function () {
      if (video.paused) {
        var play = video.play();
        if (play && play.catch) play.catch(function () {});
      } else {
        video.pause();
      }
    });
    video.addEventListener('play', syncVideo);
    video.addEventListener('pause', syncVideo);
    syncVideo();
  }

  var form = document.querySelector('.booking-form');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;

      var data = new FormData(form);
      var lines = ['Hi Junk Titanic, I would like a quote.'];
      var add = function (label, value) {
        if (value && String(value).trim()) lines.push(label + ': ' + String(value).trim());
      };

      add('Service', data.get('service'));
      add('Job details', data.get('details'));
      add('Postcode', data.get('postcode'));
      add('Address', data.get('address'));
      add('When', data.get('when'));
      add('Preferred date', data.get('date'));
      add('Name', data.get('name'));
      add('Phone', data.get('phone'));
      add('Email', data.get('email'));

      var photo = data.get('photo');
      if (photo && photo.name) lines.push('I have a photo to attach.');

      var url = 'https://wa.me/447825646222?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');

      var status = form.querySelector('.form-status');
      if (status) {
        status.textContent = 'Opening WhatsApp with your details — attach your photo there and hit send.';
      }
    });
  }
})();
