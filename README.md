# FlagTrainer

FlagTrainer is a static web app for learning country flags through an interactive quiz. Progress is saved in the browser.

## Project Structure

```
html/           — pages (incl. settings.html)
css/            — styles
js/             — logic (incl. i18n.js)
data/           — flags.json
locales/
├── en.json     — English
└── uk.json     — Ukrainian
```

User statistics are stored in the browser (`localStorage`).

## Run Locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/html/index.html`.

## Deploy to GitHub Pages

Push to `main` or `master` — GitHub Actions builds the site from `html/`, `css/`, `js/`, and `data/`, then deploys automatically.
