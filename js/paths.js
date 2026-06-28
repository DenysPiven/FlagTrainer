const Paths = (function() {
    function getDepth() {
        return Number(document.documentElement.getAttribute('data-depth') || 0);
    }

    function prefix() {
        return getDepth() === 0 ? '' : '../';
    }

    function asset(path) {
        return `${prefix()}${path}`;
    }

    function route(name) {
        const base = prefix();

        const routes = {
            training: base || './',
            login: `${base}login/`,
            countries: `${base}countries/`,
            settings: `${base}settings/`
        };

        return routes[name];
    }

    function getCurrentRoute() {
        const path = window.location.pathname.replace(/\/$/, '');
        const segment = path.split('/').filter(Boolean).pop();

        if (!segment || segment === 'index.html') {
            return 'training';
        }

        if (segment === 'login' || segment === 'countries' || segment === 'settings') {
            return segment;
        }

        return 'training';
    }

    return {
        asset,
        route,
        getCurrentRoute
    };
})();
