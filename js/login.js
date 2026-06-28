document.addEventListener('DOMContentLoaded', function() {
    I18n.init().then(function() {
        I18n.applyPage();
    });

    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const userId = document.getElementById('userId').value.trim();

        if (!userId || !userId.match(/^[A-Za-z]+$/)) {
            alert(I18n.t('loginHint'));
            return;
        }

        sessionStorage.setItem('userId', userId);
        window.location.href = 'index.html';
    });
});
