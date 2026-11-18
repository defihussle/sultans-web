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
