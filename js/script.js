/* ===========================================================================
   SULTAN'S CATERING - SITE SCRIPT
   ===========================================================================
   Kept deliberately small. Six jobs only:
     1. Starting every page load at the top of the page
     2. The mobile menu button
     3. Turning the header white once you scroll past the hero
     4. The copyright year in the footer
     5. Highlighting the nav link for the section you are looking at
     6. The quote form (basic checks + an email fallback)

   THE ONLY LINE MOST PEOPLE NEED TO EDIT IS THE NEXT ONE.
   =========================================================================== */

/* ==== EDIT: where quote requests go when no form service is connected.
   See the big comment above the form in index.html. ==== */
var CATERING_EMAIL = 'info@sultansgrill.ca';

(function () {
  'use strict';

  /* -------------------------------------------------------------------------
     0. THE HERO VIDEO
     One courtesy: if someone has asked their device to reduce motion, the
     film is paused so they get the still behind it instead.

     Nothing is needed for a video that fails to load. The still and the
     gradient are the background of the section itself, so they simply show
     through the empty video. See "7a" in the stylesheet.
     ------------------------------------------------------------------------- */
  var heroVideo = document.querySelector('.hero-video-asset');
  if (heroVideo && window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroVideo.removeAttribute('autoplay');
    heroVideo.pause();
  }

  /* -------------------------------------------------------------------------
     1. START AT THE TOP OF THE PAGE

     Browsers normally remember where you were scrolled to and put you back
     there when you reopen or refresh a page. On a long page that drops
     people into the middle of a section with no idea where they are, so
     every page load starts at the hero instead.

     THE ONE EXCEPTION is a link from another page of this site that points
     at a section, such as the "Request a quote" button on the home page
     going to catering.html#request. That link is meant to land on the form,
     so it still does.

     The rules:
       Link from our own site to a #section  -> go to that section
       Everything else, including a refresh  -> top of the page,
                                                even when the address
                                                ends in #something

     Note: this also turns off the browser's "put me back where I was" on
     the Back button, which is the trade-off for a predictable start
     position. To get that behaviour back, delete the scrollRestoration
     line below and the whole of this block.
     ------------------------------------------------------------------------- */
  (function startAtTop() {
    // Stop the browser restoring the old scroll position on this page.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    function arrivedBy() {
      var entries = performance.getEntriesByType && performance.getEntriesByType('navigation');
      if (entries && entries.length && entries[0].type) return entries[0].type;
      // Older browsers.
      if (performance.navigation && performance.navigation.type === 1) return 'reload';
      return 'navigate';
    }

    // Did they arrive by clicking a link on another page of this site?
    var fromOurSite = false;
    try {
      if (document.referrer) {
        var from = new URL(document.referrer);
        fromOurSite = from.origin === window.location.origin &&
                      from.pathname !== window.location.pathname;
      }
    } catch (e) { /* no referrer available - treat it as a direct visit */ }

    var hasSection = window.location.hash.length > 1;

    // A link from our own site pointing at a section wins - leave it be.
    if (hasSection && fromOurSite && arrivedBy() === 'navigate') return;

    function toTop() {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      } catch (e) {
        window.scrollTo(0, 0);   // older browsers
      }
    }

    // Run it now, then again after the browser has finished its own
    // scrolling, which can happen a moment later when there is a #section
    // in the address.
    toTop();
    requestAnimationFrame(toTop);
    window.addEventListener('load', toTop, { once: true });
  })();

  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');

  /* -------------------------------------------------------------------------
     2. THE SLIDE-OUT MENU
     Opens the panel, dims the page behind it, and stops that page scrolling
     while it is open. Closes on the X, on the dimmed area, on Escape, and
     after tapping any link.
     ------------------------------------------------------------------------- */
  var backdrop = document.getElementById('navBackdrop');
  var navClose = document.getElementById('navClose');

  function setNav(open) {
    if (!nav || !toggle) return;

    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-is-open', open);

    if (backdrop) {
      if (open) {
        backdrop.hidden = false;
        // One frame later, so the fade actually runs.
        requestAnimationFrame(function () { backdrop.classList.add('is-visible'); });
      } else {
        backdrop.classList.remove('is-visible');
        setTimeout(function () {
          if (!nav.classList.contains('is-open')) backdrop.hidden = true;
        }, 340);
      }
    }

    // Send focus where the person is looking. Opening waits two frames: the
    // panel is still hidden when the class is added, and a hidden element
    // cannot take focus. Two frames puts us safely after the style pass.
    if (open && navClose) {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { navClose.focus(); });
      });
    } else if (!open && document.activeElement && nav.contains(document.activeElement)) {
      toggle.focus();
    }
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNav(!nav.classList.contains('is-open'));
    });

    if (navClose) navClose.addEventListener('click', function () { setNav(false); });
    if (backdrop) backdrop.addEventListener('click', function () { setNav(false); });

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
     3. STICKY HEADER
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
     3b. LOCATION ROW ARROWS
     The location rows scroll and snap on their own - swiping works with no
     JavaScript at all. This only drives the two round arrow buttons shown
     to mouse users, and greys them out at each end of the row.
     Safe to delete this whole block; the rows still swipe.
     ------------------------------------------------------------------------- */
  Array.prototype.forEach.call(
    document.querySelectorAll('[data-scroller-nav]'),
    function (nav) {
      // The row this set of arrows belongs to.
      var row = nav.closest('.loc-group-head');
      row = row && row.nextElementSibling;
      if (!row || !row.hasAttribute('data-scroller')) return;

      function step() {
        var card = row.querySelector('.loc');
        var gap = parseFloat(getComputedStyle(row).columnGap) || 16;
        return card ? card.getBoundingClientRect().width + gap : row.clientWidth * 0.8;
      }

      function refresh() {
        var max = row.scrollWidth - row.clientWidth - 2;
        Array.prototype.forEach.call(nav.querySelectorAll('.loc-nav-btn'), function (btn) {
          var back = btn.getAttribute('data-dir') === '-1';
          btn.disabled = back ? row.scrollLeft <= 2 : row.scrollLeft >= max;
        });
      }

      nav.addEventListener('click', function (event) {
        var btn = event.target.closest('.loc-nav-btn');
        if (!btn) return;
        row.scrollBy({ left: step() * Number(btn.getAttribute('data-dir')), behavior: 'smooth' });
      });

      row.addEventListener('scroll', refresh, { passive: true });
      window.addEventListener('resize', refresh);
      refresh();
    }
  );

  /* -------------------------------------------------------------------------
     3c. LOCATION FILTER PILLS (phones)
     Each pill carries a data-filter; each card a data-area. Tapping a pill
     shows only the cards whose area matches, and hides any group left with
     nothing in it. "all" puts everything back.

     The pills are hidden by CSS on wider screens, so if the window is
     widened everything is shown again - otherwise cards could stay hidden
     with no visible way to bring them back.
     ------------------------------------------------------------------------- */
  var locFilters = document.getElementById('locFilters');

  if (locFilters) {
    var locCards = Array.prototype.slice.call(document.querySelectorAll('.loc[data-area]'));
    var locGroups = Array.prototype.slice.call(document.querySelectorAll('[data-loc-group]'));
    var locEmpty = document.getElementById('locEmpty');

    function applyFilter(area) {
      locCards.forEach(function (card) {
        card.hidden = !(area === 'all' || card.getAttribute('data-area') === area);
      });

      // Hide a group once every card inside it is hidden.
      var anyShown = false;
      locGroups.forEach(function (group) {
        var shown = group.querySelectorAll('.loc[data-area]:not([hidden])').length > 0;
        group.hidden = !shown;
        if (shown) anyShown = true;
        // Back to the start, so a filtered row does not open mid-scroll.
        var row = group.querySelector('[data-scroller]');
        if (row) row.scrollLeft = 0;
      });

      if (locEmpty) locEmpty.hidden = anyShown;

      Array.prototype.forEach.call(locFilters.querySelectorAll('.loc-filter'), function (pill) {
        pill.classList.toggle('is-active', pill.getAttribute('data-filter') === area);
      });
    }

    locFilters.addEventListener('click', function (event) {
      var pill = event.target.closest('.loc-filter');
      if (pill) applyFilter(pill.getAttribute('data-filter'));
    });

    // If the pills get hidden (wider window), show everything again.
    window.addEventListener('resize', function () {
      if (getComputedStyle(locFilters).display === 'none') {
        var active = locFilters.querySelector('.loc-filter.is-active');
        if (active && active.getAttribute('data-filter') !== 'all') applyFilter('all');
      }
    });
  }

  /* -------------------------------------------------------------------------
     4. FOOTER YEAR - no need to update the copyright by hand
     ------------------------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* -------------------------------------------------------------------------
     5. ACTIVE NAV LINK
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
    ['about', 'packages', 'menu', 'how', 'locations', 'request'].forEach(function (id) {
      var section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }

  /* -------------------------------------------------------------------------
     6. QUOTE FORM
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
