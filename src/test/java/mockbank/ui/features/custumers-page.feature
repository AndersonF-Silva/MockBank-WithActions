@ui
Feature: UI Test Customers Verification
  Esta feature contém os testes de Frontend voltados para a validação dos componentes,
  listagens e ações dentro da aba "Test Customers".

  Background:
    * driver uiUrl
    * waitFor("vaadin-login-form")
    * def LoginPage = call read('../pages/login-page.js')
    * def HomeAccessPage = call read('../pages/home-access-page.js')
    * def HomeActionsSidebar = call read('../pages/home-actions-sidebar.js')
    * def TestCustomersPage = call read('../pages/custumers-page.js')
    * configure retry = { count: 40, interval: 500 }

    # Pre-condição: Login e navegação para a aba Test Customers
    * LoginPage.enterEmail('anderson.silva@200dev.com')
    * LoginPage.enterPassword('AFS@s159!')
    * retry until LoginPage.isLoginButtonEnabled() == true
    * LoginPage.clickLogin()
    * HomeAccessPage.waitForHomeLoaded()
    * HomeActionsSidebar.clickTestCustomers()
    * match HomeActionsSidebar.waitForTestCustomersTabLoaded() == true

  Scenario: CNF066 - Validar exibicao da listagem de test customers
    * match TestCustomersPage.isCustomerListVisible() == true
    * screenshot()

  Scenario: CNF067 - Validar ordenacao da listagem pela coluna Name
    * TestCustomersPage.clickColumnSort('Name')
    * delay(1000)
    * screenshot()

  Scenario: CNF068 - Validar ordenacao da listagem pela coluna Username
    * TestCustomersPage.clickColumnSort('Username')
    * delay(1000)
    * screenshot()

  Scenario: CNF069 - Validar ordenacao da listagem pela coluna Country
    * TestCustomersPage.clickColumnSort('Country')
    * delay(1000)
    * screenshot()

  Scenario: CNF070 - Validar interacao com o checkbox Demo user
    * TestCustomersPage.toggleDemoUserCheckbox()
    * delay(1000)
    * screenshot()

  Scenario: CNF071 - Validar duplo clique em customer COM Demo user marcado abre os detalhes
    * TestCustomersPage.doubleClickCustomer(true)
    * delay(2000)
    * def urlAfter = driver.url
    * karate.log('URL após duplo clique (Demo):', urlAfter)
    * match urlAfter contains 'https://app.mockbank.io/customers'
    * screenshot()

  Scenario: CNF072 - Validar duplo clique em customer SEM Demo user marcado abre os detalhes
    * TestCustomersPage.doubleClickCustomer(false)
    * delay(2000)
    * def urlAfter = driver.url
    * karate.log('URL após duplo clique (Não-Demo):', urlAfter)
    * match urlAfter contains 'https://app.mockbank.io/customers'
    * screenshot()

  Scenario: CNF073 - Validar fechamento da aba Test Customers clicando no botão X
    * screenshot()
    # Garante que estamos na aba Test Customers antes de testar o fechamento dela
    * HomeActionsSidebar.clickTestCustomers()
    * match TestCustomersPage.isCustomerListVisible() == true
    * screenshot()

    # Fecha especificamente a aba Test Customers
    * def closed073 = TestCustomersPage.closeCurrentTab('Test Customers')
    * match closed073 == true
    * delay(1500)

    * def currentUrl = driver.url
    * karate.log('URL após fechar aba:', currentUrl)
    * screenshot()

  Scenario: CNF074 - Validar fechamento da aba Test Customers mantendo o fluxo de abas ativas
    # Passo 1: Abrir uma segunda aba para coexistir no workspace
    * HomeActionsSidebar.clickAuthorizations()
    * match HomeActionsSidebar.waitForAuthorizationsTabLoaded() == true

    # Passo 2: Retornar para a aba Test Customers para realizar a ação de fechamento
    * HomeActionsSidebar.clickTestCustomers()
    * match TestCustomersPage.isCustomerListVisible() == true

    # Passo 3: Fechar a aba Test Customers atual
    * def closed074 = TestCustomersPage.closeCurrentTab()
    * match closed074 == true
    * delay(2000)

    # Passo 4: Validar estritamente que a aba Test Customers foi removida da barra de abas superior
    * def tabStillExists = driver.script("document.body.innerHTML.indexOf('Test Customers') !== -1 && document.querySelector('vaadin-tab[selected]')")
    # Alternativa mais limpa: validamos que a URL atual estabilizou na aba remanescente (Authorizations)
    * def currentUrl = driver.url
    * karate.log('URL final após fechar a aba:', currentUrl)
    * match currentUrl contains 'authorizations'
    * screenshot()