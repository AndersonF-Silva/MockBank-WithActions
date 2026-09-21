function signupPages() {

    // --- Locators ---
    var signUpLinkLocator = "a[href*='signup']";
    var firstNameSelector = "vaadin-text-field:nth-of-type(1)";
    var lastNameSelector = "vaadin-text-field:nth-of-type(2)";
    var companyNameSelector = "vaadin-text-field:nth-of-type(3)";
    var workEmailSelector = "vaadin-email-field";
    var aispPispSelector = "vaadin-combo-box";
    var passwordSelector = "vaadin-password-field";
    var passwordVisibilityIconSelector = "vaadin-password-field";
    var termsCheckboxSelector = "vaadin-checkbox";
    var termsLinkSelector = "a[href='https://mockbank.io/terms-and-conditions']";
    var signUpButtonSelector = "vaadin-button[aria-label='Sign up']";
    var logInLinkSelector = "a[href*='login']";

function setVaadinValue(selector, val) {
    var valJson = JSON.stringify(val);
    var script = "(function(){ \
        var e=document.querySelector('" + selector + "'); \
        if(!e) return false; \
        var input = e.inputElement || (e.shadowRoot && e.shadowRoot.querySelector('input')); \
        if(input){ \
            input.value=" + valJson + "; \
            input.dispatchEvent(new Event('input',{bubbles:true})); \
            input.dispatchEvent(new Event('change',{bubbles:true})); \
        } \
        e.value=" + valJson + "; \
        e.dispatchEvent(new CustomEvent('value-changed',{detail:{value:" + valJson + "},bubbles:true,composed:true})); \
        return true; \
    })()";
    return driver.script(script);
}

    function isFieldInvalid(selector) {
        return driver.script("(function(){var e=document.querySelector('" + selector + "'); return !!(e && e.hasAttribute('invalid'));})()");
    }

    function getFieldErrorText(selector) {
        return driver.script("(function(){var e=document.querySelector('" + selector + "'); if(!e||!e.shadowRoot) return ''; var m=e.shadowRoot.querySelector('[part=\"error-message\"]'); return m ? m.textContent.trim() : '';})()");
    }

    function waitForFieldInvalid(selector) {
        driver.waitUntil("(function(){var e=document.querySelector('" + selector + "'); return !!(e && e.hasAttribute('invalid'));})()");
    }

    return {

        firstName: firstNameSelector,

        // --- Navegacao ---
        isSignUpLinkPresent: function () {
            return driver.exists(signUpLinkLocator);
        },

        clickSignUpLink: function () {
            driver.click(signUpLinkLocator);
            driver.waitFor("vaadin-form-layout");
        },

        // --- Verificacoes ---
        isFirstNameFieldPresent: function () {
            return driver.exists(firstNameSelector);
        },
        isLastNameFieldPresent: function () {
            return driver.exists(lastNameSelector);
        },
        isCompanyNameFieldPresent: function () {
            return driver.exists(companyNameSelector);
        },
        isWorkEmailFieldPresent: function () {
            return driver.exists(workEmailSelector);
        },
        isAispPispDropdownPresent: function () {
            return driver.exists(aispPispSelector);
        },
        isPasswordFieldPresent: function () {
            return driver.exists(passwordSelector);
        },
        isPasswordVisibilityIconPresent: function () {
            return driver.script("!!document.querySelector('vaadin-password-field').shadowRoot.querySelector('[part=\"reveal-button\"]')");
        },
        isTermsCheckboxPresent: function () {
            return driver.exists(termsCheckboxSelector);
        },
        isTermsAndConditionsLinkPresent: function () {
            return driver.exists(termsLinkSelector);
        },
        isSignUpButtonPresent: function () {
            return driver.exists(signUpButtonSelector);
        },
        isSignUpButtonEnabled: function () {
            return driver.attribute(signUpButtonSelector, 'disabled') == null;
        },
        isLogInLinkPresent: function () {
            return driver.exists(logInLinkSelector);
        },

        // --- Preenchimento ---
        enterFirstName: function (firstName) { setVaadinValue(firstNameSelector, firstName); },
        enterLastName: function (lastName) { setVaadinValue(lastNameSelector, lastName); },
        enterCompanyName: function (companyName) { setVaadinValue(companyNameSelector, companyName); },
        enterWorkEmail: function (email) { setVaadinValue(workEmailSelector, email); },
        selectAispPisp: function (option) { driver.select(aispPispSelector, option); },
        enterPassword: function (password) { setVaadinValue(passwordSelector, password); },

        togglePasswordVisibility: function () {
            driver.script("document.querySelector('vaadin-password-field').shadowRoot.querySelector('[part=\"reveal-button\"]').click()");
        },

        acceptTerms: function () {
            var script = "(function(){ \
        var cb=document.querySelector('vaadin-checkbox'); \
        if(!cb || !cb.shadowRoot) return false; \
        var input=cb.shadowRoot.querySelector('input'); \
        if(!input) return false; \
        input.click(); \
        return cb.checked; \
    })()";
            driver.script(script);
            driver.waitUntil("(function(){var cb=document.querySelector('vaadin-checkbox'); return !!(cb && cb.checked);})()");
        },

        // --- Submit ---
        clickSignUp: function () {
            var script = "(function(){ var btn = document.querySelector(\"vaadin-button[aria-label='Sign up']\") || Array.from(document.querySelectorAll('vaadin-button')).find(function(b){ return (b.textContent||'').trim().toLowerCase().includes('sign up'); }); if(btn){ btn.click(); return true; } return false; })()";
            driver.script(script);
            driver.click(signUpButtonSelector);
        },
        clickSignUpForced: function () {
            // Clique via JS nativo, para o caso do botao ter apenas aparencia
            // "desabilitada" (aria-disabled) sem realmente bloquear a interacao.
            // Aspas duplas por fora, pois o seletor ja usa aspas simples internamente.
            driver.script('document.querySelector("' + signUpButtonSelector + '").click()');
        },
        clickSignUpFull: function () {
            // Dispara sequencia completa de eventos de mouse (pointerdown/mousedown/
            // pointerup/mouseup/click) diretamente no botao nativo interno (dentro do
            // shadow DOM do vaadin-button), simulando uma interacao real de verdade.
            driver.script(
                "(function(){" +
                "var host = document.querySelector(\"" + signUpButtonSelector + "\"); " +
                "if(!host) return 'host nao encontrado'; " +
                "var target = (host.shadowRoot && host.shadowRoot.querySelector('#button')) || host; " +
                "var rect = target.getBoundingClientRect(); " +
                "var x = rect.left + rect.width/2, y = rect.top + rect.height/2; " +
                "['pointerdown','mousedown','pointerup','mouseup','click'].forEach(function(type){ " +
                "  var ev = new MouseEvent(type, {bubbles:true, cancelable:true, composed:true, clientX:x, clientY:y, view:window}); " +
                "  target.dispatchEvent(ev); " +
                "}); " +
                "return 'ok'; " +
                "})()"
            );
        },
        clickLogIn: function () {
            driver.click(logInLinkSelector);
        },

        waitForErrorMessage: function () {
            waitForFieldInvalid(workEmailSelector);
        },
        getErrorMessageText: function () {
            return getFieldErrorText(workEmailSelector);
        },
        isWorkEmailFieldInvalid: function () {
            return isFieldInvalid(workEmailSelector);
        },

        // --- Validacao obrigatorios ---
        waitForCompanyNameError: function () {
            waitForFieldInvalid(companyNameSelector);
        },
        isCompanyNameFieldInvalid: function () {
            return isFieldInvalid(companyNameSelector);
        },
        getCompanyNameErrorText: function () {
            return getFieldErrorText(companyNameSelector);
        },
        waitForWorkEmailError: function () {
            waitForFieldInvalid(workEmailSelector);
        },
        getWorkEmailErrorText: function () {
            return getFieldErrorText(workEmailSelector);
        },

        // --- Ajustes CNF028 ---
        waitForToastMessage: function () {
            driver.waitUntil("(function(){return !!document.querySelector('vaadin-notification-card, vaadin-notification-container');})()");
        },

        getToastMessageText: function () {
            return driver.script("(function(){ \
        var card=document.querySelector('vaadin-notification-card'); \
        if(card){ \
            var m=card.shadowRoot ? card.shadowRoot.querySelector('[part=\"content\"]') : null; \
            if(m) return m.innerText.trim(); \
            return card.innerText.trim(); \
        } \
        var container=document.querySelector('vaadin-notification-container'); \
        if(container){ return container.innerText.trim(); } \
        return ''; \
    })()");
        },

        // O toast do Vaadin pode se auto-fechar em poucos milissegundos E pode
        // renderizar o texto dentro de um shadow DOM aninhado. Em vez de confiar
        // num seletor especifico, o observer varre recursivamente qualquer node
        // (incluindo shadow roots) atras do texto da mensagem, assim que ele surgir.
        armToastObserver: function () {
            driver.script(
                "window.__toastText = ''; " +
                "if (window.__toastObserver) { window.__toastObserver.disconnect(); } " +
                "function __scan(node) { " +
                "  if (window.__toastText || !node) return; " +
                "  if (node.nodeType === 3) { " +
                "    var t = node.textContent; " +
                "    if (t && t.toLowerCase().indexOf('valid data') !== -1) { " +
                "      window.__toastText = (node.parentElement ? node.parentElement.textContent : t).trim(); " +
                "    } " +
                "    return; " +
                "  } " +
                "  if (node.shadowRoot) { Array.prototype.forEach.call(node.shadowRoot.childNodes, __scan); } " +
                "  if (node.childNodes) { Array.prototype.forEach.call(node.childNodes, __scan); } " +
                "} " +
                "window.__toastObserver = new MutationObserver(function(){ __scan(document.body); }); " +
                "window.__toastObserver.observe(document.body, {childList:true, subtree:true, characterData:true});"
            );
        },

        getObservedToastText: function () {
            return driver.script("window.__toastText || ''");
        },

        waitForSignUpButtonEnabled: function () {
            driver.waitUntil("(function(){var e=document.querySelector('" + signUpButtonSelector + "'); return !!(e && !e.hasAttribute('disabled'));})()");
        },

        //Verificar mensagem no modal de confirmacao de SignUp
        getSuccessMessageText: function () {
          return driver.script("(function(){ \
            var container = document.querySelector('body'); \
            if(!container) return ''; \
            return container.innerText; \
          })()");
}
    };

}