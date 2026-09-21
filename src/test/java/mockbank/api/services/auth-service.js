function AuthService() {
  var service = {};

  // Função para autenticar e retornar o resultado completo da requisição
  // Recebe o objeto 'user' com as credenciais e, opcionalmente, uma senha para usar
  service.authenticate = function(user, passwordToUse) {
    var currentPassword = passwordToUse || user.user_password; // Usa a senha fornecida ou a padrão

    // Chama o feature file que executa a requisição de token
    // Caminho corrigido para a localização real do get-token.feature
    var result = karate.call('classpath:mockbank/api/auth/called/get-token.feature', {
      client_id: user.client_id,
      client_secret: user.client_secret,
      username: user.user_email,
      password: currentPassword
    });

    // Retorna o objeto de resultado completo para que o feature possa validar status e corpo
    return result;
  };

  return service;
}
