@api @parallel=false
Feature: API Authentication OAuth2
    Esta feature contém os testes de Backend voltados para a autenticação OAuth2 e validação de Tokens.

Background:
* url 'https://api.mockbank.io'
* def user = read('classpath:mockbank/data/user.json')
* def AuthService = call read('../services/auth-service.js')

Scenario: CNB001 - Authenticate and get Token via OAuth2 - Success
    * def authResult = AuthService.authenticate(user)
    * match authResult.responseStatus == 200
    * match authResult.response.access_token == '#notnull'
    * print 'Resposta da API:', authResult.response

Scenario: CNB002 - Validate user authorities in token response
    * def authResult = AuthService.authenticate(user)
    * match authResult.responseStatus == 200
    * print 'AUTHORITIES ENCONTRADAS:', authResult.response.authorities
    * match authResult.response.authorities == '#notnull'
    And match authResult.response.authorities contains 'ROLE_MANAGER'
    And match authResult.response.authorities contains 'ROLE_USER'
    And match karate.sizeOf(authResult.response.authorities) == 2

Scenario: CNB003 - Validate 400 Bad Request with incorrect password
    * def authResult = AuthService.authenticate(user, user.invalid_password)
    * match authResult.responseStatus == 400

Scenario: CNB004 - Validate error description for bad credentials
    * def authResult = AuthService.authenticate(user, user.invalid_password)
    * match authResult.responseStatus == 400
    * def errorText = authResult.response.error
    * karate.log('VALOR DO ERRO ENCONTRADO:', errorText)
    * print 'DETALHE DO ERRO:', authResult.response
    And match authResult.response.error_description contains "Bad credentials"
