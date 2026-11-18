/* ===========================================================================
   SULTAN'S CATERING - SITE SCRIPT
   ===========================================================================
   Kept deliberately small. Five jobs only:
     1. The mobile menu button
     2. Turning the header white once you scroll past the hero
     3. The copyright year in the footer
     4. Highlighting the nav link for the section you are looking at
     5. The quote form (basic checks + an email fallback)

   THE ONLY LINE MOST PEOPLE NEED TO EDIT IS THE NEXT ONE.
   =========================================================================== */

/* ==== EDIT: where quote requests go when no form service is connected.
   See the big comment above the form in index.html. ==== */
var CATERING_EMAIL = 'catering@sultansgrill.ca';

(function () {
  'use strict';

  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');

  /* -------------------------------------------------------------------------
     1. MOBILE MENU
     ------------------------------------------------------------------------- */
  function setNav(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    // The header needs a solid background while the panel is open.
    if (header) header.classList.toggle('nav-open', open);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNav(!nav.classList.contains('is-open'));
    });

    // Tapping a link closes the menu, so the page is not left covered.
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setNav(false);
    });

    // Escape closes it too.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setNav(false);
    });
  }

  /* -------------------------------------------------------------------------
     2. STICKY HEADER
     The bar sits see-through over the hero, then turns white once you have
     scrolled a little. Change the 40 below to adjust when it switches.
     ------------------------------------------------------------------------- */
  if (header) {
    var lastStuck = null;

    function updateHeader() {
      var stuck = window.scrollY > 40;
      if (stuck !== lastStuck) {
        header.classList.toggle('is-stuck', stuck);
        lastStuck = stuck;
      }
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  /* -------------------------------------------------------------------------
     3. FOOTER YEAR - no need to update the copyright by hand
     ------------------------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* -------------------------------------------------------------------------
     4. ACTIVE NAV LINK
     Adds the class "is-current" to the nav link of the section on screen.
     Purely cosmetic - safe to delete this whole block.
     ------------------------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    var navLinks = Array.prototype.slice.call(
      document.querySelectorAll('.site-nav a[href^="#"]')
    );

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle(
            'is-current',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    // Sections that have a matching link in the nav, across both pages.
    // Ids that do not exist on the current page are simply skipped.
    ['packages', 'menu', 'how', 'locations', 'request'].forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  /* -------------------------------------------------------------------------
     5. QUOTE FORM
     If the form has a real action="..." (a form service), this script stays
     out of the way and the browser submits it normally.
     If it does not, we check the required fields and open the visitor's email
     app with everything filled in, addressed to CATERING_EMAIL above.
     ------------------------------------------------------------------------- */
  var form = document.getElementById('requestForm');
  var status = document.getElementById('formStatus');

  function say(message, state) {
    if (!status) return;
    status.textContent = message;
    status.setAttribute('data-state', state || 'ok');
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      var usesMailto = form.getAttribute('data-mailto-fallback') === 'true';

      // Check the required fields ourselves, so the message is friendly.
      var missing = [];
      Array.prototype.forEach.call(
        form.querySelectorAll('[required]'),
        function (field) {
          var empty = !field.value.trim();
          field.setAttribute('aria-invalid', empty ? 'true' : 'false');
          if (empty) {
            var label = form.querySelector('label[for="' + field.id + '"]');
            missing.push(label ? label.textContent.trim() : field.name);
          }
        }
      );

      if (missing.length) {
        event.preventDefault();
        say('Please fill in: ' + missing.join(', ') + '.', 'error');
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      if (!usesMailto) {
        // A form service is connected - let the browser post it.
        say('Sending your request...', 'ok');
        return;
      }

      // No form service: build an email instead.
      event.preventDefault();

      var data = new FormData(form);
      var lines = [];
      data.forEach(function (value, key) {
        if (String(value).trim()) {
          lines.push(key.charAt(0).toUpperCase() + key.slice(1) + ': ' + value);
        }
      });

      var subject = 'Catering request - ' + (data.get('name') || 'new enquiry');
      var body = 'Catering request from the website\n\n' + lines.join('\n') + '\n';

      window.location.href =
        'mailto:' + CATERING_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      say('Opening your email app with the details filled in.', 'ok');
    });
  }
})();
