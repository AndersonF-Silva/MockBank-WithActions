function LoginPage() {
    var page = {};

    page.emailField = "input[name*='email'], input[name*='username'], input[type='email']";
    page.passwordField = "input[type='password']";
    page.loginButton = "vaadin-login-form vaadin-button, vaadin-button";
    page.forgotPasswordLink = "{^}Forgot";
    page.signUpLink = "a[href*='signup']";
    page.vaadinLoginForm = "vaadin-login-form";
    // Elemento real confirmado via inspeção do DOM: <div part="error-message">
    // com <h5 part="error-message-title"> e <p part="error-message-description">
    page.errorMessageBox = "[part='error-message']";
    page.errorMessageTitle = "[part='error-message-title']";
    page.errorMessageDescription = "[part='error-message-description']";

    page.isEmailFieldPresent = function() { return exists(page.emailField); };
    page.isPasswordFieldPresent = function() { return exists(page.passwordField); };
    page.isLoginButtonPresent = function() { return exists(page.loginButton); };
    page.isForgotPasswordLinkPresent = function() { return exists(page.forgotPasswordLink); };
    page.isSignUpLinkPresent = function() { return exists(page.signUpLink); };

    page.enterEmail = function(email) { input(page.emailField, email); };
    page.enterPassword = function(password) { input(page.passwordField, password); };
    page.clickLogin = function() { click(page.loginButton); };

    // Aguarda até que a caixa de erro ([part="error-message"]) tenha texto renderizado.
    // Busca em todo o document + shadow roots, já que [part] pode estar em qualquer nível.
    page.waitForErrorMessageBox = function() {
        return driver.waitUntil(
            "(function(){ \
              function findByPart(root, partName){ \
                  root = root || document; \
                  var elements = Array.from(root.querySelectorAll('[part]')); \
                  for (var i = 0; i < elements.length; i++){ \
                      if (elements[i].getAttribute('part') === partName) return elements[i]; \
                  } \
                  var all = Array.from(root.querySelectorAll('*')); \
                  for (var j = 0; j < all.length; j++){ \
                      if (all[j].shadowRoot){ \
                          var found = findByPart(all[j].shadowRoot, partName); \
                          if (found) return found; \
                      } \
                  } \
                  return null; \
              } \
              var el = findByPart(document, 'error-message'); \
              return !!(el && el.textContent.trim().length > 0); \
            })()"
        );
    };

    // Captura mensagem de erro como string única, combinando título + descrição
    // do bloco [part="error-message"], que é a estrutura real confirmada no DOM.
    page.getErrorMessageText = function() {
        var script = `
      (() => {
        function findByPart(root, partName) {
          root = root || document;
          const elements = Array.from(root.querySelectorAll('[part]'));
          for (const el of elements) {
            if (el.getAttribute('part') === partName) return el;
          }
          const all = Array.from(root.querySelectorAll('*'));
          for (const el of all) {
            if (el.shadowRoot) {
              const found = findByPart(el.shadowRoot, partName);
              if (found) return found;
            }
          }
          return null;
        }

        function clean(text) {
          return (text || '').replace(/\\s+/g, ' ').trim();
        }

        const errorBox = findByPart(document, 'error-message');
        if (errorBox) {
          return clean(errorBox.textContent);
        }

        // Fallback: caso a estrutura de 'part' mude, tenta pegar título + descrição separadamente
        const title = findByPart(document, 'error-message-title');
        const description = findByPart(document, 'error-message-description');
        if (title || description) {
          return clean((title ? title.textContent : '') + ' ' + (description ? description.textContent : ''));
        }

        return '';
      })()
    `;
        return driver.script(script);
    };

    page.waitForErrorMessage = function() {
        waitFor(page.vaadinLoginForm);
        var tries = 0;
        while (tries < 20) {
            var msg = page.getErrorMessageText();
            if (msg && msg.length > 0) {
                return msg;
            }
            java.lang.Thread.sleep(500);
            tries++;
        }
        return '';
    };

    return page;
}