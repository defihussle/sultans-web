# assets

Put images, video, the logo and any PDFs in this folder.

## Files the page is already set up for

| File name to use | Where it appears | What works best |
|---|---|---|
| `hero.mp4` | Behind the hero headline | Short, quiet, looping clip. 8–15 seconds, **no sound**, under 5 MB. |
| `hero-poster.jpg` | The still frame shown while the video loads | A good-looking frame from the video, about 2000px wide. |
| `hero.jpg` | Behind the hero headline (instead of video) | Wide, bright photo of a full catering spread, about 2000px wide. |
| `share-image.jpg` | The preview card when someone shares the link | Exactly 1200 × 630 px. Logo plus one strong food photo. |
| `favicon.png` | The browser tab icon | Square, 180 × 180 px. |

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
