const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: false,
  e2e: {
    baseUrl: "https://127.0.0.1:8443",
    specPattern: [
      "cypress/e2e/test-init.js",
      "cypress/e2e/test-admin-perform-wizard.js",
      "cypress/e2e/test-authentication-redirects.js",
      "cypress/e2e/test-user-password-reset.js",
      "cypress/e2e/test-admin-first-login.js",
      "cypress/e2e/test-admin-configure-advanced.js",
      "cypress/e2e/test-admin-configure-users.js",
      "cypress/e2e/test-users-first-login.js",
      "cypress/e2e/test-admin-assign-key-escrow.js",
      "cypress/e2e/test-admin-configure-languages.js",
      "cypress/e2e/test-admin-configure-files.js",
      "cypress/e2e/test-internationalization.js",
      "cypress/e2e/test-admin-configure-custom-texts.js",
      "cypress/e2e/test-admin-configure-notifications.js",
      "cypress/e2e/test-admin-configure-network.js",
      "cypress/e2e/test-admin-contexts.js",
      "cypress/e2e/test-admin-questionnaires.js",
      "cypress/e2e/test-globaleaks-process.js",
      "cypress/e2e/test-acquire-documentation-screenshots.js",
      "cypress/e2e/test-admin-sites.js",
      "cypress/e2e/test-signup.js"
    ]
  },
});
