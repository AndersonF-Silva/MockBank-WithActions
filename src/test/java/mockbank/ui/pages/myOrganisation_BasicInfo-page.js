function MyOrganisationBasicInfoPage () {
    var page = {};
    var comum = karate.read('../pages/comum-myOrganisation-page.js');

    var DEEP_QUERY_ALL = "\
function deepQueryAll(selector, root) { \
    root = root || document; \
    var results = Array.prototype.slice.call(root.querySelectorAll(selector)); \
    var all = root.querySelectorAll('*'); \
    for (var i = 0; i < all.length; i++) { \
        if (all[i].shadowRoot) { \
            results = results.concat(deepQueryAll(selector, all[i].shadowRoot)); \
        } \
    } \
    return results; \
} ";

    // Exposto para poder ser usado em passos de debug direto no .feature
    page.DEEP_QUERY_ALL = DEEP_QUERY_ALL;

    // --- DEBUG: retorna o texto e atributos relevantes de cada <vaadin-tab> encontrado ---
    page.debugVaadinTabsInfo = () => {
        return driver.script(
            DEEP_QUERY_ALL +
            "; (function(){ \
                var tabs = deepQueryAll('vaadin-tab'); \
                return tabs.map(function(t){ \
                    return { \
                        text: (t.textContent || '').trim(), \
                        selectedAttr: t.hasAttribute('selected'), \
                        selectedProp: t.selected === true, \
                        ariaSelected: t.getAttribute('aria-selected'), \
                        part: t.getAttribute('part') || null, \
                        classes: t.className || null \
                    }; \
                }); \
            })()"
        );
    };

    page.isBasicInfoActive = () => {
        return driver.script(
            DEEP_QUERY_ALL +
            "; (function(){ \
                var tabs = deepQueryAll('vaadin-tab'); \
                for (var i = 0; i < tabs.length; i++) { \
                    var txt = (tabs[i].textContent || '').trim().toLowerCase(); \
                    if (txt.indexOf('basic info') !== -1) { \
                        return !!(tabs[i].hasAttribute('selected') || \
                                  tabs[i].selected === true || \
                                  tabs[i].getAttribute('aria-selected') === 'true'); \
                    } \
                } \
                return false; \
            })()"
        );
    };

    page.clickBasicInfoSubTab = () => {
        return driver.script(
            DEEP_QUERY_ALL +
            "; (function(){ \
                var tabs = deepQueryAll('vaadin-tab'); \
                for (var i = 0; i < tabs.length; i++) { \
                    var txt = (tabs[i].textContent || '').trim().toLowerCase(); \
                    if (txt.indexOf('basic info') !== -1) { \
                        tabs[i].click(); \
                        return true; \
                    } \
                } \
                return false; \
            })()"
        );
    };

    page.isBasicInfoFieldsPopulated = () => {
        return driver.script(
            comum.DEEP_TEXT_FN +
            "; (function(){ \
                var nameInput = document.querySelector('input'); \
                return nameInput && nameInput.value.length > 0; \
            })()"
        );
    };

    // --- Método corrigido: agora espera ativamente o conteúdo assíncrono renderizar ---
    page.isBasicInfoSectionVisible = () => {
        driver.waitUntil(
            comum.DEEP_TEXT_FN +
            "; (function(){ \
                return hasText('Subscription Plan') && hasText('Client Id'); \
            })()"
        );
        return true;
    };
    // // --- Método que estava faltando no objeto exportado ---
    // page.isBasicInfoSectionVisible = () => {
    //     return driver.script(
    //         comum.DEEP_TEXT_FN +
    //         "; (function(){ \
    //             return hasText('Subscription Plan') && hasText('Client Id'); \
    //         })()"
    //     );
    // };

    page.clearFieldByName = (fieldName) => {
        return driver.script(
            "(function(target){ \
                var labels = document.querySelectorAll('label, span, div'); \
                for (var i = 0; i < labels.length; i++) { \
                    if (labels[i].textContent.trim() === target) { \
                        var container = labels[i].closest('vaadin-text-field, vaadin-select, div'); \
                        if (container) { \
                            var input = container.querySelector('input'); \
                            if (input) { \
                                input.value = ''; \
                                input.dispatchEvent(new Event('input', { bubbles: true })); \
                                input.dispatchEvent(new Event('change', { bubbles: true })); \
                                return true; \
                            } \
                        } \
                    } \
                } \
                return false; \
            })('" + fieldName + "')"
        );
    };

    page.clickSave = comum.clickSave;

    page.getToastMessage = () => {
        return driver.script(
            "(function(){ \
                var notifications = document.querySelectorAll('vaadin-notification-card, .vaadin-notification-card, div'); \
                for (var i = 0; i < notifications.length; i++) { \
                    var txt = notifications[i].textContent || ''; \
                    if (txt.indexOf('Please enter a valid data and try again') !== -1) { \
                        return txt.trim(); \
                    } \
                } \
                return ''; \
            })()"
        );
    };

    page.isFieldPopulated = (fieldName) => {
        return driver.script(
            DEEP_QUERY_ALL +
            "; (function(target){ \
                var fields = deepQueryAll('vaadin-text-field, vaadin-select, vaadin-date-picker, vaadin-combo-box, vaadin-password-field, vaadin-number-field'); \
                var targetLower = target.trim().toLowerCase(); \
                for (var i = 0; i < fields.length; i++) { \
                    var label = (fields[i].label || fields[i].getAttribute('label') || '').trim().toLowerCase(); \
                    if (label === targetLower || label.indexOf(targetLower) !== -1) { \
                        var val = fields[i].value; \
                        if (val !== undefined && val !== null && String(val).trim().length > 0) { \
                            return true; \
                        } \
                    } \
                } \
                return false; \
            })('" + fieldName + "')"
        );
    };

    return page;
}