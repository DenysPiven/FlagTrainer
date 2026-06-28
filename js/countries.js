const userId = sessionStorage.getItem('userId');
if (!userId) {
    window.location.href = 'login.html';
}

let allFlags = [];

function getSearchText(flag) {
    const country = I18n.getCountry(flag);
    return `${country.name} ${country.capital} ${country.continent} ${flag.flagId} ${flag.capital} ${flag.continent}`.toLowerCase();
}

function renderFlags(flags) {
    const list = document.getElementById('countriesList');
    const count = document.getElementById('countriesCount');

    count.textContent = I18n.t('countriesCount', { count: flags.length });

    if (flags.length === 0) {
        list.innerHTML = `<p class="countries-empty">${I18n.t('countriesEmpty')}</p>`;
        return;
    }

    list.innerHTML = flags.map(flag => {
        const country = I18n.getCountry(flag);
        return `
        <article class="country-card">
            <img class="country-flag" src="${flag.imageUrl}" alt="${I18n.t('flagAltCountry', { country: country.name })}" loading="lazy">
            <div class="country-info">
                <p class="country-name">${country.name}</p>
                <p class="country-capital">${country.capital}</p>
                <p class="country-continent">${country.continent}</p>
            </div>
        </article>
    `;
    }).join('');
}

function setupSearch() {
    const searchInput = document.getElementById('countrySearch');

    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();

        if (!query) {
            renderFlags(allFlags);
            return;
        }

        const filtered = allFlags.filter(flag => getSearchText(flag).includes(query));
        renderFlags(filtered);
    });
}

async function init() {
    try {
        await I18n.init();

        const response = await fetch('../data/flags.json');
        allFlags = await response.json();
        allFlags.sort((a, b) => I18n.getCountry(a).name.localeCompare(I18n.getCountry(b).name, I18n.getLang()));

        renderFlags(allFlags);
        setupSearch();

        document.addEventListener('languagechange', function() {
            allFlags.sort((a, b) => I18n.getCountry(a).name.localeCompare(I18n.getCountry(b).name, I18n.getLang()));
            const query = document.getElementById('countrySearch').value.trim().toLowerCase();
            if (!query) {
                renderFlags(allFlags);
            } else {
                renderFlags(allFlags.filter(flag => getSearchText(flag).includes(query)));
            }
        });
    } catch (error) {
        console.error('Error loading countries:', error);
        document.getElementById('countriesList').innerHTML =
            `<p class="countries-error">${I18n.t('countriesError')}</p>`;
    }
}

init();
