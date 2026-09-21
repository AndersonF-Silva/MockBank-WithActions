@api
Feature: API Health Check

Background:
* url baseUrl

Scenario: Verify API is up
    Given path '/health'
    When method get
    Then status 200
