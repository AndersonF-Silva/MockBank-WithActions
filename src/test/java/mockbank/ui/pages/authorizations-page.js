function AuthorizationsPage () {
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

    var CLOSABLE_TABS_FN =
        "function isClosableTab(tab){ \
            return !!tab.querySelector('iron-icon[icon=\"vaadin:close\"]'); \
        } \
        function getClosableTabs(){ \
            var all = Array.from(document.querySelectorAll('vaadin-tab')); \
            return all.filter(isClosableTab); \
        } \
        function getClosableTabTexts(){ \
            return getClosableTabs().map(function(t){ return t.textContent.trim(); }); \
        }";

    page.isPageRendered = () => {
        return checkText('Authorizations');
    };

    page.isAuthorizationsListVisible = () => {
        driver.waitUntil(DEEP_TEXT_FN + "; hasText('Authorizations')");
        return true;
    };

    // Retorna a lista de abas de nível de aplicação (fecháveis) atualmente abertas
    page.getOpenTabs = () => {
        return driver.script(CLOSABLE_TABS_FN + "; getClosableTabTexts()");
    };

    // Verifica se uma aba específica (nível de aplicação) está presente
    page.isTabPresent = (tabName) => {
        return driver.script(
            CLOSABLE_TABS_FN + "; getClosableTabTexts().some(function(t){ \
                return t.toLowerCase().indexOf('" + tabName.toLowerCase() + "') !== -1; \
            })"
        );
    };

    // Função única para localizar botão de fechar
    var findCloseBtn = function(root) {
        if (!root) return null;
        var icon = root.querySelector('iron-icon[icon="vaadin:close"]');
        if (icon && icon.parentElement && icon.parentElement.tagName === 'VAADIN-BUTTON') {
            return icon.parentElement;
        }
        var btn = root.querySelector('vaadin-button[role="button"]');
        if (btn) return btn;

        if (root.shadowRoot) {
            var sBtn = findCloseBtn(root.shadowRoot);
            if (sBtn) return sBtn;
        }
        var children = Array.from(root.children || []);
        for (var j = 0; j < children.length; j++) {
            var found = findCloseBtn(children[j]);
            if (found) return found;
        }
        return null;
    };

    // Método corrigido: agora só considera abas fecháveis (barra principal),
    page.closeCurrentTab = (tabName, timeoutMs) => {
        var nameToClose = tabName || 'Test Customers';
        var maxWait = timeoutMs || 25000;

        var clicked = driver.script(
            CLOSABLE_TABS_FN +
            "; (function(targetName){ \
                var tabs = getClosableTabs(); \
                for (var i = 0; i < tabs.length; i++){ \
                    var tab = tabs[i]; \
                    var tabText = tab.textContent || ''; \
                    if (tabText.indexOf(targetName) !== -1){ \
                        var btn = tab.querySelector('vaadin-button iron-icon[icon=\"vaadin:close\"]'); \
                        if (btn && btn.parentElement) { \
                            btn.parentElement.click(); \
                            var ev = new MouseEvent('click', {bubbles:true, cancelable:true, view:window}); \
                            btn.parentElement.dispatchEvent(ev); \
                            return true; \
                        } \
                    } \
                } \
                return false; \
            })('" + nameToClose + "')"
        );

        if (!clicked) return false;

        var startTime = java.lang.System.currentTimeMillis();
        while (java.lang.System.currentTimeMillis() - startTime < maxWait) {
            driver.delay(200);
            var stillPresent = driver.script(
                CLOSABLE_TABS_FN +
                "; (function(targetName){ \
                    var tabs = getClosableTabs(); \
                    for (var i = 0; i < tabs.length; i++){ \
                        var tabText = tabs[i].textContent || ''; \
                        if (tabText.indexOf(targetName) !== -1) return true; \
                    } \
                    return false; \
                })('" + nameToClose + "')"
            );
            if (!stillPresent) return true;
        }
        return false;
    };

    // Aguarda a aba (nível de aplicação) estar presente na barra principal
    page.waitForAuthorizationsTabLoaded = () => {
        return driver.waitUntil(
            CLOSABLE_TABS_FN +
            "; (function(){ \
                var tabs = getClosableTabs(); \
                for (var i = 0; i < tabs.length; i++){ \
                    var text = tabs[i].textContent || ''; \
                    if (text.indexOf('Authorizations') !== -1) return true; \
                } \
                return false; \
            })()"
        );
    };

    return page;
}