function updateLangButtons() {
    document.querySelectorAll('.lang-option').forEach((button) => {
        button.classList.toggle('active', button.getAttribute('data-lang') === I18n.getLang());
    });
}

function setupLanguageOptions() {
    document.querySelectorAll('.lang-option').forEach((button) => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            if (lang && lang !== I18n.getLang()) {
                I18n.setLang(lang).then(updateLangButtons);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    I18n.init().then(function() {
        I18n.applyPage();
        updateLangButtons();
        setupLanguageOptions();
    });

    document.addEventListener('languagechange', function() {
        I18n.applyPage();
        updateLangButtons();
    });
});
