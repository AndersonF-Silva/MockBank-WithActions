function MyOrganisationUsersPage () {
    var page = {};
    var comum = karate.read('../pages/comum-myOrganisation-page.js');

    page.isUsersActive = () => {
        return driver.script(
            "(function(){ \
                var tabs = document.querySelectorAll('vaadin-tab'); \
                for (var i = 0; i < tabs.length; i++) { \
                    if (tabs[i].textContent.indexOf('Users') !== -1) { \
                        return tabs[i].hasAttribute('selected') || \
                               tabs[i].getAttribute('aria-selected') === 'true' || \
                               tabs[i].classList.contains('selected') || \
                               tabs[i].getAttribute('selected') === ''; \
                    } \
                } \
                return false; \
            })()"
        );
    };

    page.clickUsersSubTab = () => {
        return driver.script(
            "(function(){ \
                var tabs = document.querySelectorAll('vaadin-tab'); \
                for (var i = 0; i < tabs.length; i++) { \
                    if (tabs[i].textContent.indexOf('Users') !== -1) { \
                        tabs[i].click(); \
                        return true; \
                    } \
                } \
                return false; \
            })()"
        );
    };

    page.isUsersSectionVisible = () => {
        return driver.script(
            comum.DEEP_TEXT_FN +
            "; (function(){ \
                return hasText('Users') || document.querySelector('vaadin-grid') !== null; \
            })()"
        );
    };

    return page;
}