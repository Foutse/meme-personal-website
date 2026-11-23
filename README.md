# Foutse Momo — academic website

Personal website of Dr Foutse Momo, Associate Professor (Maître de Conférences) of Physics,
Université des Montagnes, Bangangté, Cameroon.

Plain HTML + CSS, no build step, bilingual (English / French), hosted on GitHub Pages.

## Files
- `index.html` — all content. Every text appears twice: `<span lang="en">…</span><span lang="fr">…</span>`.
  Edit both when changing text.
- `assets/css/style.css` — design (colours at the top, dark mode included).
- `assets/img/foutse-momo.jpg` — portrait (480×480).

## Common updates
- **New publication:** copy an `<li data-topic="…">` block in the Publications section, under the right
  year heading. `data-topic` is `bio` (biomedical instrumentation) or `nl` (lasers / nonlinear dynamics).
- **Citation numbers:** update the stats block near the top and the "Nov 2026" note.
- **New thesis:** add a `<tr>` to the supervision table and update the count (24).

## Language
Visitors get French if their browser is in French, English otherwise; the FR/EN button switches and
remembers the choice. Direct links: `…/?lang=fr` or `…/?lang=en`.

## Preview locally
`python3 -m http.server` then open http://localhost:8000

## Publish
Settings → Pages → Deploy from a branch → `main` / root.
URL: https://foutse.github.io/meme-personal-website/
(GitHub Pages on a private repo needs a paid plan; otherwise make the repo public.)
