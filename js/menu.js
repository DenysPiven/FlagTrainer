function initMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const menuPanel = document.getElementById('menuPanel');
    const menuOverlay = document.getElementById('menuOverlay');
    const logoutLink = document.getElementById('logoutLink');

    if (!menuBtn || !menuPanel) {
        return;
    }

    function closeMenu() {
        menuPanel.classList.remove('open');
        if (menuOverlay) {
            menuOverlay.classList.remove('open');
        }
        menuBtn.setAttribute('aria-expanded', 'false');
    }

    function openMenu() {
        menuPanel.classList.add('open');
        if (menuOverlay) {
            menuOverlay.classList.add('open');
        }
        menuBtn.setAttribute('aria-expanded', 'true');
    }

    menuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (menuPanel.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }

    document.addEventListener('click', function(e) {
        if (!menuPanel.contains(e.target) && !menuBtn.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    if (logoutLink) {
        logoutLink.addEventListener('click', function() {
            sessionStorage.removeItem('userId');
        });
    }

    highlightCurrentPage();
}

function highlightCurrentPage() {
    const page = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('#menuPanel a[href]').forEach(function(link) {
        const href = link.getAttribute('href');
        link.classList.toggle('current', href === page);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    I18n.init().then(function() {
        I18n.applyPage();
        initMenu();
    });
});
