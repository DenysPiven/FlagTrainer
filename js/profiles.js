const Profiles = (function() {
    const LIST_KEY = 'profiles';
    const LAST_KEY = 'lastProfile';
    const CURRENT_KEY = 'currentProfile';
    const STATS_PREFIX = 'userStats_';
    const SETTINGS_PREFIX = 'profileSettings_';
    const NAME_PATTERN = /^[A-Za-z0-9]+$/;
    const MAX_NAME_LENGTH = 20;

    function readList() {
        try {
            const stored = JSON.parse(localStorage.getItem(LIST_KEY) || '[]');
            return Array.isArray(stored) ? stored : [];
        } catch {
            return [];
        }
    }

    function writeList(profiles) {
        const unique = [...new Set(profiles.filter(Boolean))];
        unique.sort((a, b) => a.localeCompare(b));
        localStorage.setItem(LIST_KEY, JSON.stringify(unique));
        return unique;
    }

    function discoverFromStats() {
        const found = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(STATS_PREFIX)) {
                found.push(key.slice(STATS_PREFIX.length));
            }
        }

        return found;
    }

    function getAll() {
        return writeList([...readList(), ...discoverFromStats()]);
    }

    function isValidName(name) {
        return name && name.length <= MAX_NAME_LENGTH && NAME_PATTERN.test(name);
    }

    function exists(name) {
        return getAll().includes(name);
    }

    function add(name) {
        if (!isValidName(name)) {
            return false;
        }

        writeList([...getAll(), name]);
        return true;
    }

    function getSettings(name) {
        try {
            return JSON.parse(localStorage.getItem(`${SETTINGS_PREFIX}${name}`) || '{}');
        } catch {
            return {};
        }
    }

    function saveSettings(name, settings) {
        localStorage.setItem(`${SETTINGS_PREFIX}${name}`, JSON.stringify(settings));
    }

    function getLang(name) {
        return getSettings(name).lang || null;
    }

    function setLang(name, lang) {
        saveSettings(name, { ...getSettings(name), lang });
    }

    function remove(name) {
        const updated = getAll().filter((profile) => profile !== name);
        writeList(updated);
        localStorage.removeItem(`${STATS_PREFIX}${name}`);
        localStorage.removeItem(`${SETTINGS_PREFIX}${name}`);

        if (localStorage.getItem(LAST_KEY) === name) {
            localStorage.removeItem(LAST_KEY);
        }

        if (getCurrent() === name) {
            clearCurrent();
        }
    }

    function setCurrent(name) {
        sessionStorage.setItem('userId', name);
        localStorage.setItem(CURRENT_KEY, name);
        localStorage.setItem(LAST_KEY, name);
        add(name);
    }

    function getCurrent() {
        return sessionStorage.getItem('userId') || localStorage.getItem(CURRENT_KEY);
    }

    function getLast() {
        const last = localStorage.getItem(LAST_KEY);
        return last && exists(last) ? last : null;
    }

    function clearCurrent() {
        sessionStorage.removeItem('userId');
        localStorage.removeItem(CURRENT_KEY);
    }

    function getStatsSummary(name) {
        try {
            const stats = JSON.parse(localStorage.getItem(`${STATS_PREFIX}${name}`) || '{}');
            const correct = Object.values(stats).reduce((sum, item) => sum + (item.correct || 0), 0);
            const incorrect = Object.values(stats).reduce((sum, item) => sum + (item.incorrect || 0), 0);
            return { correct, incorrect };
        } catch {
            return { correct: 0, incorrect: 0 };
        }
    }

    return {
        getAll,
        isValidName,
        exists,
        add,
        remove,
        setCurrent,
        getCurrent,
        getLast,
        clearCurrent,
        getStatsSummary,
        getLang,
        setLang,
        MAX_NAME_LENGTH
    };
})();
