function HomeAccessPage() {
    var page = {};

    var DEEP_TEXT_FN =
        "function deepText(node){ \
            if (!node) return ''; \
            if (node.nodeType === 3) return node.nodeValue || ''; \
            var text = ''; \
            if (node.shadowRoot) text += deepText(node.shadowRoot); \
            var children = node.childNodes || []; \
            for (var i = 0; i < children.length; i++) text += deepText(children[i]); \
            return text; \
        } \
        function normalizedDeepText(node){ \
            return deepText(node).replace(/\\s+/g, ' ').trim(); \
        } \
        function hasText(text){ return normalizedDeepText(document).indexOf(text) !== -1; }";

    var hasText = function(text) {
        return driver.script(DEEP_TEXT_FN + "; hasText(" + JSON.stringify(text) + ")");
    };

    page.homeTab = "{^}Home";
    page.freeBadge = "{^}FREE";
    page.testCustomersNavLink = "{^}Test Customers";
    page.authorizationsNavLink = "{^}Authorizations";
    page.myOrganisationNavLink = "{^}My organisation";
    page.collapseButton = "{^}Collapse";

    page.isWelcomeHeadingPresent = () => hasText('Welcome to MockBank!');

    // page.waitForHomeLoaded = () => {
    //     karate.log('Aguardando navegação pós-login...');
    //     driver.waitUntil("document.location.pathname === '/' || document.location.pathname.indexOf('login') === -1");
    //     karate.log('Navegação OK. URL atual:', driver.url);
    //     driver.delay(1000);
    //
    //     karate.log('Aguardando heading de boas-vindas...');
    //     driver.waitUntil(DEEP_TEXT_FN + "; hasText('Welcome to MockBank!')");
    //     karate.log('Heading encontrado.');
    //
    //     return true;
    // };
    page.waitForHomeLoaded = () => {
        return driver.waitUntil("(function(){ var selectedTab = document.querySelector('vaadin-tab[aria-selected=\"true\"]'); if (!selectedTab) return false; var text = (selectedTab.textContent || '').trim().toLowerCase(); var avatar = document.querySelector('.tab-bar__avatar'); return text.indexOf('home') !== -1 && !!avatar;})()");
    };


    page.isWelcomeTextPresent = () => hasText('We want to enable development of complex fintech solutions based on PSD2.');
    page.getWelcomeHeadingText = () => driver.script(
        DEEP_TEXT_FN + "; hasText('Welcome to MockBank!') ? 'Welcome to MockBank!' : 'HEADING NAO ENCONTRADO'"
    );

    page.isQuickStartCardPresent = () => hasText('Quick start') && hasText('Get up and running in 2 minutes!');
    page.isAllTutorialsCardPresent = () => hasText('All Tutorials') && hasText('All documents we have to help you manage your MockBank.');
    page.isConnectAispCardPresent = () => hasText("Connect Using partner's AISP") && hasText('Use MockBank with AISP.');
    page.isConnectDirectlyCardPresent = () => hasText('Connect directly') && hasText('Use our Berlin Group compatible XS2A interface.');
    page.isUsingInternalApiCardPresent = () => hasText('Using Internal API') && hasText('Connect to MockBank API to manage your data programmatically.');

    page.isLetsStartButtonPresent = () => hasText("Let’s Start") || hasText("Let's Start");

    page.isHomeTabPresent = () => hasText('Home');
    page.isFreeBadgePresent = () => hasText('FREE');
    page.isTestCustomersLinkPresent = () => hasText('Test Customers');
    page.isAuthorizationsLinkPresent = () => hasText('Authorizations');
    page.isMyOrganisationLinkPresent = () => hasText('My organisation');
    page.isCollapseButtonPresent = () => hasText('Collapse');

    page.countMoreButtons = () => driver.script(
        DEEP_TEXT_FN + "; (function countMore(root){ \
            root = root || document; \
            var count = 0; \
            var elements = Array.from(root.querySelectorAll('*')); \
            elements.forEach(function(el){ \
                if (!el.shadowRoot) { \
                    var text = normalizedDeepText(el); \
                    var classNameStr = String(el.className || ''); \
                    if ((el.tagName === 'BUTTON' || el.tagName === 'VAADIN-BUTTON' || el.tagName === 'A' || el.getAttribute('role') === 'button' || classNameStr.indexOf('button') !== -1) && text.indexOf('More') !== -1) { \
                        count++; \
                    } \
                } \
                if (el.shadowRoot) { \
                    count += countMore(el.shadowRoot); \
                } \
            }); \
            return count; \
        })(document)"
    );

    return page;
}