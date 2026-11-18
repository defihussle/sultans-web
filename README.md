# Sultan's Mediterranean Grill — Catering Site

A single-page catering website. Plain HTML, CSS and JavaScript — no WordPress,
no plugins, no build step, nothing to update or renew. You edit the text by
opening one file and typing over the old words.

---

## 1. The files

```
index.html          All the text and structure of the page. 90% of your edits.
css/styles.css      Colours, fonts, spacing, layout.
js/script.js        A small script: the mobile menu, the sticky header and
                    the quote form. Nothing else depends on it.
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
| `EDIT: HEADER & NAVIGATION` | The menu links |
| `EDIT: HEADER PHONE NUMBER` | The phone number in the top bar |
| `EDIT: HERO` | The headline and the video/photo slot |
| `EDIT: THE THREE CHOICE CARDS` | Catering / Locations / Menu — the first thing visitors act on |
| `EDIT: HERO TRUST BAR` | The four short proof points across the bottom of the hero |
| `EDIT: DISH TICKER` | The slow-scrolling line of dish names |
| `EDIT: WHY SULTAN'S` | The three numbers and four reason cards |
| `EDIT: CATERING PACKAGES` | The package cards — **the section you'll edit most** |
| `EDIT: A LA CARTE` | The catering PDF callout |
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

Every package card is built from the same three pieces, so you can copy any of
them:

```
<article class="pkg">
  <div class="pkg-main">   badge, name, the meta line, the description
  <div class="pkg-aside">  the tinted "what's included" panel
  <div class="pkg-foot">   the price line and the button
</article>
```

1. Search for `EDIT: CATERING PACKAGES`.
2. Select one whole `<article class="pkg">` … `</article>` block.
3. Copy it and paste it directly after the last `</article>`.
4. Change the name, the meta line, the description and the included rows.
5. Delete the `<span class="pkg-badge">` line unless you want a badge on it.

Only **one** package should carry `pkg-feature` on its `<article>` tag. That is
the wide one at the top, where the "what's included" panel moves to the right
on desktop. If you want a different package featured, remove `pkg-feature`
from the current one first, or you will get two wide cards.

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

### Change the three choice cards

The first screen asks one question — *where would you like to start?* — and
offers three answers: **Catering**, **Locations** and **Menu**. These are the
most important links on the site.

Search for `EDIT: THE THREE CHOICE CARDS`. Each one is a single
`<a class="choice"> … </a>` block holding an icon, a title, one line of
description, and an arrow.

- **To change the words** — edit the text inside `<span class="choice-title">`
  and `<span class="choice-desc">`. Keep the description to about six words so
  it stays on one or two lines on a phone.
- **To re-point a card** — change its `href`. It can be a section on this page
  (`#locations`) or a whole other page (`menu.html`).
- **To reorder** — move a whole `<a>` block up or down.
- **To change which one is highlighted** — the class `choice-primary` gives a
  card the gold treatment. It is on Catering. Put it on one card only.
- **The icons** are inline SVG, so there are no image files to manage. If you
  are not comfortable editing SVG, leave the `<span class="choice-icon">`
  blocks alone and only change the words.

Three is the right number. A fourth will squash them on a phone, and the point
of the screen is a quick, easy choice.

### Turn the Menu card into a real page

The Menu card currently points at `#menu`, which is the catering menu block
further down this page (the one with the PDF button). That is a real
destination, so nothing is broken — but a proper menu page would be better.

When you build one:

1. Create `menu.html` in the same folder as `index.html`.
2. Change `href="#menu"` to `href="menu.html"` in **two** places — the Menu
   choice card, and the Menu link in the header navigation. Both are marked
   with a comment saying so.

That is the only change needed. You can leave the `id="menu"` on the catering
menu block either way.

### Add the hero video or photo

The hero currently shows a deep purple gradient. That is a finished look on its
own — nothing appears broken or missing — but a real video or photo behind it
lifts the page a lot.

1. Put the file in the `assets` folder.
2. Search `index.html` for `EDIT: HERO`.
3. You'll find a **VIDEO SLOT** and a **PHOTO SLOT**, both commented out.
   Pick one, remove the `<!--` and `-->` around it, and set the file names.
4. Use one or the other, never both.

For video: short, quiet, looping, **no sound**, 8–15 seconds, under 5 MB.
For a photo: wide, bright, around 2000px across.

The dark overlay on top keeps the headline readable either way, so you do not
need to edit any CSS.

### Change the phone number or email

The phone number appears in **four** places. Update all of them:

1. The header bar (`EDIT: HEADER PHONE NUMBER`).
2. The line under the hero buttons.
3. The "How to book" step 2.
4. The contact list in `EDIT: REQUEST A QUOTE`, and the footer.

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
- [ ] **Hero video or photo** — optional but recommended. See the section
      above, and `assets/README.md`.
- [ ] **Social share image** (`assets/share-image.jpg`, 1200×630).
- [ ] **Browser tab icon** (`assets/favicon.png`).
- [ ] Decide on the form service (section 4 above).
- [ ] **The Menu card** points at the catering PDF block for now. Decide
      whether to build a real `menu.html` page (see section 3).

---

## 6. Colours and fonts

Open `css/styles.css`. The first block, under **BRAND TOKENS**, holds every
colour and font on the site. Change a value there once and it updates
everywhere — you never hunt through the file.

The colours are sampled from the Sultan's brand site, sultansvictoria.ca, so
the two sit side by side without clashing.

```css
--plum-700: #2B1645;   /* deep plum  - headings, dark bands */
--plum-500: #6B3FA0;   /* brand violet - anything you click */
--gold-500: #C8A24A;   /* the accent gold */
--sand-50:  #FAF8F4;   /* the page background - warm cream */
```

**The brand runs on two purples**, and the scale is built to reflect that.
Low numbers are dark, high numbers are light:

| Steps | What they are | Used for |
|---|---|---|
| `--plum-950` … `--plum-700` | deep plum, `#150A24` → `#2B1645` | headings, the dark hero, the footer |
| `--plum-600` … `--plum-400` | bright violet, `#5A3289` → `#8A62B8` | links, buttons, focus rings, dietary pills |
| `--plum-100`, `--plum-050` | pale violet tints | pill backgrounds, soft panels |

| Family | Dark end | Main | Light end |
|---|---|---|---|
| Gold | `--gold-700` `#715515` | `--gold-500` `#C8A24A` | `--gold-100` `#F7EFDC` |
| Cream / ink | `--ink-900` `#2A2233` | `--ink-600` `#574E63` | `--sand-50` `#FAF8F4` |

**The page sits on cream, not white.** `--sand-50` is the background and
`--sand-100` (`#F3F1EE`) is the alternating band. White is reserved for cards,
so they lift off the page instead of blending into it.

**Two gold rules worth knowing.** `--gold-500` is the real brand gold, but it
is too light to read as text on cream — so use `--gold-600` or `--gold-700`
for gold **text on a light background**, and `--gold-400` for gold text **on
deep purple**. Every text and button pairing on the site has been checked and
clears the WCAG AA contrast minimum.

Green appears in exactly one place, the "message sent" line on the form, where
green carries meaning. Everything else is purple, gold or cream.

Below the colours there is a second group called **SEMANTIC ROLES**
(`--accent`, `--text`, `--bg`, `--bg-alt`, `--surface` and so on). Those say
what each colour is *used for*. Re-pointing one of those changes the whole
site at once.

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

<!-- deploy trigger -->
