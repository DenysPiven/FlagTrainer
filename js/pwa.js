(function() {
    if (!('serviceWorker' in navigator)) {
        return;
    }

    function getRootPrefix() {
        const depth = Number(document.documentElement.getAttribute('data-depth') || 0);
        return depth === 0 ? '' : '../'.repeat(depth);
    }

    function registerServiceWorker() {
        const swUrl = `${getRootPrefix()}sw.js`;

        window.addEventListener('load', function() {
            navigator.serviceWorker.register(swUrl).catch(function(error) {
                console.error('Service worker registration failed:', error);
            });
        });
    }

    registerServiceWorker();
})();
