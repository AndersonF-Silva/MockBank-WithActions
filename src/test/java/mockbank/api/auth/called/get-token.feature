@ignore
Feature: Get Auth Token Endpoint

  Background:
    * url 'https://api.mockbank.io'
    * def Base64 = Java.type('java.util.Base64')

  Scenario: Get OAuth2 Token
    # As variáveis client_id, client_secret, username, password serão passadas via 'call'
    * def rawAuth = client_id + ':' + client_secret
    * def encodedAuth = Base64.getEncoder().encodeToString(rawAuth.getBytes('UTF-8'))

    Given path '/oauth/token'
    And header Authorization = 'Basic ' + encodedAuth
    And form field grant_type = 'password'
    And form field username = username
    And form field password = password
    When method post
    # Não valida o status aqui, quem chama este feature fará a validação
    # A resposta e o status serão retornados implicitamente para quem chamou
    * def token = response.access_token