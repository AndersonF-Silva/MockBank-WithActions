function RecoveryPage() {
  var page = {};

  // --- Locators ---
  page.recoveryUrl = 'https://app.mockbank.io/recovery';
  page.forgotPasswordLink = "{^}Forgot password?";
  page.emailField = "vaadin-text-field";

  var BUTTON_SELECTOR = "document.querySelector('vaadin-button')";

  // --- Navegação / link "Forgot password?" ---

  page.isForgotPasswordLinkPresent = function() {
    return exists(page.forgotPasswordLink);
  };

  page.clickForgotPassword = function() {
    click(page.forgotPasswordLink);
    return true;
  };

  // --- Preenchimento do campo de email ---

  page.enterEmail = function(email) {
    var emailJson = JSON.stringify(email);
    var script = `
      (() => {
        const tf = document.querySelector("vaadin-text-field");
        if (!tf) return false;
        tf.value = ${emailJson};
        tf.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
        tf.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }));
        tf.dispatchEvent(new CustomEvent('value-changed', { detail: { value: ${emailJson} }, bubbles: true, composed: true }));
        return true;
      })()
    `;
    return driver.script(script);
  };

  // --- Estado e ação do botão "Send me instructions" ---

  page.isSendInstructionsButtonDisabled = function() {
    var script = `
      (() => {
        const btn = ${BUTTON_SELECTOR};
        if (!btn) return true;
        return btn.hasAttribute('disabled') || btn.disabled === true;
      })()
    `;
    return driver.script(script);
  };

  page.waitForSendInstructionsEnabled = function() {
    var script = `
      (() => {
        const btn = ${BUTTON_SELECTOR};
        if (!btn) return false;
        return !(btn.hasAttribute('disabled') || btn.disabled === true);
      })()
    `;
    driver.waitUntil(script);
    return true;
  };

  page.clickSendInstructions = function() {
    var script = `
      (() => {
        const btn = ${BUTTON_SELECTOR};
        if (!btn) return false;
        btn.click();
        return true;
      })()
    `;
    return driver.script(script);
  };

  // --- Captura de mensagens tipo toast (efêmeras, incl. shadow DOM) ---

  page.startToastCatcher = function() {
    var script = `
      (() => {
        window.__lastToastText = '';
        function coletar(node) {
          if (node.nodeType !== 1) return;
          const texto = node.textContent || '';
          if (texto.trim()) {
            window.__lastToastText += ' ' + texto;
          }
          if (node.shadowRoot) {
            const textoShadow = node.shadowRoot.textContent || '';
            if (textoShadow.trim()) {
              window.__lastToastText += ' ' + textoShadow;
            }
          }
        }
        const observer = new MutationObserver((mutations) => {
          mutations.forEach(m => m.addedNodes.forEach(coletar));
        });
        observer.observe(document.body, { childList: true, subtree: true });
        window.__toastObserver = observer;
        return true;
      })()
    `;
    return driver.script(script);
  };

  page.getLastToastText = function() {
    return driver.script(`window.__lastToastText || ''`);
  };

  page.waitForToastText = function(expectedText) {
    var expectedJson = JSON.stringify(expectedText);
    var script = `(window.__lastToastText || '').indexOf(${expectedJson}) !== -1`;
    driver.waitUntil(script);
    return true;
  };

  return page;
}