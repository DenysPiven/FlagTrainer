# FlagTrainer - Static Version for GitHub Pages

This folder contains the static version of the FlagTrainer application for deployment on GitHub Pages.

## How to Deploy to GitHub Pages:

1. Go to your repository settings on GitHub
2. Navigate to the "Pages" section (Settings → Pages)
3. In the "Source" section, select "GitHub Actions"
4. After pushing to the main/master branch, GitHub Actions will automatically deploy the site

Or use these settings:
- Source: Deploy from a branch
- Branch: main/master
- Folder: /docs

## Structure:

- `index.html` - main page with flags
- `login.html` - login page
- `js/app.js` - main application logic
- `js/login.js` - login logic
- `css/` - stylesheets
- `data/flags.json` - flag data

User statistics are stored in the browser's localStorage.
