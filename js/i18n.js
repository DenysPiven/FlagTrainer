const I18n = (function() {
    const STORAGE_KEY = 'lang';
    const SUPPORTED = ['en', 'uk'];

    let locale = {};
    let currentLang = 'en';
    let readyPromise = null;

    function getStoredLang() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && SUPPORTED.includes(stored)) {
            return stored;
        }

        const browserLang = (navigator.language || 'en').toLowerCase();
        if (browserLang.startsWith('uk')) {
            return 'uk';
        }

        return 'en';
    }

    function getNested(obj, key) {
        return key.split('.').reduce((value, part) => value?.[part], obj);
    }

    async function load(lang) {
        const targetLang = SUPPORTED.includes(lang) ? lang : 'en';
        const response = await fetch(`../locales/${targetLang}.json`);

        if (!response.ok) {
            throw new Error(`Failed to load locale: ${targetLang}`);
        }

        locale = await response.json();
        currentLang = targetLang;
        localStorage.setItem(STORAGE_KEY, targetLang);
        document.documentElement.lang = targetLang;
    }

    function init(lang) {
        if (!readyPromise) {
            readyPromise = load(lang || getStoredLang());
        }
        return readyPromise;
    }

    function t(key, vars = {}) {
        let value = getNested(locale, `ui.${key}`) ?? key;

        Object.entries(vars).forEach(([name, replacement]) => {
            value = value.replace(`{${name}}`, replacement);
        });

        return value;
    }

    function getCountry(flag) {
        const localized = locale.countries?.[flag.flagId];

        return {
            name: localized?.name || flag.flagId,
            capital: localized?.capital || flag.capital,
            continent: localized?.continent || locale.continents?.[flag.continent] || flag.continent
        };
    }

    function getLang() {
        return currentLang;
    }

    function applyPage() {
        document.querySelectorAll('[data-i18n]').forEach((element) => {
            const key = element.getAttribute('data-i18n');
            element.textContent = t(key);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = t(key);
        });

        document.querySelectorAll('[data-i18n-title]').forEach((element) => {
            const key = element.getAttribute('data-i18n-title');
            element.title = t(key);
        });

        const titleKey = document.body.getAttribute('data-i18n-title');
        if (titleKey) {
            document.title = t(titleKey);
        }

        document.querySelectorAll('[data-lang]').forEach((element) => {
            element.classList.toggle('active', element.getAttribute('data-lang') === currentLang);
        });
    }

    async function setLang(lang) {
        await load(lang);
        applyPage();
        document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: currentLang } }));
    }

    function setupLanguageSwitcher() {
        document.querySelectorAll('[data-lang]').forEach((element) => {
            element.addEventListener('click', function(event) {
                event.preventDefault();
                const lang = this.getAttribute('data-lang');
                if (lang && lang !== currentLang) {
                    setLang(lang);
                }
            });
        });
    }

    return {
        init,
        t,
        getCountry,
        getLang,
        applyPage,
        setLang,
        setupLanguageSwitcher
    };
})();
