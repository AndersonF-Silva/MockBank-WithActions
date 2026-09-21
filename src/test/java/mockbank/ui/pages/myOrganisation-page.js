function MyOrganisationPage () {
    var page = {};
    var comum = karate.read('../pages/comum-myOrganisation-page.js');

    page.isPageRendered = () => {
        return checkText('My organisation');
    };

    page.waitForMyOrganisationTabLoaded = () => {
        return driver.script(
            comum.DEEP_TEXT_FN +
            "; (function(){ \
                var tabs = document.querySelectorAll('vaadin-tab'); \
                for (var i = 0; i < tabs.length; i++) { \
                    if (tabs[i].textContent.indexOf('Basic info') !== -1) { \
                        return true; \
                    } \
                } \
                return hasText('My organisation'); \
            })()"
        );
    };

    return page;
}