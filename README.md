# Portfolio

Personal portfolio site for Benoy Joseph. Live at **https://benoy-joseph.vercel.app**. It's plain HTML, CSS and JavaScript with no build step.

## Files

- `index.html`: all page content (experience, projects, skills, education, contact)
- `styles.css`: styles, with light and dark themes defined as CSS variables at the top
- `main.js`: theme toggle, mobile menu, scroll reveal, active nav link
- `assets/`: résumé PDF and project screenshots
- `vercel.json`: clean URLs and cache headers

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. On [vercel.com/new](https://vercel.com/new), import the repo. Set Framework Preset to **Other** and leave the build command empty.
3. Deploy. Each push to `main` then redeploys automatically (already set up for this repo).

To update the résumé, replace `assets/Benoy_Joseph_Resume.pdf` with the new file under the same name.
