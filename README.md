# Sultan's Mediterranean Grill — Catering Site

A single-page catering website. Plain HTML, CSS and JavaScript — no WordPress,
no plugins, no build step, nothing to update or renew. You edit the text by
opening one file and typing over the old words.

---

## 1. The files

```
index.html          All the text and structure of the page. 90% of your edits.
css/styles.css      Colours, fonts, spacing, layout.
js/script.js        A small script: the mobile menu and the quote form.
assets/             Images and PDFs. See assets/README.md.
README.md           This file.
```

To see the site, double-click `index.html` — it opens in your browser. Edit a
file, save it, then press refresh in the browser to see the change.

**Edit the files with a plain text editor**, not Word. Free options: VS Code
(recommended), Notepad++, or Notepad on Windows / TextEdit on Mac.

---

## 2. How to change the wording

Every section of `index.html` starts with a comment banner that looks like this:

```html
<!-- =========================================================
     ==== EDIT: CATERING PACKAGES ====
     ========================================================= -->
```

Use your editor's Find (Ctrl+F / Cmd+F) and search for `EDIT:` to jump between
them. The sections, in page order:

| Search for | What it controls |
|---|---|
| `EDIT: PAGE TITLE` | The browser tab text and the Google description |
| `EDIT: TOP BAR` | The thin announcement strip at the very top |
| `EDIT: HEADER & NAVIGATION` | The menu links |
| `EDIT: HERO` | The big headline, intro line, buttons, three benefits |
| `EDIT: HERO IMAGE` | Swapping in the main photo |
| `EDIT: DISH TICKER` | The slow-scrolling line of dish names |
| `EDIT: WHY SULTAN'S` | The three numbers and four reason cards |
| `EDIT: CATERING PACKAGES` | The package cards — **the section you'll edit most** |
| `EDIT: HOW TO BOOK` | The four numbered steps |
| `EDIT: LOCATIONS` | Every store address |
| `EDIT: REQUEST A QUOTE` | Phone, email, and the enquiry form |
| `EDIT: FOOTER` | Footer links and contact details |

### The golden rules

1. **Change the words, not the tags.** In `<h3>Sultan's Spread</h3>` you can
   safely replace `Sultan's Spread`. Leave `<h3>` and `</h3>` exactly as they are.
2. **Tags come in pairs.** An opening `<p>` always needs a closing `</p>`.
3. **To duplicate something, copy the whole block.** Copy from the opening tag
   to the matching closing tag, paste it below, then change the words.
4. **To remove something, delete the whole block** — opening tag, contents and
   closing tag together.
5. **Save a copy before a big edit.** Duplicate `index.html` as
   `index-backup.html` first. If something breaks, you can go back.
6. **Special characters.** Write `&amp;` instead of `&`, and `&middot;` for the
   dot separator. Normal apostrophes and quotation marks are fine.

---

## 3. Common jobs, step by step

### Add a new catering package

1. Search for `EDIT: CATERING PACKAGES`.
2. Select one whole `<article class="pkg">` … `</article>` block.
3. Copy it and paste it directly after the last `</article>`.
4. Change the name, the meta line, the description and the contents rows.
5. Delete the `<span class="pkg-badge">` line unless you want a badge on it.

Only **one** package should have `pkg-feature` on its `<article>` tag — that is
the one that sits raised and outlined in gold on desktop.

### Add or remove a location

1. Search for `EDIT: LOCATIONS`.
2. Copy one whole `<li class="loc">` … `</li>` block and change the name and
   address, or delete a block to close a location.
3. The `<p class="loc-tag">Now open</p>` line is optional — delete it when a
   store is no longer new.
4. To add hours or a phone number for a store, add this line inside the block:
   ```html
   <p class="loc-meta">Mon–Fri 10am–7pm &middot; 416-000-0000</p>
   ```

### Change the phone number or email

They appear in **three** places. Update all three:

1. The "How to book" step 2.
2. The contact list in the `EDIT: REQUEST A QUOTE` section.
3. The footer.

Also update `CATERING_EMAIL` on the first few lines of `js/script.js`.

In a phone link, keep the `tel:` format with the country code —
`<a href="tel:+16478032323">647-803-2323</a>`. The part after `>` is what
people see; the part in `tel:` is what their phone dials.

### Upload a new catering menu PDF

Put the PDF in `assets/`, then search `index.html` for `.pdf` and update
**both** links (the packages section and the footer) to
`assets/your-new-file.pdf`.

---

## 4. The quote form — read this before launch

**A plain HTML page cannot send email on its own.** Right now the form is set to
"Option A": when someone presses *Send request*, it opens **their** email app
with all the answers filled in, addressed to `catering@sultansgrill.ca`.

That works everywhere, but some people will abandon it. Before launch we
recommend **Option B**:

1. Sign up free at [formspree.io](https://formspree.io) (or Basin, or use
   Netlify Forms if hosting on Netlify).
2. They give you a URL like `https://formspree.io/f/abcdwxyz`.
3. In `index.html`, find `<form class="request-form" id="requestForm"` and
   change that line to:
   ```html
   <form class="request-form" id="requestForm" action="https://formspree.io/f/abcdwxyz" method="post">
   ```
   (Note the `data-mailto-fallback="true"` is gone.)

Requests then land in your inbox with no email app involved.

---

## 5. Things to confirm before the site goes live

These are marked `[PLACEHOLDER]` in the files — search for that word.

- [ ] **The catering email address.** `catering@sultansgrill.ca` is a guess; the
      old site published no email. Fix it in `index.html` and `js/script.js`.
- [ ] **Package pricing.** The three package cards say "pricing on request",
      matching the Victoria catering site. Replace with real figures or leave
      as is — your call.
- [ ] **The three numbers** in *Why Sultan's* (10 locations, 40+ guests per
      tray, $200 delivery threshold). Check they are still accurate.
- [ ] **Location list.** Ten addresses were taken from sultansgrill.ca. Four
      are missing postal codes there, and none have phone numbers or hours.
- [ ] **Hero photo** — see `assets/README.md`.
- [ ] **Social share image** (`assets/share-image.jpg`, 1200×630).
- [ ] **Browser tab icon** (`assets/favicon.png`).
- [ ] Decide on the form service (section 4 above).

---

## 6. Colours and fonts

Open `css/styles.css`. The first block, under **BRAND TOKENS**, holds every
colour and font on the site. Change a value there once and it updates
everywhere — you never hunt through the file.

```css
--purple-700: #2D1B4E;   /* the main brand purple  */
--gold-500:   #D4A23C;   /* the main accent gold   */
```

The purple and gold come from the existing Sultan's branding. The neutrals are
a warm off-white (`--cream`) and a soft near-black (`--ink`), chosen so text
stays easy to read.

Headings use **Fraunces** (a warm serif), body text uses **Inter**. Both load
free from Google Fonts via the `<link>` in `index.html`. To change them, swap
that `<link>` and the two `--font-...` lines in the CSS.

Do not edit anything below the **RESET & BASE** heading unless you are
comfortable with CSS — that part is the layout.

---

## 7. Publishing the site

It is three static files, so hosting is free and simple. Any of these work:

- **Netlify** — drag the whole folder onto app.netlify.com. Also gives you
  working forms for free.
- **Cloudflare Pages** or **GitHub Pages** — connect this repository and it
  publishes on every commit.
- **Your existing web host** — upload the folder by FTP.

Keep the folder structure intact. `index.html` must stay at the top level,
with `css`, `js` and `assets` as folders beside it.

---

## 8. What was carried over from the old sites

- **Copy direction, package structure and the four booking steps** follow
  [sultansvictoria.ca](https://sultansvictoria.ca), the catering page the
  client liked — rebuilt with stronger hierarchy, spacing and typography.
- **Brand voice, the "treated like royalty" idea, and all ten addresses** come
  from [sultansgrill.ca](https://sultansgrill.ca).
- **Prices and the full item list were deliberately left out** of this page.
  They change often and live in the catering PDF, which is linked twice.

## 9. Accessibility and performance notes

Already handled, worth not breaking:

- Every colour pairing meets WCAG AA contrast.
- The page works by keyboard alone, with a visible gold focus ring and a
  "Skip to content" link.
- Form fields use real `<label>` tags and 16px text, so iPhones do not zoom in
  when someone taps a field.
- Animations stop automatically for visitors who have "reduce motion" turned on.
- No images, no frameworks and no trackers, so the page loads in well under a
  second. Keep new photos compressed to keep it that way.
- The page prints cleanly (nav, form and decoration are hidden).
