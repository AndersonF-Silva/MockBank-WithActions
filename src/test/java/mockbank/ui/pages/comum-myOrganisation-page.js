function ComumMyOrganisationPage () {
    var comum = {};

    comum.DEEP_TEXT_FN =
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

    comum.clickSave = () => {
        return driver.script(
            "(function(){ \
                var buttons = document.querySelectorAll('vaadin-button, button'); \
                for (var i = 0; i < buttons.length; i++) { \
                    var btn = buttons[i]; \
                    var txt = btn.shadowRoot ? (btn.shadowRoot.textContent || '') : (btn.textContent || ''); \
                    if (txt.indexOf('Save') !== -1) { \
                        btn.click(); \
                        return true; \
                    } \
                } \
                return false; \
            })()"
        );
    };

    return comum;
}