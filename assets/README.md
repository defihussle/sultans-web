# assets

Put images, the logo and any PDFs in this folder.

## Images the page is already set up for

| File name you should use | Where it appears | What works best |
|---|---|---|
| `hero-trays.jpg` | Top of the page, beside the headline | Wide, bright, well-lit photo of a full catering spread. About 1600 x 1200 px. |
| `share-image.jpg` | The preview card when someone shares the link | Exactly 1200 x 630 px. Logo plus one strong food photo. |
| `favicon.png` | Browser tab icon | Square, 180 x 180 px (not wired up yet — see note below). |

The page shows a dashed grey box where `hero-trays.jpg` should go. To swap in
the real photo:

1. Save the photo in this folder as `hero-trays.jpg`.
2. Open `index.html` and search for `EDIT: HERO IMAGE`.
3. Delete the `<div class="media-ph ...">` block.
4. Remove the `<!--` and `-->` around the `<img>` line just above it.

## To add the tab icon

Save a square image here as `favicon.png`, then add this line inside
`<head>` in `index.html`:

```html
<link rel="icon" href="assets/favicon.png">
```

## Photo tips

- Export as JPG, quality around 75%. Aim to keep each file under 400 KB so the
  page stays fast on a phone.
- Name files in lower case with hyphens, no spaces: `buffet-table.jpg`, not
  `Buffet Table.JPG`.
- Always write a short `alt="..."` description on every `<img>`. It is what
  screen readers read out and what Google uses.
