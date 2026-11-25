# Items to confirm with Prof. Momo

Not published as a page (excluded in `_config.yml`). Remove items as they are resolved.

## Accuracy
- [ ] **Bio** (`_data/profile.yml` → `bio`): now follows the profile paragraph of his Nov 2026 CV, in the first person. Does he approve the wording?
- [ ] **Current roles**: he confirmed he is still Academic Secretary (now "since 2023"). He confirmed he coordinates the FOAD/AUF Master's in 2026/2027 (added). Did he also coordinate in 2025/2026, and is the Instrumentation Master's still his? (`_data/career.yml`)
- [x] He is a physicist, not a biomedical engineer: wording fixed on the site (site and both CV PDFs).
- [ ] **Thesis title 2020**: "image **planétaire**" or "image **plantaire**"? (`_data/theses.yml`; the English title is generic until confirmed)
- [ ] **Student names**: OK to list the 24 students by name? (common practice; otherwise initials only)
- [ ] **Project pages** (`_data/projects.yml` → `body`): written from the paper abstracts and thesis titles. Check facts and wording, especially the three projects built from theses only (radiation safety, hospital design, digital microscope).
- [ ] **Home-page headline**: "Affordable medical devices for hospitals in Africa" (`_data/i18n.yml` → `tagline`). Does it describe his work as he would?
- [ ] **Master's projects text** (`profile.yml` → `students`): OK to invite students to email him?

## Content to send
- [ ] **Abstracts of the two CPS conference proceedings** (2013, 2015): not online. Paste them as `abstract:` on those two entries in `_data/publications.yml`.
- [ ] **Teaching details**: hours per year, typical class sizes, and any courses he created or designed (e.g. for the AUF distance-learning Master's). Would make the Teaching page much stronger (`_data/teaching.yml`, `_data/programmes.yml`).
- [ ] **Device photos**: incubators, dental unit, phonocardiograph, bioimpedance system, digital microscope, egg incubator. Landscape, ~1200 px wide → `assets/img/projects/`, then add `image:` in `_data/projects.yml`.
- [ ] **Portrait**: the site now uses the beige-wall photo, but the only copy is small (246 px). Ask for the original file or a higher-resolution version.
- [ ] **ORCID iD** (create one at orcid.org if none) and ResearchGate URL → `profile.yml`.
- [ ] **Recent news** (2026): talks, defences, new roles, papers → `_data/news.yml`.
- [ ] Anything from LinkedIn missing from the CV (awards, projects, collaborations).

## For the site owner
- [ ] Register https://foutsemomo.com in Google Search Console and submit `https://foutsemomo.com/sitemap.xml`.
- Citation counts are no longer shown on the site (Nov 2026). `cites` in `publications.yml` still orders the home page's selected publications.
