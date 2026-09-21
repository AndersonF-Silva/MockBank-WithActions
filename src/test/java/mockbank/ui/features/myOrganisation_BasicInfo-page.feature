@ui
Feature: UI Test My Organisation Basic Info Page
  Esta feature contém os testes de Frontend voltados para a validação dos componentes,
  listagens e ações dentro da aba "Basic Info" na aba "My Organisation".

  Background:
    * driver uiUrl
    * waitFor("vaadin-login-form")
    * def LoginPage = call read('../pages/login-page.js')
    * def HomeAccessPage = call read('../pages/home-access-page.js')
    * def HomeActionsSidebar = call read('../pages/home-actions-sidebar.js')
    * def TestCustomersPage = call read('../pages/custumers-page.js')

    # Nova declaração modular para a aba My Organisation e suas sub-abas
    * def MyOrganisationPage = call read('../pages/myOrganisation-page.js')
    * def BasicInfoPage = call read('../pages/myOrganisation_BasicInfo-page.js')
    * def UsersPage = call read('../pages/myOrganisation_Users-page.js')

    * configure retry = { count: 40, interval: 500 }

    # Pré-condição: Login e navegação inicial
    * LoginPage.enterEmail('anderson.silva@200dev.com')
    * LoginPage.enterPassword('AFS@s159!')
    * retry until LoginPage.isLoginButtonEnabled() == true
    * LoginPage.clickLogin()
    * HomeAccessPage.waitForHomeLoaded()
    * HomeActionsSidebar.clickTestCustomers()
    * match HomeActionsSidebar.waitForTestCustomersTabLoaded() == true

  Scenario: CNF083 - Validar que a sub-aba Basic info vem aberta por padrão ao acessar My organisation
    * delay(2000)
    * TestCustomersPage.closeCurrentTab('Test Customers')
    * delay(2000)
    * HomeActionsSidebar.clickMyOrganisation()
    * delay(3000)
    * match MyOrganisationPage.waitForMyOrganisationTabLoaded() == true
    * screenshot()
    # Espera até que a aba Basic Info esteja realmente ativa
    * retry until BasicInfoPage.isBasicInfoActive() == true
    * def basicSelected = BasicInfoPage.isBasicInfoActive()
    * match basicSelected == true
    # Espera até que a seção esteja visível também
    * retry until BasicInfoPage.isBasicInfoSectionVisible() == true
    * def isBasicInfoVisible = BasicInfoPage.isBasicInfoSectionVisible()
    * match isBasicInfoVisible == true
    * screenshot()

  Scenario: CNF084 - Validar clique e transição para a sub-aba Users
    * delay(1000)
    * TestCustomersPage.closeCurrentTab('Test Customers')
    * delay(1000)
    * HomeActionsSidebar.clickMyOrganisation()
    * delay(1000)
    * match MyOrganisationPage.waitForMyOrganisationTabLoaded() == true
    * screenshot()
    * def clickedUsers = UsersPage.clickUsersSubTab()
    * match clickedUsers == true
    * delay(1000)
    * def usersSelected = UsersPage.isUsersActive()
    * match usersSelected == true
    * screenshot()

  Scenario: CNF085 - Validar clique e retorno para a sub-aba Basic info após navegar para Users
    * delay(1000)
    * TestCustomersPage.closeCurrentTab('Test Customers')
    * delay(1000)
    * HomeActionsSidebar.clickMyOrganisation()
    * delay(3000)
    * match MyOrganisationPage.waitForMyOrganisationTabLoaded() == true
    * screenshot()
    * def clickedUsers = UsersPage.clickUsersSubTab()
    * match clickedUsers == true
    * delay(3000)
    * def usersSelected = UsersPage.isUsersActive()
    * match usersSelected == true
    * screenshot()
    * def clickedBasic = BasicInfoPage.clickBasicInfoSubTab()
    * match clickedBasic == true
    * delay(3000)
    * def basicSelectedAgain = BasicInfoPage.isBasicInfoActive()
    * match basicSelectedAgain == true
    * def isBasicInfoVisible = BasicInfoPage.isBasicInfoSectionVisible()
    * match isBasicInfoVisible == true
    * screenshot()

  Scenario: CNF089 - Validar que a sub-aba Basic info traz os campos obrigatórios preenchidos ao carregar
    * delay(1000)
    * TestCustomersPage.closeCurrentTab('Test Customers')
    * delay(1000)
    * HomeActionsSidebar.clickMyOrganisation()
    * delay(3000)
    * match MyOrganisationPage.waitForMyOrganisationTabLoaded() == true
    * screenshot()
    * def basicSelected = BasicInfoPage.isBasicInfoActive()
    * match basicSelected == true
    * def isBasicInfoVisible = BasicInfoPage.isBasicInfoSectionVisible()
    * match isBasicInfoVisible == true
    * screenshot()
    * delay(2000)
    * def isNamePopulated = BasicInfoPage.isFieldPopulated('Name')
    * match isNamePopulated == true
    * def isStatusPopulated = BasicInfoPage.isFieldPopulated('Status')
    * match isStatusPopulated == true
    * def isClientIdPopulated = BasicInfoPage.isFieldPopulated('Client Id')
    * match isClientIdPopulated == true
    * screenshot()