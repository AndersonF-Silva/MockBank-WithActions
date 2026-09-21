@ui
Feature: UI Home Page Verification - Detalhes
  Esta feature contém os testes de Frontend voltados para validar os cards e detalhes da Home.

  Background:
    * driver uiUrl
    * waitFor("vaadin-login-form")
    * def LoginPage = call read('../pages/login-page.js')
    * def HomeAccessPage = call read('../pages/home-access-page.js')
    * def HomeActionsSidebar = call read('../pages/home-actions-sidebar.js')
    * def TestCustomersPage = call read('../pages/custumers-page.js')
    * configure retry = { count: 60, interval: 400 }

    # Pré-condição: Realiza o login e aguarda o carregamento da Home
    * LoginPage.enterEmail('anderson.silva@200dev.com')
    * LoginPage.enterPassword('AFS@s159!')
    * retry until LoginPage.isLoginButtonEnabled() == true
    * LoginPage.clickLogin()
    * HomeAccessPage.waitForHomeLoaded()

  Scenario: CNF059 - Validar card Quick start
    * match HomeAccessPage.isQuickStartCardPresent() == true
    * screenshot()

  Scenario: CNF060 - Validar card All Tutorials
    * match HomeAccessPage.isAllTutorialsCardPresent() == true
    * screenshot()

  Scenario: CNF061 - Validar card Connect Using partner's AISP
    * match HomeAccessPage.isConnectAispCardPresent() == true
    * screenshot()

  Scenario: CNF062 - Validar abertura da aba Test Customers através da sidebar
    * HomeActionsSidebar.clickTestCustomers()
    * match HomeActionsSidebar.waitForTestCustomersTabLoaded() == true
    * retry until driver.script("(function(){var tab=document.querySelector('vaadin-tab[aria-selected=\"true\"]');return tab && tab.textContent.trim().toLowerCase().indexOf('test customers')!==-1;})()") == true
    * driver.script("document.querySelector('vaadin-tab[aria-selected=\"true\"]').scrollIntoView()")
    * delay(1000)
    * screenshot()

  Scenario: CNF063 - Validar abertura da aba Authorizations através da sidebar
    * HomeActionsSidebar.clickAuthorizations()
    * match HomeActionsSidebar.waitForAuthorizationsTabLoaded() == true
    * retry until driver.script("(function(){ var tab = document.querySelector('vaadin-tab[aria-selected=\"true\"]'); return tab && tab.textContent.trim().toLowerCase().indexOf('authorizations') !== -1; })()") == true
    * driver.script("document.querySelector('vaadin-tab[aria-selected=\"true\"]').scrollIntoView()")
    * delay(1000)
    * screenshot()

  Scenario: CNF064 - Validar abertura da aba My organisation através da sidebar
    * HomeActionsSidebar.clickMyOrganisation()
    * match HomeActionsSidebar.waitForMyOrganisationTabLoaded() == true
    * retry until driver.script("(function(){var tab=document.querySelector('vaadin-tab[aria-selected=\"true\"]');return tab && tab.textContent.trim().toLowerCase().indexOf('my organisation')!==-1;})()") == true
    * driver.script("document.querySelector('vaadin-tab[aria-selected=\"true\"]').scrollIntoView()")
    * delay(1000)
    * screenshot()

  Scenario: CNF065 - Validar retorno para a aba Home através da sidebar
    # Passo 1: Navegar para outra aba para sair da Home
    * HomeActionsSidebar.clickTestCustomers()
    * match HomeActionsSidebar.waitForTestCustomersTabLoaded() == true

    # Passo 2: Clicar na sidebar para retornar à Home
    * HomeActionsSidebar.clickHome()

    # Passo 3: Validar que a Home foi carregada novamente com sucesso
    * match HomeAccessPage.waitForHomeLoaded() == true
    * retry until driver.script("(function(){var tab=document.querySelector('vaadin-tab[aria-selected=\"true\"]');return tab && tab.textContent.trim().toLowerCase().indexOf('home')!==-1;})()") == true
    * driver.script("document.querySelector('vaadin-tab[aria-selected=\"true\"]').scrollIntoView()")
    * delay(1000)
    * screenshot()