const I18n = (function() {
    const SUPPORTED = ['en', 'uk'];

    let locale = {};
    let currentLang = 'en';
    let readyPromise = null;

    function getBrowserLang() {
        const browserLang = (navigator.language || 'en').toLowerCase();
        if (browserLang.startsWith('uk')) {
            return 'uk';
        }
        return 'en';
    }

    function getStoredLang() {
        if (typeof Profiles !== 'undefined') {
            const profile = Profiles.getCurrent();
            if (profile) {
                const lang = Profiles.getLang(profile);
                if (lang && SUPPORTED.includes(lang)) {
                    return lang;
                }
            }
        }

        return getBrowserLang();
    }

    function getNested(obj, key) {
        return key.split('.').reduce((value, part) => value?.[part], obj);
    }

    async function load(lang, options = {}) {
        const persist = options.persist !== false;
        const targetLang = SUPPORTED.includes(lang) ? lang : 'en';
        const response = await fetch(Paths.asset(`locales/${targetLang}.json`));

        if (!response.ok) {
            throw new Error(`Failed to load locale: ${targetLang}`);
        }

        locale = await response.json();
        currentLang = targetLang;
        document.documentElement.lang = targetLang;

        if (persist && typeof Profiles !== 'undefined') {
            const profile = Profiles.getCurrent();
            if (profile) {
                Profiles.setLang(profile, targetLang);
            }
        }
    }

    function init(options = {}) {
        if (!readyPromise) {
            const lang = options.guest ? getBrowserLang() : getStoredLang();
            readyPromise = load(lang, { persist: !options.guest });
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

    return {
        init,
        t,
        getCountry,
        getLang,
        applyPage,
        setLang
    };
})();
