@ui
Feature: UI Test My Organisation Verification
  Esta feature contém os testes de Frontend voltados para a validação dos componentes,
  listagens e ações dentro da aba "My Organisation".

  Background:
    * driver uiUrl
    * waitFor("vaadin-login-form")
    * def LoginPage = call read('../pages/login-page.js')
    * def HomeAccessPage = call read('../pages/home-access-page.js')
    * def HomeActionsSidebar = call read('../pages/home-actions-sidebar.js')
    * def TestCustomersPage = call read('../pages/custumers-page.js')

    # Nova declaração modular para a aba My Organisation e suas sub-abas

    * def TestCustomersPage = call read('../pages/custumers-page.js')
    * def MyOrganisationPage = call read('../pages/myOrganisation-page.js')
    * def BasicInfoPage = call read('../pages/myOrganisation_BasicInfo-page.js')
    #* def UsersPage = call read('../pages/myOrganisation_Users-page.js')

    * configure retry = { count: 40, interval: 500 }

    # Pré-condição: Login e navegação inicial
    * LoginPage.enterEmail('anderson.silva@200dev.com')
    * LoginPage.enterPassword('AFS@s159!')
    * retry until LoginPage.isLoginButtonEnabled() == true
    * LoginPage.clickLogin()
    * HomeAccessPage.waitForHomeLoaded()
    * HomeActionsSidebar.clickTestCustomers()
    * match HomeActionsSidebar.waitForTestCustomersTabLoaded() == true

  Scenario: CNF080 - Validar abertura e renderização correta da aba My Organisation
    * delay(1000)
    * def closedTC080 = TestCustomersPage.closeCurrentTab('Test Customers')
    * match closedTC080 == true
    * delay(1000)
    * HomeActionsSidebar.clickMyOrganisation()
    # Aguarda o tempo necessário para o carregamento assíncrono inicial do Vaadin
    * delay(2500)
    * def isLoaded = MyOrganisationPage.waitForMyOrganisationTabLoaded()
    * match isLoaded == true
    * screenshot()

    # Validação da seção visível de Basic Info
    * def isBasicInfoVisible = BasicInfoPage.isBasicInfoSectionVisible()
    * match isBasicInfoVisible == true
    * screenshot()

  Scenario: CNF081 - Validar fechamento exclusivo da aba My Organisation
    # Passo 0: Prepara o ambiente fechando a aba padrão do Background
    * delay(1000)
    * def closedTC081 = TestCustomersPage.closeCurrentTab('Test Customers')
    * match closedTC081 == true
    * delay(1000)

    # Passo 1: Abre a aba My Organisation
    * HomeActionsSidebar.clickMyOrganisation()
    * delay(1500)
    * match MyOrganisationPage.waitForMyOrganisationTabLoaded() == true
    * screenshot()

    # Passo 2: Focar explicitamente na aba My organisation antes de fechá-la (Garante o alvo ativo no DOM)
    * HomeActionsSidebar.clickMyOrganisation()
    * delay(1000)
    * def closedMyOrg081 = TestCustomersPage.closeCurrentTab('My organisation')
    * match closedMyOrg081 == true
    * delay(1500)

    # Passo 3: Valida estritamente que a aba My Organisation foi removida e restou apenas a Home
    * def isTabPresent = driver.script("(function(){ var tabs = document.querySelectorAll('vaadin-tab'); for(var i=0; i<tabs.length; i++){ if(tabs[i].textContent.indexOf('My organisation') !== -1) return true; } return false; })()")
    * karate.log('A aba My organisation ainda existe na barra superior?', isTabPresent)
    * match isTabPresent == false
    * screenshot()

  Scenario: CNF082 - Validar que ao fechar a aba My organisation com múltiplas abas abertas, as demais permanecem intactas
    * HomeActionsSidebar.clickTestCustomers()
    * match HomeActionsSidebar.waitForTestCustomersTabLoaded() == true
    * delay(500)

    * HomeActionsSidebar.clickAuthorizations()
    * match HomeActionsSidebar.waitForAuthorizationsTabLoaded() == true
    * delay(500)

    * HomeActionsSidebar.clickMyOrganisation()
    * delay(1500)
    * match MyOrganisationPage.waitForMyOrganisationTabLoaded() == true
    * delay(500)

    # Passo 4: Focar explicitamente na aba My organisation antes de fechá-la
    * HomeActionsSidebar.clickMyOrganisation()
    * delay(1000)
    * def closedMyOrg082 = TestCustomersPage.closeCurrentTab('My organisation')
    * match closedMyOrg082 == true
    * delay(1500)

    # Passo 5: Validar estritamente que a aba My organisation foi removida da barra superior
    * def isMyOrgPresent = driver.script("(function(){ var tabs = document.querySelectorAll('vaadin-tab'); for(var i=0; i<tabs.length; i++){ if(tabs[i].textContent.trim().indexOf('My organisation') === 0) return true; } return false; })()")
    * match isMyOrgPresent == false

    # Passo 6: Validar estritamente que as demais abas continuam abertas e preservadas
    * def isTestCustomersPresent = driver.script("(function(){ var tabs = document.querySelectorAll('vaadin-tab'); for(var i=0; i<tabs.length; i++){ if(tabs[i].textContent.trim().indexOf('Test Customers') === 0) return true; } return false; })()")
    * match isTestCustomersPresent == true

    * def isAuthorizationsPresent = driver.script("(function(){ var tabs = document.querySelectorAll('vaadin-tab'); for(var i=0; i<tabs.length; i++){ if(tabs[i].textContent.trim().indexOf('Authorizations') === 0) return true; } return false; })()")
    * match isAuthorizationsPresent == true
    * screenshot()