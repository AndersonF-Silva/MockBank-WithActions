function CustumersPage () {
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

    var checkText = function (text) {
        return driver.script(DEEP_TEXT_FN + "; hasText(" + JSON.stringify(text) + ")");
    };

    // --- Validações de Interface Básicas ---
    page.isPageRendered = () => {
        return checkText('Test Customers');
    };

    // --- Validação da Listagem (Com Sincronismo Otimizado) ---
    page.isCustomerListVisible = () => {
        driver.waitUntil(DEEP_TEXT_FN + "; hasText('Username') && hasText('Country')");
        return true;
    };

    // --- Ordenação de Colunas ---
    page.clickColumnSort = (columnName) => {
        driver.script(DEEP_TEXT_FN + "; (function sort(root){ \
            root = root || document; \
            var elements = Array.from(root.querySelectorAll('vaadin-grid-sorter, div, span')); \
            for(var i = 0; i < elements.length; i++){ \
                var el = elements[i]; \
                if (!el.shadowRoot) { \
                    if (normalizedDeepText(el) === '" + columnName + "') { \
                        el.click(); \
                        return; \
                    } \
                } \
                if (el.shadowRoot) sort(el.shadowRoot); \
            } \
        })(document)");
    };

    // --- Checkbox Demo User ---
    page.toggleDemoUserCheckbox = () => {
        driver.script(DEEP_TEXT_FN + "; (function toggleDemo(root){ \
            root = root || document; \
            var elements = Array.from(root.querySelectorAll('vaadin-checkbox, input[type=checkbox], label')); \
            for(var i = 0; i < elements.length; i++){ \
                var el = elements[i]; \
                if (!el.shadowRoot) { \
                    if (normalizedDeepText(el).indexOf('Demo user') !== -1) { \
                        el.click(); \
                        return; \
                    } \
                } \
                if (el.shadowRoot) toggleDemo(el.shadowRoot); \
            } \
        })(document)");
    };

    // --- Duplo Clique na Linha da Tabela Otimizado e Sintaxe Corrigida ---
    page.doubleClickCustomer = (isDemo) => {
        driver.script(DEEP_TEXT_FN + "; (function dblClickRow(isDemoFlag){ \
            var searchShadow = function(root) { \
                var els = Array.from(root.querySelectorAll('*')); \
                for(var i=0; i<els.length; i++) { \
                    var el = els[i]; \
                    if(!el.shadowRoot && (el.tagName === 'TR' || el.tagName === 'VAADIN-GRID-CELL-CONTENT' || el.tagName === 'TD' || el.getAttribute('part') === 'cell' || el.getAttribute('part') === 'row')) { \
                        var text = normalizedDeepText(el); \
                        if(text && text.trim().length > 0) { \
                            var hasDemo = text.indexOf('Demo') !== -1 || (el.querySelector('vaadin-checkbox') && el.querySelector('vaadin-checkbox').hasAttribute('checked')); \
                            var isHeader = text.indexOf('Name') !== -1 && text.indexOf('Country') !== -1; \
                            \
                            if(!isHeader && ((isDemoFlag && hasDemo) || (!isDemoFlag && !hasDemo))) { \
                                el.dispatchEvent(new MouseEvent('dblclick', {bubbles: true, cancelable: true, view: window})); \
                                return true; \
                            } \
                        } \
                    } \
                    if(el.shadowRoot) { \
                        if(searchShadow(el.shadowRoot)) return true; \
                    } \
                } \
                return false; \
            }; \
            searchShadow(document); \
        })(" + isDemo + ")");
    };

//--- Fechamento Universal Blindado da Aba Test Custumers com Espera Ativa para Pipeline ---
    page.closeCurrentTab = (tabName) => {
        var nameToClose = tabName || 'Test Customers';

        // Dispara o clique de fechamento
        var clicked = driver.script(
            "(function(targetName){ \
                var tabs = document.querySelectorAll('vaadin-tab'); \
                for (var i = 0; i < tabs.length; i++){ \
                    var tab = tabs[i]; \
                    if (tab.textContent && tab.textContent.indexOf(targetName) !== -1){ \
                        tab.click(); \
                        var findCloseBtn = function(root) { \
                            if (!root) return null; \
                            var btn = root.querySelector('[part*=\"close\"]') || \
                                      root.querySelector('vaadin-button') || \
                                      root.querySelector('button') || \
                                      root.querySelector('iron-icon') || \
                                      root.querySelector('[aria-label*=\"Close\"]') || \
                                      root.querySelector('[aria-label*=\"close\"]'); \
                            if (btn) return btn; \
                            if (root.shadowRoot) { \
                                var sBtn = findCloseBtn(root.shadowRoot); \
                                if (sBtn) return sBtn; \
                            } \
                            var children = Array.from(root.children || []); \
                            for (var j = 0; j < children.length; j++) { \
                                var found = findCloseBtn(children[j]); \
                                if (found) return found; \
                            } \
                            return null; \
                        }; \
                        var closeBtn = findCloseBtn(tab); \
                        if (closeBtn) { \
                            closeBtn.click(); \
                            var ev = new MouseEvent('click', {bubbles: true, cancelable: true, view: window}); \
                            closeBtn.dispatchEvent(ev); \
                            return true; \
                        } \
                        return true; \
                    } \
                } \
                return false; \
            })('" + nameToClose + "')"
        );

        if (!clicked) return false;

        // Aguarda ativamente o elemento sumir do DOM (evita race condition na pipeline)
        var startTime = java.lang.System.currentTimeMillis();
        while (java.lang.System.currentTimeMillis() - startTime < 10000) {
            driver.delay(200);
            var stillPresent = driver.script(
                "(function(targetName){ \
                    var tabs = document.querySelectorAll('vaadin-tab'); \
                    for (var i = 0; i < tabs.length; i++){ \
                        var tabText = tabs[i].shadowRoot ? (tabs[i].shadowRoot.textContent || '') : (tabs[i].textContent || ''); \
                        if (tabText.indexOf(targetName) !== -1) return true; \
                    } \
                    return false; \
                })('" + nameToClose + "')"
            );
            if (!stillPresent) return true;
        }
        return false;
    };
    return page;
}