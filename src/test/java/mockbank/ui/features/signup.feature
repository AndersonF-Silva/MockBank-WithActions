@ui
Feature: UI Sign Up Page Verification
  Esta feature contém os testes de Frontend voltados para a validação da interface de usuário (UI) da página de sign up.

  Background:
    * call read('../common/ui-common.feature')
    * configure afterScenario = function(){ if (karate.get('driver')) driver.screenshot() }
    * driver 'https://app.mockbank.io/signup'
    * waitFor('vaadin-form-layout')
    * def SignUpPages = call read('../pages/signup-page.js')

  Scenario: CNF026 - Validar o clique sobre o Sign Up exibindo a pagina de Cadastro de Usuario
    * driver 'https://app.mockbank.io/login'
    * waitFor("vaadin-login-form")
    * SignUpPages.clickSignUpLink()
    * retry until exists(SignUpPages.firstName)
    * match exists(SignUpPages.firstName) == true

  Scenario: CNF027 - Validar exibicao do campo para preenchimento do First Name
    * def found = SignUpPages.isFirstNameFieldPresent()
    * karate.log(found ? 'Sucesso! Campo presente/existente' : 'Falha! Campo ausente!')
    * match found == true

  Scenario: CNF028 - Validar exibicao do campo para preenchimento do Last Name
    * def found = SignUpPages.isLastNameFieldPresent()
    * karate.log(found ? 'Sucesso! Campo presente/existente' : 'Falha! Campo ausente!')
    * match found == true

  Scenario: CNF029 - Validar exibicao do campo para preenchimento do Company Name
    * def found = SignUpPages.isCompanyNameFieldPresent()
    * karate.log(found ? 'Sucesso! Campo presente/existente' : 'Falha! Campo ausente!')
    * match found == true

  Scenario: CNF030 - Validar exibicao do campo para preenchimento do Work Email
    * def found = SignUpPages.isWorkEmailFieldPresent()
    * karate.log(found ? 'Sucesso! Campo presente/existente' : 'Falha! Campo ausente!')
    * match found == true

  Scenario: CNF031 - Validar exibicao do campo opcional AISP/PISP
    * def found = SignUpPages.isAispPispDropdownPresent()
    * karate.log(found ? 'Sucesso! Campo presente/existente' : 'Falha! Campo ausente!')
    * match found == true

  Scenario: CNF032 - Validar exibicao do campo para preenchimento do Password
    * def found = SignUpPages.isPasswordFieldPresent()
    * karate.log(found ? 'Sucesso! Campo presente/existente' : 'Falha! Campo ausente!')
    * match found == true

  Scenario: CNF033 - Validar exibicao do icone de exibir/ocultar senha
    * def found = SignUpPages.isPasswordVisibilityIconPresent()
    * karate.log(found ? 'Sucesso! Campo presente/existente' : 'Falha! Campo ausente!')
    * match found == true

  Scenario: CNF034 - Validar exibicao do checkbox de termos e condicoes
    * def found = SignUpPages.isTermsCheckboxPresent()
    * karate.log(found ? 'Sucesso! Campo presente/existente' : 'Falha! Campo ausente!')
    * match found == true

  Scenario: CNF035 - Validar exibicao do link terms and conditions
    * def found = SignUpPages.isTermsAndConditionsLinkPresent()
    * karate.log(found ? 'Sucesso! Campo presente/existente' : 'Falha! Campo ausente!')
    * match found == true

  Scenario: CNF036 - Validar exibicao do botao Sign up
    * def found = SignUpPages.isSignUpButtonPresent()
    * karate.log(found ? 'Sucesso! Campo presente/existente' : 'Falha! Campo ausente!')
    * match found == true

  Scenario: CNF037 - Validar exibicao do botao Log in
    * def found = SignUpPages.isLogInLinkPresent()
    * karate.log(found ? 'Sucesso! Campo presente/existente' : 'Falha! Campo ausente!')
    * match found == true

  Scenario: CNF038 - Validar botao Sign up desabilitado quando termos nao aceitos
    * SignUpPages.enterFirstName(validSignupUser.firstName)
    * SignUpPages.enterLastName(validSignupUser.lastName)
    * SignUpPages.enterCompanyName(validSignupUser.companyName)
    * SignUpPages.enterWorkEmail('john.doe@mockbank.io')
    * SignUpPages.enterPassword(validSignupUser.password)
    * def enabled = SignUpPages.isSignUpButtonEnabled()
    * karate.log(enabled ? 'Falha! Botao habilitado sem aceite dos termos' : 'Sucesso! Botao desabilitado')
    * match enabled == false

  Scenario: CNF039 - Validar título da mensagem de erro para email já cadastrado
    * SignUpPages.enterFirstName(validSignupUser.firstName)
    * SignUpPages.enterLastName(validSignupUser.lastName)
    * SignUpPages.enterCompanyName(validSignupUser.companyName)
    * SignUpPages.enterWorkEmail(existingUser.email)
    * SignUpPages.enterPassword(existingUser.password)
    * SignUpPages.acceptTerms()
    * SignUpPages.clickSignUp()
    # Usa delay nativo do Karate (1000 ms)
    * delay(1000)
    * SignUpPages.waitForErrorMessage()
    * def errorText = SignUpPages.getErrorMessageText()
    * match errorText contains messages.emailAlreadyUsed

  Scenario: CNF040 - Validar que o campo Work Email fica marcado como invalido apos erro de email já cadastrado
    * SignUpPages.enterFirstName(validSignupUser.firstName)
    * SignUpPages.enterLastName(validSignupUser.lastName)
    * SignUpPages.enterCompanyName(validSignupUser.companyName)
    * SignUpPages.enterWorkEmail(existingUser.email)
    * SignUpPages.enterPassword(existingUser.password)
    * SignUpPages.acceptTerms()
    * SignUpPages.clickSignUp()
    * SignUpPages.waitForErrorMessage()
    * def invalid = SignUpPages.isWorkEmailFieldInvalid()
    * karate.log('Campo Work Email marcado como invalido?', invalid)
    * match invalid == true

  Scenario: CNF041 - Validar mensagem de erro (toast) ao submeter com campos obrigatorios vazios
    * configure retry = { count: 20, interval: 300 }
    * SignUpPages.acceptTerms()
    * SignUpPages.armToastObserver()
    * def clickResult = SignUpPages.clickSignUpFull()
    * karate.log('Resultado do clique:', clickResult)
    # Aguarda o toast aparecer
    * delay(2000)
    * retry until SignUpPages.getObservedToastText() != ''
    * def observedToast = SignUpPages.getObservedToastText()
    * karate.log('Toast capturado:', observedToast)
    # Valida mensagem
    * match observedToast contains messages.invalidDataToast

  Scenario: CNF042 - Validar abertura da página Terms and Conditions
    * def found = SignUpPages.isTermsAndConditionsLinkPresent()
    * karate.log(found ? 'Sucesso! Link Terms and Conditions presente' : 'Falha! Link ausente!')
    * match found == true
    * driver.click("a[href='" + urls.termsAndConditionsHref + "']")
    * driver.switchPage(urls.termsAndConditionsPath)
    * match driver.url contains urls.termsAndConditionsPath

  Scenario: CNF043 - Validar o clique sobre o botão Log in exibindo a página de Login
    * def found = SignUpPages.isLogInLinkPresent()
    * karate.log(found ? 'Sucesso! Botão Log in presente' : 'Falha! Botão ausente!')
    * match found == true
    * SignUpPages.clickLogIn()
    * driver.switchPage("https://app.mockbank.io/login")
    * retry until driver.url contains '/login'
    * match driver.url == 'https://app.mockbank.io/login'
    * waitFor("vaadin-login-form")

  Scenario: CNF044 - Validar título da mensagem de Sucesso ao realizar cadastro
    * def uniqueSuffix = java.lang.System.currentTimeMillis()
    * def email = testEmail.base + '+' + uniqueSuffix + '@' + testEmail.domain
    * SignUpPages.enterFirstName(validSignupUser.firstName)
    * SignUpPages.enterLastName(validSignupUser.lastName)
    * SignUpPages.enterCompanyName(validSignupUser.companyName)
    * SignUpPages.enterWorkEmail(email)
    * SignUpPages.enterPassword(validSignupUser.password)
    * SignUpPages.acceptTerms()
    # Aguarda habilitação do botão
    * delay(2000)
    * retry until SignUpPages.isSignUpButtonEnabled() == true
    # Clique no botão
    * def clickResult = SignUpPages.clickSignUpFull()
    * karate.log('Resultado do clique:', clickResult)
    # Aguarda abertura da página de sucesso
    * delay(2000)
    * def modalOpened = driver.script("(function(){ \ return document.body && document.body.innerText.includes('Thank you!'); \ })()")
    * karate.log('Modal aberto?', modalOpened)
    * match modalOpened == true
    # Aguarda captura da mensagem de sucesso
    * retry until SignUpPages.getSuccessMessageText() != ''
    * def successText = SignUpPages.getSuccessMessageText()
    * karate.log('Mensagem de sucesso capturada:', successText)
    * match successText contains messages.signupSuccessTitle
    * match successText contains 'We have sent you an Email with an activation link.'
    * match successText contains 'Please follow the link to activate your user account.'
    * match successText contains 'And here some documentation that can help you to get started.'

  Scenario: CNF045 - Validar abertura da página jrholding Working with Admin Console
    * def uniqueSuffix = java.lang.System.currentTimeMillis()
    * def email = testEmail.base + '+' + uniqueSuffix + '@' + testEmail.domain
    * SignUpPages.enterFirstName(validSignupUser.firstName)
    * SignUpPages.enterLastName(validSignupUser.lastName)
    * SignUpPages.enterCompanyName(validSignupUser.companyName)
    * SignUpPages.enterWorkEmail(email)
    * SignUpPages.enterPassword(validSignupUser.password)
    * SignUpPages.acceptTerms()
    # Aguarda habilitação do botão
    * delay(2000)
    * retry until SignUpPages.isSignUpButtonEnabled() == true
    # Clique no botão
    * def clickResult = SignUpPages.clickSignUpFull()
    * karate.log('Resultado do clique:', clickResult)
    # Aguarda abertura da página de sucesso
    * delay(2000)
    * retry until driver.script("(function(){ \ return document.body && document.body.innerText.includes('Thank you!'); \ })()") == true
    # Localiza e clica no link "here"
    * def linkClick = driver.script("(function(){ \ var link = document.querySelector('a[href*=\"" + urls.adminConsoleDoc + "\"]'); \ if(!link) return 'LINK NAO ENCONTRADO'; \ link.click(); \ return 'CLICK DISPARADO'; \ })()")
    * karate.log('Resultado do clique no link:', linkClick)
    # Troca para a nova aba aberta
    * driver.switchPage(urls.adminConsoleDoc)
    # Valida a URL da nova aba
    * def currentUrl = driver.url
    * karate.log('URL atual após clique:', currentUrl)
    * match currentUrl contains urls.adminConsoleDoc