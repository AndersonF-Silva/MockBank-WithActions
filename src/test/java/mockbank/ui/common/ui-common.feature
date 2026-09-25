Feature: UI Common Data
  Dados, textos e configurações compartilhados entre as features de UI.
  Não contém nada relacionado a driver/waitFor — isso deve continuar no
  Background local de cada feature (ver limitação de closure do GraalVS).

  Scenario:
    * def existingUser = { email: 'anderson.silva@200dev.com', password: 'AFS@s159!' }
    * def validSignupUser = { firstName: 'Anderson F', lastName: 'Silva', companyName: 'Test Company', password: 'SenhaForte123!X' }
    * def testEmail = { base: 'anderson.silva', domain: '200dev.com' }
    * def messages = { emailAlreadyUsed: 'Email already used', invalidDataToast: 'Please enter valid data and try again', signupSuccessTitle: 'Thank you!' }
    * def urls = { termsAndConditionsHref: 'https://mockbank.io/terms-and-conditions', termsAndConditionsPath: 'mockbank.io/terms-and-conditions', adminConsoleDoc: 'jrholding.atlassian.net/wiki/spaces/MPD/pages/679149583/Working+with+Admin-Console' }
    * def recovery = { invalidEmail: 'email_invalido', unregisteredEmail: 'nao_registrado123@teste123.io', messages: { notSent: "Sorry, we can't send email to", sent: 'Instructions were sent to' } }