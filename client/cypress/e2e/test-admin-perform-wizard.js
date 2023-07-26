describe('wizard', () => {
  it('should allow the user to perform the setup wizard', () => {
    cy.visit('/#/wizard');

    cy.screenshot('screenshots/wizard/1');

    cy.get(".ButtonNext").eq(0).click();

    cy.screenshot('screenshots/wizard/2')

    cy.get('[data-ng-model="wizard.node_name"]').type("GLOBALEAKS");

    cy.get(".ButtonNext").eq(1).click();

    cy.screenshot('screenshots/wizard/3');

    cy.get('[data-ng-model="wizard.admin_username"]').type("admin");
    cy.get('[data-ng-model="wizard.admin_name"]').type("Admin");
    cy.get('[data-ng-model="wizard.admin_mail_address"]').type("globaleaks-admin@mailinator.com");
    cy.get('[data-ng-model="wizard.admin_password"]').type("vars.user_passwordA123!@");
    cy.get('[data-ng-model="admin_check_password"]').type("vars.user_passwordA123!@");

    cy.get(".ButtonNext").eq(3).click();

    cy.screenshot('screenshots/wizard/4');

    cy.get('[data-ng-model="wizard.skip_recipient_account_creation"]').click();

    cy.get(".ButtonNext").eq(4).click();

    cy.get(".tos-agreement-input").click();

    cy.screenshot('screenshots/wizard/5');

    cy.get(".ButtonNext").eq(5).click();

    cy.screenshot('screenshots/wizard/6');

    cy.contains('button', 'Proceed').click();
  });
});
