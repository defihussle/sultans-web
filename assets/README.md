# assets

Put images, video, the logo and any PDFs in this folder.

## Files the page is already set up for

| File name to use | Where it appears | What works best |
|---|---|---|
| `hero.mp4` | The full-screen video, on tablets and computers | Wide (16:9), **no sound**, about 1600 × 900, under 5 MB. |
| `hero-mobile.mp4` | The same video on phones, cropped upright | Tall (9:16), **no sound**, about 608 × 1080, under 4 MB. |
| `hero-poster.jpg` | The still shown while the video loads | A good frame from the video, about 1600px wide. |
| `share-image.jpg` | The preview card when someone shares the link | Exactly 1200 × 630 px. Logo plus one strong food photo. |
| `favicon.png` | The browser tab icon | Square, 180 × 180 px. |

## ⚠ Replacing the hero video

**A file straight out of a camera or an editor will not work.** Those are
often 100–300 MB, and:

- GitHub refuses any file over **100 MB**
- the web host refuses any file over **25 MB**
- a visitor on a phone would wait minutes and burn their data

The two files in this folder were made from a 227 MB, 4K, 36-second master.
Compressed for the web they are about **3–5 MB each**, and look the same on
screen.

When you have a new clip, send the master to whoever maintains the site and
ask for web versions, or make them yourself with a free tool such as
HandBrake:

- **Wide version** → `hero.mp4`, 1600 × 900, no audio track
- **Phone version** → `hero-mobile.mp4`, crop the middle of the frame to an
  upright 9:16 shape, 608 × 1080, no audio track
- Aim for roughly 3–5 MB each. Turn on "web optimized" / "fast start" so it
  begins playing before the whole file arrives.

Keep the master somewhere else (Drive, Dropbox). It should not live in this
folder — the site ignores `.mov` files for exactly this reason.

## Adding the hero video or photo

The hero works without either — it falls back to a deep purple gradient, which
is a finished look, not a broken one. To add media:

1. Save the file here.
2. Open `index.html` and search for `EDIT: HERO`.
3. You will find a **VIDEO SLOT** and a **PHOTO SLOT**, both commented out.
   Pick one, remove the `<!--` and `-->` around it, set the file names.
4. Use one or the other, never both.

A dark overlay sits on top of whatever you add, so the headline stays readable.
Pick media that is reasonably dark or evenly lit on the left-hand side, where
the text sits.

## Adding the tab icon

Save a square image here as `favicon.png`, then add this line inside `<head>`
in `index.html`:

```html
<link rel="icon" href="assets/favicon.png">
```

## File tips

- Export photos as JPG at about 75% quality. Keep each under 400 KB so the page
  stays fast on a phone.
- Video is the heaviest thing on any website. Compress it before uploading, and
  treat 5 MB as a hard ceiling.
- Name files in lower case with hyphens and no spaces: `buffet-table.jpg`, not
  `Buffet Table.JPG`.
- Always write a short `alt="..."` description on every `<img>`. It is what
  screen readers announce and what Google reads.

## Brand marks (added November 2026)

| File | What it is | Where it shows |
| --- | --- | --- |
| `icon-shawarma.png` | Gold shawarma spit | The section label above every menu: "The menu" (home), "By the tray" (catering), "Individual meals" (menu) |
| `icon-pin.png` | Gold location pin | The "Locations" section label on the home page |
| `icon-instagram.png` | Instagram glyph | Footer, every page |
| `icon-facebook.png` | Facebook glyph | Footer, every page |
| `halal-badge.png` | The two-tone purple halal mark | Catering page, beside the dietary options |
| `pattern-tile.png` | One seamless tile of the geometric pattern | Behind the two full-width purple bands |

**The four icons are used as masks, not pictures.** The file supplies the shape
and the stylesheet supplies the colour, which is how the same Instagram file
can be white in the footer and how the shawarma always matches the brand gold
exactly. To replace one, save a new PNG **with a transparent background** over
the old file name. Any colour in the file is ignored.

The halal badge is the exception: it is a normal picture and keeps its own
purple, so it needs a light background. Do not display it below about 5rem
wide, or the ring turns to mush.

`pattern-tile.png` is a single 453x266 tile cut from the artwork, not the whole
sheet. It repeats seamlessly, so it is a few KB instead of a few hundred. If a
new pattern is supplied, the tile has to be cut on the pattern's own repeat or
the joins will show.

## The wordmark (added November 2026)

| File | What it is | Where it shows |
| --- | --- | --- |
| `wordmark-purple.png` | The "sultan's" lettering in brand purple, 791x200 | Anywhere the brand name is set in display type on a light background: the "Why sultan's" heading and the "sultan's Spread" card title on the catering page |
| `wordmark-white.png` | The same lettering in white, 289x74 | The same job on a purple background: the About band on the home page, and the copyright line in every footer |
| `tag-white.png` | The `#eatlikeasultan` mark in white, 877x163 | The footer on all three pages, and the dish ticker on the home page |

**These are pictures, not masks.** There is no CSS that can tell what colour
is behind an image, so the right file has to be chosen by hand: purple on
anything light, white on anything purple. Get it wrong and the mark simply
disappears.

**They are not the logo.** `logo-purple.png` and `logo-white.png` are the full
lockup, with MEDITERRANEAN GRILL set under the name, and they stay in the
header and at the top of the footer. The wordmark is the name on its own, for
use inside a line of type.

**Every one of them needs alt text.** It is a word, and it has to read as a
word to a screen reader and when an image fails: `alt="Sultan's"` for the two
wordmarks, `alt="#eatlikeasultan"` for the tag.

There is no purple version of the hashtag mark. If it is ever wanted on cream,
ask the client for one rather than recolouring the white file - it will not
take a colour.

## The food cut-outs (added November 2026)

| File | What it is | Where it shows |
| --- | --- | --- |
| `tray-chicken-kebab.png` | A tray of chicken kebab, 900x460 | Beside the Mains rows on the catering page |
| `tray-hummus-platter.png` | A hummus and vegetable tray, 560x910 | Beside the Dips rows on the catering page |
| `platter-mediterranean.png` | The round mezze platter, 760x752 | The Mediterranean Platter package card |

**These are cut-outs, and that is the whole point of them.** Each one is just
the tray or the platter; everything around it — table, cloth, dip bowls,
lemon wedges, background — is transparent. That is what lets them sit on the
page with no frame, no border and no card. The stylesheet draws nothing
behind them.

**If you replace one, replace it with another cut-out PNG.** A normal
rectangular photo will read as a pasted-on box, because there is no frame to
excuse it.

**They are 8-bit palette PNGs, not 24-bit.** A photo saved as a full-colour
PNG with transparency runs to about 1.5 MB; the same picture on a 255-colour
palette is about a fifth of that and, at the size these are shown, looks the
same. If you export a new one, do the same — a 1.5 MB tray photo is three
times the whole rest of the page.

Sized for roughly twice their display size, which covers a retina screen.
There is no point going larger.

`tray-salad.png` (1000x500) was added the same way and closes the catering
menu, under the four courses. It is the only one of the four that shows on a
phone as well: the other three sit beside something, and this one sits on its
own line.

## The tab icon and the diamond (added November 2026)

| File | What it is | Where it shows |
| --- | --- | --- |
| `favicon.png` | The purple shawarma mark, 512x512, transparent | The browser tab, every desktop browser |
| `apple-touch-icon.png` | The same mark, 180x180, **on white** | The iOS home screen |
| `icon-diamond.png` | One diamond from the brand's four, 96x96 | Between the dish names in the ticker on the home page |

**The Apple icon carries its own white tile and the other does not.** iOS
ignores transparency on a home-screen icon and fills it black, so that one is
flattened onto white on purpose. The filename is what iOS looks for; do not
rename it. There is no `.ico` - nothing still in use needs one.

**The diamond is used as a mask, like the other icons above**, so the gold
comes from the stylesheet and not from the file. The source artwork is four
diamonds in a cluster; only one was wanted, so it is cut out of the top one.

## The three tray photographs

`tray-chicken-kebab.webp`, `tray-hummus-platter.webp` and
`platter-mediterranean.webp` are the client's own photographs, placed as
supplied: nothing cropped, masked or cut out. Each file already fades to
transparent at its edges, which is why they need no frame.

**They are WebP, not PNG, and that is the only change made to them.** The same
three as transparent PNGs come to 3.5 MB; as WebP they are 390 KB together and
look identical. Every browser that can run the rest of this site can read
WebP. If you ever need PNG, re-export from the originals at the same pixel
sizes - do not convert these.
