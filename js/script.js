/* ===========================================================================
   SULTAN'S CATERING - SITE SCRIPT
   ===========================================================================
   Kept deliberately small. A short list of jobs:
     0. Keeping the hero film playing, with no controls ever shown
     1. Starting every page load at the top of the page
     2. The mobile menu button
     3. Turning the header white once you scroll past the hero
     3d. The guest count slider on the catering page
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

     The film is wallpaper, not something anyone chooses to watch, so it
     must never show a play button or any other control. The markup says
     autoplay, muted, loop and playsinline, which is enough to start it -
     but not enough to keep it running.

     WHAT STOPS IT. Browsers pause an inline video whenever the page stops
     being the thing in front of you: switching tabs, switching apps,
     locking the phone, answering a call. Safari is the strictest, and it
     is also the one that then draws a large play button over the paused
     film. On iOS it does this before the film has started at all. Coming
     back to the page does not always restart it.

     SO: whenever the browser stops the film, start it again. Section 7a of
     the stylesheet hides the button, this keeps it from being needed, and
     between them nothing is ever drawn over the hero. There is no custom
     play or pause control anywhere - that is the point.

     THE ONE COURTESY. If someone has asked their device to reduce motion,
     the film stays paused and they get the still behind it instead. That
     has to be checked every time rather than once at load, or the restart
     below would undo it; it also now follows the setting if it is changed
     while the page is open.

     WHAT THIS CANNOT DO. If the browser refuses to play at all - iOS Low
     Power Mode is the common one, and it overrides autoplay outright -
     then nothing here can force it. The film stays on its first frame and
     the poster still shows through. The play button stays hidden either
     way, so the hero looks deliberate rather than broken. Nothing is
     needed for a video that fails to load, for the same reason: the still
     and the gradient are the background of the section itself. See "7a".
     ------------------------------------------------------------------------- */
  var heroVideo = document.querySelector('.hero-video-asset');

  if (heroVideo) {
    var motionQuery = window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

    /* Has this visitor asked for less movement? Read live, never cached. */
    var wantsTheStill = function () {
      return !!(motionQuery && motionQuery.matches);
    };

    var playHeroVideo = function () {
      if (wantsTheStill()) { return; }
      /* No point asking while the page is in the background - the browser
         will refuse, and it is about to pause it again anyway. */
      if (document.visibilityState === 'hidden') { return; }
      if (!heroVideo.paused && !heroVideo.ended) { return; }

      var started = heroVideo.play();
      /* play() returns a promise in modern browsers and nothing in older
         ones. It rejects when the browser will not allow playback, which
         is not an error we can do anything about - swallow it, or it is
         logged as an unhandled rejection on every visit in Low Power
         Mode. A refused play() does not fire another "pause" event, so
         this cannot turn into a loop. */
      if (started && started.catch) { started.catch(function () {}); }
    };

    var applyMotionPreference = function () {
      if (wantsTheStill()) {
        heroVideo.removeAttribute('autoplay');
        heroVideo.pause();
      } else {
        heroVideo.setAttribute('autoplay', '');
        playHeroVideo();
      }
    };

    applyMotionPreference();

    /* Follow the setting if it changes while the page is open. The two
       spellings are the current one and the one Safari used until 14. */
    if (motionQuery) {
      if (motionQuery.addEventListener) {
        motionQuery.addEventListener('change', applyMotionPreference);
      } else if (motionQuery.addListener) {
        motionQuery.addListener(applyMotionPreference);
      }
    }

    /* Every way back to the page, and the pause itself.
         visibilitychange  tab switched, app switched, phone locked
         pageshow          the Back button, including Safari's bfcache,
                           which restores the page with the film paused
         focus             window brought forward on a computer
         pause             the catch-all: whatever stopped it, undo it
         loadeddata        the first frames have arrived - if autoplay was
                           going to be refused, this is where we try again */
    document.addEventListener('visibilitychange', playHeroVideo);
    window.addEventListener('pageshow', playHeroVideo);
    window.addEventListener('focus', playHeroVideo);
    heroVideo.addEventListener('pause', playHeroVideo);
    heroVideo.addEventListener('loadeddata', playHeroVideo);
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
     The carousel scrolls and snaps on its own - swiping works with no
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
     3d. GUEST COUNT -> TRAY SIZE   (catering page only)

     Drag the guest count, and the tray size that feeds that many people is
     highlighted. Nothing happens anywhere else on the page: this does not
     touch the price tables, add anything up, or quote a total.

     THE NUMBERS BELOW ARE THE CATERING PDF'S, NOT OURS. "upTo" is the top of
     the serving range printed for that tray, and "serves" is that range
     written out, word for word as the page shows it. Nothing is averaged or
     worked out from anything else.

     THEY ARE WRITTEN IN THREE PLACES - here, the cards in catering.html, and
     the table headings on that page. All three have to agree. If a new PDF
     changes a range, change it in all three.

     THE RULE, in one line: the smallest tray whose range reaches the count.
     So 25 guests gets Med, which serves 25-30 - and so does 22, because a
     Half tray stops at 20. Above 40, the top of the largest tray, it stops
     recommending: the honest answer there is more than one tray, and how
     many is a conversation, not arithmetic. It says that instead of
     guessing. Below 8 the smallest tray is already bigger than the room,
     so it says that too and points at the individual meals.

     Safe to delete this whole block - the panel then shows the four ranges
     and the sentence written into the HTML, which is still useful.
     ------------------------------------------------------------------------- */
  var guests = document.querySelector('[data-guests]');

  if (guests) {
    var guestRange = guests.querySelector('.guests-range');
    var guestOut = guests.querySelector('output');
    var guestAnswer = guests.querySelector('.guests-answer');
    var trayCards = Array.prototype.slice.call(guests.querySelectorAll('.tray-size'));

    var TRAYS = [
      { name: 'Small', upTo: 10, serves: '8–10' },
      { name: 'Half',  upTo: 20, serves: '15–20' },
      { name: 'Med',   upTo: 30, serves: '25–30' },
      { name: 'Full',  upTo: 40, serves: '35–40' }
    ];

    var pickTray = function (count) {
      for (var i = 0; i < TRAYS.length; i++) {
        if (count <= TRAYS[i].upTo) return TRAYS[i];
      }
      // Over the largest tray: show it, but say it is not the whole answer.
      return TRAYS[TRAYS.length - 1];
    };

    var updateGuests = function () {
      var count = Number(guestRange.value);
      var top = Number(guestRange.max);
      var tray = pickTray(count);

      // "60+" at the end of the slider, because the scale stops there but
      // the parties do not.
      if (guestOut) {
        guestOut.textContent = count >= top ? count + '+' : String(count);
      }

      trayCards.forEach(function (card) {
        card.classList.toggle('is-pick', card.getAttribute('data-tray') === tray.name);
      });

      if (!guestAnswer) return;

      if (count > TRAYS[TRAYS.length - 1].upTo) {
        guestAnswer.textContent =
          'A Full tray serves ' + tray.serves + ', so ' + count +
          ' guests means more than one. Tell us the headcount and we will ' +
          'build the order with you.';
      } else if (count < 8) {
        guestAnswer.textContent =
          'A Small tray serves ' + TRAYS[0].serves + ', which is the ' +
          'smallest we make. For ' + count + ', individual meals may suit ' +
          'you better.';
      } else {
        guestAnswer.textContent =
          'For ' + count + ' guests, start with a ' + tray.name +
          ' tray. It serves ' + tray.serves + '.';
      }
    };

    if (guestRange) {
      // "input" fires all the way through a drag; "change" alone would wait
      // for the finger to come off the screen.
      guestRange.addEventListener('input', updateGuests);
      updateGuests();
    }
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
