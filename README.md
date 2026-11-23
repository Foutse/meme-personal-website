# foutsemomo.com

Academic website of Dr Foutse Momo, Associate Professor of Physics, Université des Montagnes (Cameroon).

| English | French |
|---|---|
| `/` home | `/fr/` |
| `/research/` + one page per project | `/fr/recherche/` + one page per project |
| `/publications/` | `/fr/publications/` |
| `/teaching/` | `/fr/enseignement/` |
| `/cv/` (+ PDF) | `/fr/cv/` (+ PDF) |

Built with Jekyll, which GitHub Pages runs automatically on every push to `main`.

## Where the content lives
All text is in `_data/` (YAML). Each entry has an `en:` and an `fr:` version where needed.

| File | Content |
|---|---|
| `_data/profile.yml` | name, bio, links, contact, citation metrics, Master's-projects text |
| `_data/news.yml` | news items (newest first; the 4 most recent are shown) |
| `_data/research.yml` | research strands and themes |
| `_data/projects.yml` | projects: card, full page text, related papers and theses (optional `image:`) |
| `_data/pubmeta.yml` | abstracts, free-PDF links and BibTeX per DOI (generated, Nov 2026) |
| `_data/citations_by_year.yml` | citations per year for the chart (from Google Scholar) |
| `_data/publications.yml` | publications (newest first) |
| `_data/talks.yml` | conference presentations |
| `_data/teaching.yml` | courses |
| `_data/theses.yml` | supervised Master's theses |
| `_data/career.yml` | experience, education, ranks, memberships |
| `_data/i18n.yml` | interface labels in both languages |

Layouts: `_layouts/base.html` (header, footer, meta tags) wraps `home`, `research`, `project`,
`publications`, `teaching` and `cvpage`.
Device drawings: `_includes/icon.html`. Fonts are self-hosted in `assets/fonts/`.
Open questions for Prof. Momo: `CONTENT-TODO.md`.

## Common updates
- **New paper:** copy a block in `_data/publications.yml`, keep newest first. `topic: bio` or `nl`.
- **Citations:** `metrics` in `profile.yml` and `cites` in `publications.yml`.
- **News:** add an item at the top of `_data/news.yml`.
- **Citations chart:** add or update the year in `_data/citations_by_year.yml`.
- **New project:** add a block to `_data/projects.yml`, then run `python3 tools/make-project-pages.py`
  to create its English and French pages.
- **Device photo:** put it in `assets/img/projects/` and add `image: /assets/img/projects/<file>.jpg`
  to the project; it replaces the drawing on the card and on the project page.

Small text edits can be made directly on github.com (pencil icon); the site rebuilds in about a minute.

## CV PDFs
`assets/cv/foutse-momo-cv-en.pdf` and `foutse-momo-cv-fr.pdf` are Prof. Momo's own CVs. To update
them, replace the two files (keep the names). When the CV changes, update the matching data files
too (`career.yml`, `teaching.yml`, `profile.yml`) so the site and the PDFs agree.

## Building locally
```sh
sh tools/build.sh   # needs Docker
```

The first time, build the Docker image used by the script:

```sh
docker build -t site-jekyll - <<'EOF'
FROM ruby:3.3
RUN gem install jekyll -v 3.10.0 --no-document && gem install jekyll-sitemap -v 1.4.0 kramdown-parser-gfm webrick --no-document
WORKDIR /site
EOF
```

## Hosting
GitHub Pages from `main` (root). Custom domain `foutsemomo.com` (`CNAME` file), DNS at Porkbun:
4 A records to GitHub (185.199.108–111.153) and `www` CNAME to `foutse.github.io`.
