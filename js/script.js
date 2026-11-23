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
     6. The quote form (basic checks, then EmailJS)

   THE ONLY LINE MOST PEOPLE NEED TO EDIT IS THE NEXT ONE.
   =========================================================================== */

/* ==== EDIT: WHERE QUOTE REQUESTS GO ====

   THE FORM SENDS THROUGH EMAILJS. These three ids are the whole of the
   setup; change them here and nowhere else. They belong to the EmailJS
   account that owns the template, and the template is what decides which
   inbox the request lands in - not this file.

   THE PUBLIC KEY IS MEANT TO BE PUBLIC. It sits in the page where anyone
   can read it, which is how EmailJS works in a browser: it identifies the
   account, it does not unlock it. The service and template ids are not
   secrets either. There is nothing here to hide and nothing to rotate.

   WHAT IT DOES NOT DO is stop someone sending the form a hundred times. If
   that ever starts happening, EmailJS has a reCAPTCHA option and rate
   limits in its dashboard - both are settings over there, not code here. */
var EMAILJS_PUBLIC_KEY  = '1SZ-kimtx32LCUexe';
var EMAILJS_SERVICE_ID  = 'service_sl8fzmb';
var EMAILJS_TEMPLATE_ID = 'template_v3nkwdq';

/* ==== EDIT: the address the form falls back to if EmailJS cannot load.
   Keep it the same as the one in the footer and beside the form. ==== */
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

     Drag the guest count and the column that feeds that many people lights
     up, in every price table on the page at once. Nothing else happens: it
     does not add anything up, quote a total, or change a price.

     THE NUMBERS ARE NOT IN THIS FILE. Each table says what its own columns
     feed, on the column headings, as data-size and data-max:

         <th data-size="Med" data-max="30">Med <span>25-30</span></th>

     and every price cell under it carries the same data-size. So this block
     reads the ranges off the page rather than holding a copy of them, which
     is the whole point: Mains has four sizes, Dips has three of its own that
     serve different numbers, and nothing here has to know that. Change a
     range in the HTML and the slider follows with no edit here.

     THE RULE, in one line: the first column whose data-max reaches the
     count. So 25 guests gets Med, which serves 25-30 - and so does 22,
     because a Half tray stops at 20. Past the largest column it lights that
     column and says the order takes more than one tray: how many is a
     conversation, not arithmetic, so it does not guess.

     Safe to delete this whole block. The tables then show every price with
     no column lit, which is still a readable menu.
     ------------------------------------------------------------------------- */
  var guests = document.querySelector('[data-guests]');

  if (guests) {
    var guestRange = guests.querySelector('.guests-range');
    var guestOut = guests.querySelector('output');
    var guestTray = guests.querySelector('.guests-tray');
    var priceTables = Array.prototype.slice.call(
      document.querySelectorAll('.price-table')
    );

    // The name the readout uses for a column. The tables are headed with
    // the short form, which is what fits a narrow column; the sentence
    // under the slider has room for the word in full.
    var TRAY_WORDS = { Small: 'Small', Half: 'Half', Med: 'Medium', Full: 'Full', Bowl: 'Bowl' };

    // The columns of one table, in the order they are printed.
    var columnsOf = function (table) {
      return Array.prototype.slice.call(
        table.querySelectorAll('thead th[data-size]')
      ).map(function (th) {
        return { size: th.getAttribute('data-size'), max: Number(th.getAttribute('data-max')), th: th };
      });
    };

    // The first column that reaches the count, or the largest one there is.
    var pickColumn = function (cols, count) {
      for (var i = 0; i < cols.length; i++) {
        if (count <= cols[i].max) return cols[i];
      }
      return cols[cols.length - 1];
    };

    var lightTable = function (table, count) {
      var cols = columnsOf(table);
      if (!cols.length) return null;
      var pick = pickColumn(cols, count);

      cols.forEach(function (col) {
        col.th.classList.toggle('is-pick', col === pick);
      });
      Array.prototype.forEach.call(table.querySelectorAll('td[data-size]'), function (td) {
        td.classList.toggle('is-pick', td.getAttribute('data-size') === pick.size);
      });
      return pick;
    };

    var updateGuests = function () {
      var count = Number(guestRange.value);
      var top = Number(guestRange.max);
      var headline = null;

      priceTables.forEach(function (table, n) {
        var pick = lightTable(table, count);
        // The first table on the page is Mains, and that is the one the
        // readout speaks for - it is the only course with all four sizes.
        if (n === 0) headline = pick;
      });

      // "60+" at the end of the slider, because the scale stops there but
      // the parties do not.
      if (guestOut) {
        guestOut.textContent = count >= top ? count + '+' : String(count);
      }

      if (!guestTray || !headline) return;

      if (count > headline.max) {
        guestTray.textContent = 'more than one ' + TRAY_WORDS[headline.size] + ' tray';
      } else if (count < 8) {
        guestTray.textContent = TRAY_WORDS[headline.size] + ' tray, or individual meals';
      } else {
        guestTray.textContent = TRAY_WORDS[headline.size] + ' tray';
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

     The submit is always stopped: nothing on this page reloads, whichever
     way the request goes out. In order:

       1. the required fields are checked here rather than by the browser,
          so the message under the button can name what is missing
       2. EmailJS sends the form, if it loaded
       3. if it did not, the visitor's own email app opens with the answers
          filled in, addressed to CATERING_EMAIL

     EMAILJS READS THE FORM ITSELF. sendForm() walks the <form> and takes
     every field by its name attribute - including the service radios, which
     a hand-built object would have had to special-case. So the names in
     catering.html are the contract with the EmailJS template: name, phone,
     email, event_date, guests, package, location, service, notes. Change one
     in the page and change it in the template, or that line arrives empty.

     THE BUTTON IS DISABLED WHILE IT SENDS, and a flag blocks a second
     submit, because a slow network is exactly when someone presses again.
     Both are released whichever way the send ends.
     ------------------------------------------------------------------------- */
  var form = document.getElementById('requestForm');
  var status = document.getElementById('formStatus');
  var sending = false;

  function say(message, state) {
    if (!status) return;
    status.textContent = message;
    status.setAttribute('data-state', state || 'ok');
  }

  if (form) {
    // Hand the public key over once, at load, rather than on every submit.
    if (window.emailjs && EMAILJS_PUBLIC_KEY) {
      try {
        window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      } catch (err) {
        // An old copy of the SDK takes the key as a bare string instead.
        try { window.emailjs.init(EMAILJS_PUBLIC_KEY); } catch (err2) {}
      }
    }

    form.addEventListener('submit', function (event) {
      // Always. The page does not reload, whatever happens next.
      event.preventDefault();
      if (sending) return;

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
        say('Please fill in: ' + missing.join(', ') + '.', 'error');
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      var button = form.querySelector('button[type="submit"]');
      var release = function () {
        sending = false;
        if (button) button.disabled = false;
      };

      if (window.emailjs && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID) {
        sending = true;
        if (button) button.disabled = true;
        say('Sending your request...', 'ok');

        window.emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
          .then(function () {
            release();
            form.reset();
            say('Request sent. We will be in touch.', 'ok');
          })
          .catch(function () {
            release();
            // Deliberately not the raw error. It would say something like
            // "412 Gmail_API: invalid grant", which tells a visitor nothing
            // and worries them. The two ways to reach us do.
            say(
              'Sorry, that did not send. Please call 647-929-3924 or ' +
              'email ' + CATERING_EMAIL + '.',
              'error'
            );
          });
        return;
      }

      // EmailJS did not load. Build an email instead, so the answers are not
      // lost - the visitor just presses send in their own mail app.
      if (form.getAttribute('data-mailto-fallback') !== 'true') {
        say('Sorry, the form is not available. Please call 647-929-3924.', 'error');
        return;
      }

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
