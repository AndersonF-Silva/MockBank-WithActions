@ui
Feature: UI Test Authorizations Verification
  Esta feature contém os testes de Frontend voltados para a validação dos componentes,
  listagens e ações dentro da aba "Authorizations".

  Background:
    * driver uiUrl
    * waitFor("vaadin-login-form")
    * def LoginPage = call read('../pages/login-page.js')
    * def HomeAccessPage = call read('../pages/home-access-page.js')
    * def HomeActionsSidebar = call read('../pages/home-actions-sidebar.js')
    * def AuthorizationsPage = call read('../pages/authorizations-page.js')
    * configure retry = { count: 40, interval: 500 }

    # Pre-condição: Login e navegação para a aba Authorizations
    * LoginPage.enterEmail('anderson.silva@200dev.com')
    * LoginPage.enterPassword('AFS@s159!')
    * retry until LoginPage.isLoginButtonEnabled() == true
    * LoginPage.clickLogin()
    * HomeAccessPage.waitForHomeLoaded()
    * HomeActionsSidebar.clickTestCustomers()
    * match HomeActionsSidebar.waitForTestCustomersTabLoaded() == true

  Scenario: CNF075 - Validar abertura e fechamento exclusivo da aba Authorizations restando apenas a Home
    # Passo 0: Aguarda a estabilização do Background e fecha imediatamente a aba Test Customers indesejada
    * delay(1000)
    * def closedTC075 = AuthorizationsPage.closeCurrentTab('Test Customers')
    * match closedTC075 == true
    * delay(1000)

    # Passo 1: Abre exclusivamente a aba Authorizations a partir da Home limpa
    * HomeActionsSidebar.clickAuthorizations()
    * delay(1000)
    * match HomeActionsSidebar.waitForAuthorizationsTabLoaded() == true
    * screenshot()

    # Passo 2: Fecha a aba Authorizations pelo botão X
    * def closedAuth075 = AuthorizationsPage.closeCurrentTab('Authorizations')
    * match closedAuth075 == true
    * delay(1500)

    # Passo 3: Valida estritamente que a aba Authorizations sumiu e restou apenas a Home
    * def isTabPresent = driver.script("(function(){ var tabs = document.querySelectorAll('vaadin-tab'); for(var i=0; i<tabs.length; i++){ if(tabs[i].textContent.indexOf('Authorizations') !== -1) return true; } return false; })()")
    * karate.log('A aba Authorizations ainda existe na barra superior?', isTabPresent)
    * match isTabPresent == false
    * screenshot()

  Scenario: CNF076 - Validar fechamento da aba Authorizations (somente ela aberta)
    # Passo 0: Limpa a aba Test Customers herdada do Background para iniciar o teste com apenas a Home limpa
    * delay(1000)
    * def closedTC076 = AuthorizationsPage.closeCurrentTab('Test Customers')
    * match closedTC076 == true
    * delay(1000)

    # Passo 1: Abre exclusivamente a aba Authorizations a partir da Home
    * HomeActionsSidebar.clickAuthorizations()
    * delay(1000)
    * match HomeActionsSidebar.waitForAuthorizationsTabLoaded() == true
    * screenshot()

    # Passo 2: Fecha a aba Authorizations sendo a única ativa (além da Home)
    * def closedAuth076 = AuthorizationsPage.closeCurrentTab('Authorizations')
    * match closedAuth076 == true
    * delay(1500)

    # Passo 3: Valida estritamente que a aba Authorizations foi fechada e restou apenas a Home ativa
    * def isTabPresent = driver.script("(function(){ var tabs = document.querySelectorAll('vaadin-tab'); for(var i=0; i<tabs.length; i++){ if(tabs[i].textContent.indexOf('Authorizations') !== -1) return true; } return false; })()")
    * karate.log('A aba Authorizations ainda existe na barra superior?', isTabPresent)
    * match isTabPresent == false
    * screenshot()

  Scenario: CNF077 - Validar que ao fechar a aba Authorizations com múltiplas abas abertas, as demais permanecem intactas
    * HomeActionsSidebar.clickTestCustomers()
    * match HomeActionsSidebar.waitForTestCustomersTabLoaded() == true
    * delay(500)

    * HomeActionsSidebar.clickMyOrganisation()
    * delay(500)

    * HomeActionsSidebar.clickAuthorizations()

  # Aguarda até que a aba Authorizations esteja visível na barra principal
    * match AuthorizationsPage.waitForAuthorizationsTabLoaded() == true

  # Diagnóstico: loga as abas de nível de aplicação (fecháveis) antes de fechar
    * def openTabsBeforeClose = AuthorizationsPage.getOpenTabs()
    * print 'ABAS ABERTAS ANTES DE FECHAR:', openTabsBeforeClose

    * match AuthorizationsPage.isTabPresent('Authorizations') == true

    * AuthorizationsPage.closeCurrentTab('Authorizations')

  # Diagnóstico: loga as abas de nível de aplicação depois de fechar
    * def openTabsAfterClose = AuthorizationsPage.getOpenTabs()
    * print 'ABAS ABERTAS DEPOIS DE FECHAR:', openTabsAfterClose

    * match AuthorizationsPage.isTabPresent('Authorizations') == false
    * match AuthorizationsPage.isTabPresent('Test Customers') == true
    * match AuthorizationsPage.isTabPresent('My organisation') == true

    * screenshot()