/* ===========================================================================
   SULTAN'S - STORE PAGES (locations/*.html only)
   ===========================================================================
   Fills in the hours, phone number and address of one store from Google
   Places. The store is the Place ID on the page's <main data-place-id="...">.

   If Google cannot be reached, the page keeps the address typed into the
   HTML and points people to Google Maps for the hours. Nothing breaks.

   THE KEY BELOW IS PUBLIC BY DESIGN - every visitor's browser sends it.
   What keeps it safe is the restriction set on it in the Google Cloud
   console: HTTP referrers sultansgrill.ca/*, and only the Places API (New)
   and the Maps Embed API. The same key is in the map <iframe> on each page.
   =========================================================================== */

(function () {
  'use strict';

  var GOOGLE_MAPS_KEY = 'AIzaSyCNU9_quQisZD_KVUIjlWhZG9QEjmOOnIk';

  var main = document.querySelector('[data-place-id]');
  if (!main || !window.fetch) return;

  var placeId = main.getAttribute('data-place-id');
  var hoursEl = document.querySelector('[data-place-hours]');
  var openEl = document.querySelector('[data-place-open]');
  var addrEl = document.querySelector('[data-place-address]');
  var phoneBlock = document.querySelector('[data-place-phone-block]');
  var phoneEl = document.querySelector('[data-place-phone]');
  var mapsLink = document.querySelector('[data-place-maps]');

  var FIELDS = [
    'formattedAddress',
    'nationalPhoneNumber',
    'internationalPhoneNumber',
    'regularOpeningHours.weekdayDescriptions',
    'currentOpeningHours.openNow',
    'businessStatus'
  ].join(',');

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  // "Monday: 10:30 AM – 3:00 PM" -> one row of the list, today in bold.
  function showHours(lines) {
    hoursEl.innerHTML = '';
    // Google lists Monday first; getDay() counts from Sunday.
    var today = (new Date().getDay() + 6) % 7;
    lines.forEach(function (line, i) {
      var cut = line.indexOf(': ');
      var row = el('li', i === today ? 'is-today' : '');
      row.appendChild(el('span', 'store-day', cut > -1 ? line.slice(0, cut) : line));
      row.appendChild(el('span', 'store-time', cut > -1 ? line.slice(cut + 2) : ''));
      hoursEl.appendChild(row);
    });
  }

  function showHoursFallback(message) {
    hoursEl.innerHTML = '';
    var row = el('li', 'store-hours-note', message + ' ');
    if (mapsLink) {
      var a = el('a', '', 'See them on Google Maps');
      a.href = mapsLink.href;
      a.target = '_blank';
      a.rel = 'noopener';
      row.appendChild(a);
    }
    hoursEl.appendChild(row);
  }

  // "100 Wellington St W, Toronto, ON M5J 2R2, Canada" -> two lines:
  // the street, then "Toronto, ON M5J 2R2".
  function showAddress(formatted) {
    var parts = formatted.replace(/,\s*Canada$/, '').split(/,\s*/);
    if (parts.length < 3) return;
    var line2 = parts.splice(-2).join(', ');
    addrEl.textContent = parts.join(', ');
    addrEl.appendChild(document.createElement('br'));
    addrEl.appendChild(document.createTextNode(line2));
  }

  fetch('https://places.googleapis.com/v1/places/' + encodeURIComponent(placeId), {
    headers: {
      'X-Goog-Api-Key': GOOGLE_MAPS_KEY,
      'X-Goog-FieldMask': FIELDS
    }
  })
    .then(function (res) {
      if (!res.ok) throw new Error('Places ' + res.status);
      return res.json();
    })
    .then(function (place) {
      var hours = place.regularOpeningHours && place.regularOpeningHours.weekdayDescriptions;
      if (hours && hours.length) showHours(hours);
      else showHoursFallback('Hours are not listed yet.');

      if (place.businessStatus && place.businessStatus !== 'OPERATIONAL') {
        openEl.textContent = 'Temporarily closed';
        openEl.className = 'store-open is-closed';
        openEl.hidden = false;
      } else if (place.currentOpeningHours && typeof place.currentOpeningHours.openNow === 'boolean') {
        var open = place.currentOpeningHours.openNow;
        openEl.textContent = open ? 'Open now' : 'Closed now';
        openEl.className = 'store-open ' + (open ? 'is-open' : 'is-closed');
        openEl.hidden = false;
      }

      if (place.formattedAddress && addrEl) showAddress(place.formattedAddress);

      if (place.nationalPhoneNumber && phoneEl) {
        phoneEl.textContent = place.nationalPhoneNumber;
        phoneEl.href = 'tel:' + (place.internationalPhoneNumber || place.nationalPhoneNumber).replace(/[^\d+]/g, '');
        phoneBlock.hidden = false;
      }
    })
    .catch(function () {
      showHoursFallback('Hours could not be loaded.');
    });
})();
