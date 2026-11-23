# Personal academic website

A static site (plain HTML + CSS, no build step) hosted on GitHub Pages.

## Editing
- **Content:** `index.html`. Every `[bracketed]` text is a placeholder to replace.
- **Photo:** replace `assets/img/portrait.svg` with e.g. `assets/img/portrait.jpg` and update the `src` in `index.html`.
- **CV:** add `assets/cv.pdf`.
- **Styling:** `assets/css/style.css` (colours are at the top).

Preview locally: `python3 -m http.server` then open http://localhost:8000.

## Publishing
Repo **Settings → Pages → Build and deployment → Deploy from a branch → `main` / root**.
The site appears at `https://foutse.github.io/meme-personal-website/`.
