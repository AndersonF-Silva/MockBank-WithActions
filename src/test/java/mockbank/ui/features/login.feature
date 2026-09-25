@ui
Feature: UI Login Page Verification
    Esta feature contém os testes de Frontend voltados para a validação da interface de usuário (UI) da página de login.

    Background:
        * driver uiUrl
        * waitFor('vaadin-login-form')
        * def LoginPage = call read('../pages/login-page.js')

    Scenario: CNF014 - Validar exibicao do campo para preenchimento do Email
        * def found = LoginPage.isEmailFieldPresent()
        * karate.log(found ? 'Sucesso! Campo presente/existente' : 'Falha! Campo ausente!')
        * match found == true

    Scenario: CNF015 - Validar exibicao do campo para preenchimento do Password/Senha
        * def found = LoginPage.isPasswordFieldPresent()
        * karate.log(found ? 'Sucesso! Campo presente/existente' : 'Falha! Campo ausente!')
        * match found == true

    Scenario: CNF016 - Validar exibicao do botao de Log In
        * def found = LoginPage.isLoginButtonPresent()
        * karate.log(found ? 'Sucesso! Campo presente/existente' : 'Falha! Campo ausente!')
        * match found == true

    Scenario: CNF017 - Validar exibicao do botao Forgot password?
        * def found = LoginPage.isForgotPasswordLinkPresent()
        * karate.log(found ? 'Sucesso! Campo presente/existente' : 'Falha! Campo ausente!')
        * match found == true

    Scenario: CNF018 - Validar exibicao do botao Sign Up
        * def found = LoginPage.isSignUpLinkPresent()
        * karate.log(found ? 'Sucesso! Campo presente/existente' : 'Falha! Campo ausente!')
        * match found == true

    Scenario: CNF019 - Validar título da mensagem de erro
        * LoginPage.enterEmail('invalid@mockbank.io')
        * LoginPage.enterPassword('wrongpassword')
        * LoginPage.clickLogin()
    # Usa delay nativo do Karate (1000 ms)
        * delay(1000)
        * LoginPage.waitForErrorMessage()
        * def errorText = LoginPage.getErrorMessageText()
        * match errorText contains 'Incorrect username or password'

    Scenario: CNF020 - Validar detalhe da mensagem de erro
        * LoginPage.enterEmail('invalid@mockbank.io')
        * LoginPage.enterPassword('wrongpassword')
        * LoginPage.clickLogin()

        * configure retry = { count: 30, interval: 1000 }
        * retry until LoginPage.waitForErrorMessageBox() == true

        * def fullText = LoginPage.getErrorMessageText()
        * karate.log('Mensagem completa na UI:', fullText)
        * match fullText contains 'Check that you have entered the correct username and password and try again.'
        * driver.screenshot()

    Scenario: CNF046 - Validar mensagem de erro ao tentar logar com credenciais invalidas - Herdado da feature Home Access
        * LoginPage.enterEmail('invalid@mockbank.io')
        * LoginPage.enterPassword('wrongpassword')
        * retry until LoginPage.isLoginButtonEnabled() == true
        * LoginPage.clickLogin()
        * def errorText = LoginPage.waitForErrorMessage()
        * karate.log('Mensagem de erro:', errorText)
        * match errorText contains 'Incorrect username or password'
        * screenshot()