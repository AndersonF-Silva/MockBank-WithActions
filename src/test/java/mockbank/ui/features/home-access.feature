@ui
Feature: UI Home Page Verification - Acesso
  Esta feature contém os testes de Frontend voltados para a validação da interface de usuário (UI) da página Home, validando apenas a existencia dos componentes, exibida após o login.

  Background:
    * driver uiUrl
    * waitFor("vaadin-login-form")
    * def LoginPage = call read('../pages/login-page.js')
    * def HomeAccessPage = call read('../pages/home-access-page.js')
    * configure retry = { count: 40, interval: 500 }

    # Pré-condição padronizada para os testes da Home (Login com sucesso)
    * LoginPage.enterEmail('anderson.silva@200dev.com')
    * LoginPage.enterPassword('AFS@s159!')
    * retry until LoginPage.isLoginButtonEnabled() == true
    * LoginPage.clickLogin()
    * HomeAccessPage.waitForHomeLoaded()

  Scenario: CNF047 - Validar login com credenciais validas redireciona para a Home
    * def urlAfter = driver.url
    * karate.log('URL após login:', urlAfter)
    * match urlAfter == 'https://app.mockbank.io/'
    * screenshot()

  Scenario: CNF048 - Validar heading de boas-vindas
    * def headingText = HomeAccessPage.getWelcomeHeadingText()
    * karate.log('Texto do heading:', headingText)
    * match headingText contains 'Welcome to MockBank!'
    * screenshot()

  Scenario: CNF049 - Validar exibicao do menu Authorizations
    * match HomeAccessPage.isAuthorizationsLinkPresent() == true
    * screenshot()

  Scenario: CNF050 - Validar exibicao do menu My organisation
    * match HomeAccessPage.isMyOrganisationLinkPresent() == true
    * screenshot()

  Scenario: CNF051 - Validar exibicao do titulo de boas-vindas
    * match HomeAccessPage.isWelcomeHeadingPresent() == true
    * screenshot()

  Scenario: CNF052 - Validar exibicao do card Quick start
    * match HomeAccessPage.isQuickStartCardPresent() == true
    * match HomeAccessPage.isLetsStartButtonPresent() == true
    * screenshot()

  Scenario: CNF053 - Validar exibicao do card All Tutorials
    * match HomeAccessPage.isAllTutorialsCardPresent() == true
    * screenshot()

  Scenario: CNF054 - Validar exibicao do card Connect Using partner's AISP
    * match HomeAccessPage.isConnectAispCardPresent() == true
    * screenshot()

  Scenario: CNF055 - Validar exibicao do card Connect directly
    * match HomeAccessPage.isConnectDirectlyCardPresent() == true
    * screenshot()

  Scenario: CNF056 - Validar exibicao do card Using Internal API
    * match HomeAccessPage.isUsingInternalApiCardPresent() == true
    * screenshot()

  Scenario: CNF057 - Validar quantidade de botoes "More" exibidos na Home
    * def count = HomeAccessPage.countMoreButtons()
    * karate.log('Quantidade de botoes "More" encontrados:', count)
    * match count == 4
    * screenshot()

  Scenario: CNF058 - Validar badge FREE e botão Collapse na Home
    * match HomeAccessPage.isFreeBadgePresent() == true
    * match HomeAccessPage.isHomeTabPresent() == true
    * match HomeAccessPage.isWelcomeTextPresent() == true
    * match HomeAccessPage.isCollapseButtonPresent() == true
    * screenshot()