var receiver = new browser.gl.pages.receiver();
var path = require("path");
var pgp_key_path = path.resolve("../backend/globaleaks/tests/data/gpg/VALID_PGP_KEY1_PUB");

describe("Recipient first login", function() {
  it("should require password change upon successful authentication", async function() {
    await browser.gl.utils.login_receiver("Recipient", browser.gl.utils.vars.init_password, "/#/login", true);
  });

  it("should be able to change password from the default one", async function() {
    await element(by.model("changePasswordArgs.password")).sendKeys(browser.gl.utils.vars.user_password);
    await element(by.model("changePasswordArgs.confirm")).sendKeys(browser.gl.utils.vars.user_password);
    await element(by.css("[data-ng-click=\"changePassword()\"]")).click();
    await browser.gl.utils.waitForUrl("/recipient/home");
    await browser.gl.utils.logout();
  });

  it("should be able to login with the new password", async function() {
    await browser.gl.utils.login_receiver();
  });

  it("should be retrieve the account recovery key", async function() {
    await element(by.id("PreferencesLink")).click();
    await browser.gl.utils.waitForUrl("/recipient/preferences");
    await browser.gl.utils.takeScreenshot("user/preferences.png");
    await element(by.cssContainingText("button", "Account recovery key")).click();
    await element(by.model("secret")).sendKeys(browser.gl.utils.vars.user_password);
    await element(by.cssContainingText("button", "Confirm")).click();
    await browser.gl.utils.takeScreenshot("user/recoverykey.png");
    await element(by.cssContainingText("button", "Close")).click();
    await element(by.model("resources.preferences.two_factor")).click();
    await browser.gl.utils.takeScreenshot("user/2fa.png");
    await element(by.cssContainingText("button", "Close")).click();
  });

  if (browser.params.features.pgp) {
    it("should be able to load his/her public PGP key", async function() {
      await receiver.addPublicKey(pgp_key_path);
      await browser.gl.utils.takeScreenshot("user/pgp.png");
    });
  }

  it("should be able to see the interface for changing the authentication password", async function() {
    await element(by.cssContainingText("a", "Password")).click();
    await browser.gl.utils.takeScreenshot("user/password.png");
    await browser.gl.utils.logout();
  });
});

describe("Recipient2 first login", function() {
  it("should require password change upon successful authentication", async function() {
    await browser.gl.utils.login_receiver("Recipient2", browser.gl.utils.vars.init_password, "/#/login", true);
  });

  it("should be able to change password from the default one", async function() {
    await element(by.model("changePasswordArgs.password")).sendKeys(browser.gl.utils.vars.user_password);
    await element(by.model("changePasswordArgs.confirm")).sendKeys(browser.gl.utils.vars.user_password);
    await element(by.css("[data-ng-click=\"changePassword()\"]")).click();
    await browser.gl.utils.waitForUrl("/recipient/home");
  });

  it("should be able to change again the password setting it to the default one", async function() {
    await element(by.id("PreferencesLink")).click();
    await element(by.cssContainingText("a", "Password")).click();
    await element(by.model("changePasswordArgs.current")).sendKeys(browser.gl.utils.vars.user_password);
    await element(by.model("changePasswordArgs.password")).sendKeys(browser.gl.utils.vars.init_password);
    await element(by.model("changePasswordArgs.confirm")).sendKeys(browser.gl.utils.vars.user_password);
    await element(by.css("[data-ng-click=\"changePassword()\"]")).click();
    await browser.gl.utils.logout();
  });
});

describe("Custodian first login", function() {
  it("should require password change upon successful authentication", async function() {
    await browser.gl.utils.login_custodian("Custodian", browser.gl.utils.vars.init_password, "/#/login", true);
  });

  it("should be able to change password from the default one", async function() {
    await element(by.model("changePasswordArgs.password")).sendKeys(browser.gl.utils.vars.user_password);
    await element(by.model("changePasswordArgs.confirm")).sendKeys(browser.gl.utils.vars.user_password);
    await element(by.css("[data-ng-click=\"changePassword()\"]")).click();
    await browser.gl.utils.waitForUrl("/custodian/home");
    await browser.gl.utils.logout();
  });
});

describe("Admin2 first login", function() {
  it("should require password change upon successful authentication", async function() {
    await browser.gl.utils.login_custodian("Admin2", browser.gl.utils.vars.init_password, "/#/login", true);
  });

  it("should be able to change password from the default one", async function() {
    await element(by.model("changePasswordArgs.password")).sendKeys(browser.gl.utils.vars.user_password);
    await element(by.model("changePasswordArgs.confirm")).sendKeys(browser.gl.utils.vars.user_password);
    await element(by.css("[data-ng-click=\"changePassword()\"]")).click();
    await browser.gl.utils.waitForUrl("/admin/home");
    await browser.gl.utils.logout();
  });
});
