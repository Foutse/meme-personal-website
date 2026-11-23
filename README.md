# foutsemomo.com

Academic website of Dr Foutse Momo, Associate Professor of Physics, Université des Montagnes (Cameroon).
English at `/`, French at `/fr/`, CV as PDF in both languages.

Built with Jekyll, which GitHub Pages runs automatically on every push to `main`.

## Where the content lives
All text is in `_data/` (YAML). Each entry has an `en:` and an `fr:` version where needed.

| File | Content |
|---|---|
| `_data/profile.yml` | name, bio, links, contact, citation metrics, Master's-projects text |
| `_data/news.yml` | news items (newest first; the 4 most recent are shown) |
| `_data/research.yml` | research strands and themes |
| `_data/projects.yml` | device/project cards (optional `image:`) |
| `_data/publications.yml` | publications (newest first) |
| `_data/talks.yml` | conference presentations |
| `_data/teaching.yml` | courses |
| `_data/theses.yml` | supervised Master's theses |
| `_data/career.yml` | experience, education, ranks, memberships |
| `_data/i18n.yml` | interface labels in both languages |

Layouts: `_layouts/home.html` (both language pages) and `_layouts/cv.html` (CV).
Open questions for Prof. Momo: `CONTENT-TODO.md`.

## Common updates
- **New paper:** copy a block in `_data/publications.yml`, keep newest first. `topic: bio` or `nl`.
- **Citations:** `metrics` in `profile.yml` and `cites` in `publications.yml`.
- **News:** add an item at the top of `_data/news.yml`.

Small text edits can be made directly on github.com (pencil icon); the site rebuilds in about a minute.

## CV PDFs
`assets/cv/*.pdf` are generated from the data. After changing content, regenerate them:

```sh
sh tools/build.sh   # needs Docker and Google Chrome
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
