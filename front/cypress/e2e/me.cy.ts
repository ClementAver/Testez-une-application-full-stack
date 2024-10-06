/// <reference types="cypress" />

describe('Given a logged user on the homepage,', () => {
  describe('When he clicks on Account,', () => {
    it('Then he should be able to see his informations.', () => {
      cy.intercept('POST', '/api/auth/login', {
        body: {
          token: 'mu17ip455',
          type: 'Bearer',
          id: 1,
          username: 'yoga@studio.com',
          firstName: 'Admin',
          lastName: 'Admin',
          admin: true,
        },
      });

      cy.intercept(
        {
          method: 'GET',
          url: '/api/session',
        },
        []
      ).as('session');

      cy.intercept(
        {
          method: 'GET',
          url: '/api/user/1',
        },
        {
          id: 1,
          username: 'userName',
          firstName: 'firstName',
          lastName: 'lastName',
          admin: true,
          email: 'yoga@studio.com',
        }
      ).as('getUser');

      cy.visit('/login');

      cy.get('input[formControlName=email]').type('yoga@studio.com');
      cy.get('input[formControlName=password]').type(
        `${'test!1234'}{enter}{enter}`
      );

      cy.get('span').contains('Account').click();

      cy.wait('@getUser').then(() => {
        cy.contains('Name: firstName LASTNAME').should('be.visible');
        cy.contains('Email: yoga@studio.com').should('be.visible');
        cy.contains('You are admin').should('be.visible');
      });
    });
  });
});
