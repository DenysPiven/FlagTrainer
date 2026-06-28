# Flag Trainer

Flag Trainer is a static web app for learning country flags through an interactive quiz. Progress is saved in the browser.

## Project Structure

```
index.html          — training (/)
login/              — profile selection (/login/)
countries/          — country reference (/countries/)
settings/           — per-profile settings (/settings/)
css/  js/  data/  locales/
```

## Run Locally

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080/` — training, `/login/`, `/countries/`, `/settings/`.

## Install as app (PWA)

After deploying to HTTPS (GitHub Pages), open the site on your phone and use **Add to Home Screen**. The app works offline after the first visit — pages, data, and flag images are cached.

## Deploy to GitHub Pages

Push to `main` or `master` — GitHub Actions deploys automatically.
