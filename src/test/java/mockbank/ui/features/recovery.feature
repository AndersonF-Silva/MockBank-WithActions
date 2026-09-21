@ui
Feature: UI Recuperação de senha
    Esta feature contém os testes de Frontend voltados para a validação da interface de usuário (UI) da página de recuperação de senha.

    Background:
        * configure driver = { retryInterval: 1000, retryCount: 60 }
        * def LoginPage = call read('../pages/login-page.js')
        * def RecoveryPage = call read('../pages/recovery-page.js')

    Scenario: CNF021 - Validar exibicao do botao/link Forgot password?
        * driver 'https://app.mockbank.io/login'
        * waitFor("vaadin-login-form")
        * def found = RecoveryPage.isForgotPasswordLinkPresent()
        * match found == true

    Scenario: CNF022 - Validar o clique sobre Forgot password exibindo a pagina de recuperacao
        * driver 'https://app.mockbank.io/login'
        * waitFor("vaadin-login-form")
        * def clicked = RecoveryPage.clickForgotPassword()
        * retry until exists(RecoveryPage.emailField)
        * match exists(RecoveryPage.emailField) == true

    Scenario: CNF023 - Validar preenchimento de um email invalido, nao habilitando o botao Send me instructions
        * driver RecoveryPage.recoveryUrl
        * waitFor(RecoveryPage.emailField)
        * RecoveryPage.enterEmail('email_invalido')
        * def disabled = RecoveryPage.isSendInstructionsButtonDisabled()
        * match disabled == true

    Scenario: CNF024 - Email válido não registrado
        * driver RecoveryPage.recoveryUrl
        * waitFor(RecoveryPage.emailField)
        * RecoveryPage.enterEmail('nao_registrado123@teste123.io')
        * def enabled = RecoveryPage.waitForSendInstructionsEnabled()
        * match enabled == true
        * RecoveryPage.startToastCatcher()
        * RecoveryPage.clickSendInstructions()
        * RecoveryPage.waitForToastText("Sorry, we can't send email to")
        * match RecoveryPage.getLastToastText() contains "Sorry, we can't send email to"

    Scenario: CNF025 - Email válido registrado
        * driver RecoveryPage.recoveryUrl
        * waitFor(RecoveryPage.emailField)
        * RecoveryPage.enterEmail('anderson.silva@200dev.com')
        * def enabled = RecoveryPage.waitForSendInstructionsEnabled()
        * match enabled == true
        * RecoveryPage.startToastCatcher()
        * RecoveryPage.clickSendInstructions()
        * RecoveryPage.waitForToastText("Instructions were sent to")
        * match RecoveryPage.getLastToastText() contains "Instructions were sent to"