# FlagTrainer - Static Version for GitHub Pages

Ця папка містить статичну версію додатку FlagTrainer для деплою на GitHub Pages.

## Як задеплоїти на GitHub Pages:

1. Зайдіть в налаштування репозиторію на GitHub
2. Перейдіть в розділ "Pages" (Settings → Pages)
3. В розділі "Source" виберіть "GitHub Actions"
4. Після push в main/master гілку, GitHub Actions автоматично задеплоїть сайт

Або використайте налаштування:
- Source: Deploy from a branch
- Branch: main/master
- Folder: /docs

## Структура:

- `index.html` - головна сторінка з прапорами
- `login.html` - сторінка входу
- `js/app.js` - основна логіка додатку
- `js/login.js` - логіка входу
- `css/` - стилі
- `data/flags.json` - дані про прапори

Статистика користувачів зберігається в localStorage браузера.
