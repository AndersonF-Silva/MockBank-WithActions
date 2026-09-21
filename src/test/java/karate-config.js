function fn() {
  var env = karate.env;
  if (!env) {
    env = 'dev';
  }

  var config = {
    env: env,
    baseUrl: 'https://app.mockbank.io',
    uiUrl: 'https://app.mockbank.io/login',
    userEmail: karate.properties['user.email'] || 'admin@mockbank.io',
    userPassword: karate.properties['user.password'] || 'password123'
  };

  var driverConfig = {
    type: 'chrome',
    showDriverLog: true,
    startTimeout: 30000,
    attachTimeout: 30000,
    headless: true,
    windowSize: '1920,1080',
    addOptions: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-extensions',
      '--remote-allow-origins=*'
    ]
  };

  var chromeExecutable = karate.properties['chrome.executable'];
  if (chromeExecutable) {
    driverConfig.executable = chromeExecutable;
  } else {
    var osName = java.lang.System.getProperty('os.name').toLowerCase();
    if (osName.contains('mac')) {
      driverConfig.executable = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }
  }

  karate.configure('driver', driverConfig);

  return config;
}