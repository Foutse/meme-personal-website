#!/usr/bin/env python3
"""Create the page files for every project in _data/projects.yml (English and French).

Run after adding a project:  python3 tools/make-project-pages.py
Existing pages are rewritten; pages of removed projects are deleted.
"""
import os, re, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data = open(os.path.join(ROOT, '_data', 'projects.yml'), encoding='utf-8').read()

# Minimal parsing: we only need slug.en, slug.fr, title.en, title.fr, text.en, text.fr.
projects = []
for block in re.split(r'\n(?=- slug:)', data):
    m = re.search(r'slug: \{ en: ([^,]+), fr: ([^ }]+) \}', block)
    if not m:
        continue
    t = re.search(r'title: \{ en: (.+?), fr: (.+?) \}', block)
    en_text = re.search(r'text:\n    en: "(.*)"\n    fr: "(.*)"', block)
    projects.append(dict(en=m.group(1).strip(), fr=m.group(2).strip(),
                         title_en=t.group(1).strip(), title_fr=t.group(2).strip(),
                         desc_en=en_text.group(1), desc_fr=en_text.group(2)))

for base in ('research', os.path.join('fr', 'recherche')):
    d = os.path.join(ROOT, base)
    for name in os.listdir(d):
        if os.path.isdir(os.path.join(d, name)):
            shutil.rmtree(os.path.join(d, name))

def q(s):
    return '"' + s.replace('\\', '\\\\').replace('"', '\\"') + '"'

for p in projects:
    for lang, base, slug, title, desc in (
        ('en', 'research', p['en'], p['title_en'], p['desc_en']),
        ('fr', 'fr/recherche', p['fr'], p['title_fr'], p['desc_fr']),
    ):
        path = os.path.join(ROOT, base, slug, 'index.html')
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w', encoding='utf-8') as f:
            f.write('---\nlayout: project\nlang: %s\nref: project-%s\nsection: research\nproject: %s\n'
                    'permalink: /%s/%s/\ntitle: { %s: %s }\ndescription: { %s: %s }\n---\n'
                    % (lang, p['en'], p['en'], base, slug, lang, q(title), lang, q(desc)))
    print('page:', p['en'], '/', p['fr'])
