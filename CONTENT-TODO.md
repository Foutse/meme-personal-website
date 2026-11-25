# Items to confirm with Prof. Momo

Not published as a page (excluded in `_config.yml`). Remove items as they are resolved.

## Accuracy
- [ ] **Bio** (`_data/profile.yml` → `bio`): now follows the profile paragraph of his Nov 2026 CV, in the first person. Does he approve the wording?
- [x] **Current roles**: Academic Secretary since 2023; coordinator of the FOAD/AUF Master's (renamed from Contrôle qualité to Assurance qualité) and of the Instrumentation Master's, both since 2024 and still current.
- [x] He is a physicist, not a biomedical engineer: wording fixed on the site (site and both CV PDFs).
- [x] **Thesis title 2020**: "image plantaire" (sole of the foot). Fixed.
- [x] **Student names**: full names approved.
- [ ] **Project pages** (`_data/projects.yml` → `body`): written from the paper abstracts and thesis titles. Check facts and wording, especially the three projects built from theses only (radiation safety, hospital design, digital microscope).
- [ ] **Home-page headline**: "Affordable medical devices for hospitals in Africa" (`_data/i18n.yml` → `tagline`). Does it describe his work as he would?
- [ ] **Master's projects text** (`profile.yml` → `students`): OK to invite students to email him?

## Content to send
- [ ] **Abstracts of the two CPS conference proceedings** (2013, 2015): not online. Paste them as `abstract:` on those two entries in `_data/publications.yml`.
- [ ] **Teaching details**: ~270 hours a year (added). Still missing: typical class sizes, and courses he created (e.g. for the FOAD Master's).
- [ ] **Device photos**: he says they are in the papers. Publisher figures are copyrighted unless the paper is open access (CC BY), so ask for the original photo files. Landscape, ~1200 px wide → `assets/img/projects/`, then add `image:` in `_data/projects.yml`.
- [ ] **Portrait**: the site now uses the beige-wall photo, but the only copy is small (246 px). Ask for the original file or a higher-resolution version.
- [ ] **ORCID and ResearchGate**: he has both. Need the two links → `profile.yml` (`orcid:`, `researchgate:`).
- [ ] **Recent news**: 2026 Master's defences coming soon; papers under review. Add when they happen → `_data/news.yml` (and `_data/theses.yml`).
- [x] **Grants**: none yet (Nov 2026). Add a Funding section to the CV page when there is one.
- [ ] Anything from LinkedIn missing from the CV (awards, projects, collaborations).

## For the site owner
- [ ] Register https://foutsemomo.com in Google Search Console and submit `https://foutsemomo.com/sitemap.xml`.
- Citation counts are no longer shown on the site (Nov 2026). `cites` in `publications.yml` still orders the home page's selected publications.
