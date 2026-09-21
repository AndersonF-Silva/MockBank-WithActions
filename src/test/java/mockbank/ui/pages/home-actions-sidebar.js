function HomeActionsSidebar() {
    var page = {};

    // Reutilizando a função base para transpor o Shadow DOM do Vaadin
    // Adicionamos a lógica de "clickByText" para garantir que o evento de clique
    // atinja o componente encapsulado real (seja <a>, <vaadin-tab> ou <span>).
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
        function hasText(text){ return normalizedDeepText(document).indexOf(text) !== -1; } \
        function clickByText(targetText){ \
            var clicked = false; \
            (function search(root){ \
                root = root || document; \
                var elements = Array.from(root.querySelectorAll('*')); \
                for(var i = 0; i < elements.length; i++){ \
                    var el = elements[i]; \
                    if (!el.shadowRoot) { \
                        var text = normalizedDeepText(el); \
                        if (text === targetText && (el.tagName === 'A' || el.tagName === 'VAADIN-TAB' || el.tagName === 'SPAN' || el.getAttribute('role') === 'tab' || el.tagName === 'DIV')) { \
                            el.click(); \
                            clicked = true; \
                            return; \
                        } \
                    } \
                    if (el.shadowRoot) { \
                        search(el.shadowRoot); \
                        if(clicked) return; \
                    } \
                } \
            })(document); \
            return clicked; \
        } \
        function findMatchingTexts(targetText){ \
            var matches = []; \
            (function search(root){ \
                root = root || document; \
                var elements = Array.from(root.querySelectorAll('*')); \
                for(var i = 0; i < elements.length; i++){ \
                    var el = elements[i]; \
                    if (!el.shadowRoot) { \
                        var text = normalizedDeepText(el); \
                        if (text.indexOf(targetText) !== -1 && text.length < 200) { \
                            matches.push({tag: el.tagName, text: text}); \
                        } \
                    } \
                    if (el.shadowRoot) search(el.shadowRoot); \
                } \
            })(document); \
            return matches; \
        }";

    var checkText = function(text) {
        return driver.script(DEEP_TEXT_FN + "; hasText(" + JSON.stringify(text) + ")");
    };

    // --- Ações de Clique na Sidebar Lateral ---
    // Executamos o clique via JS para burlar a limitação de tags ocultas
    // Agora retornando o resultado (true/false) para saber se o clique de fato encontrou o elemento
    page.clickTestCustomers = () => {
        return driver.script(DEEP_TEXT_FN + "; clickByText('Test Customers')");
    };

    page.clickAuthorizations = () => {
        return driver.script(DEEP_TEXT_FN + "; clickByText('Authorizations')");
    };

    page.clickMyOrganisation = () => {
        return driver.script(DEEP_TEXT_FN + "; clickByText('My organisation')");
    };

    page.clickHome = () => {
        return driver.script(DEEP_TEXT_FN + "; clickByText('Home')");
    };

    // --- Diagnóstico ---
    // Retorna todos os elementos cujo texto contém o alvo, útil para ver
    // se o texto existe no DOM mas em outra tag/estrutura, ou se não existe de fato ainda.
    page.findMatchingTexts = (text) => {
        return driver.script(DEEP_TEXT_FN + "; findMatchingTexts(" + JSON.stringify(text) + ")");
    };

    // --- Validações de Carregamento (Aba/Página Destino) ---
    // A validação espera até que um texto ou identificador da nova aba esteja visível no DOM
    page.waitForTestCustomersTabLoaded = () => {
        driver.waitUntil(DEEP_TEXT_FN + "; hasText('Test Customers')");
        return true;
    };

    page.waitForAuthorizationsTabLoaded = () => {
        driver.waitUntil(DEEP_TEXT_FN + "; hasText('Authorizations')");
        return true;
    };

    page.waitForMyOrganisationTabLoaded = () => {
        driver.waitUntil(DEEP_TEXT_FN + "; hasText('My organisation')");
        return true;
    };

    return page;
}