/// <reference types="cypress" />

describe('Given an user on the homepage.', () => {
  beforeEach(() => {
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

    cy.intercept('POST', '/api/auth/register', {
      body: { message: 'User registered successfully!' },
    });

    cy.visit('/');
  });

  describe('When he clicks on Register,', () => {
    beforeEach(() => {
      cy.get('span').contains('Register').click();
    });

    it('Then he should navigates to the Register page.', () => {
      cy.url().should('include', '/register');
    });

    describe('When the user register,', () => {
      it('Then he should navigates to the Login page.', () => {
        cy.get('input[formControlName=email]').type('yoga@studio.com');
        cy.get('input[formControlName=firstName]').type('Yoga');
        cy.get('input[formControlName=lastName]').type('Studio');
        cy.get('input[formControlName=password]').type(
          `${'test!1234'}{enter}{enter}`
        );

        cy.url().should('include', '/login');
      });
    });
  });

  describe('When he clicks on Login,', () => {
    beforeEach(() => {
      cy.get('span').contains('Login').click();
    });

    it('Then he should navigates to the login page.', () => {
      cy.url().should('include', '/login');
    });

    describe('When the user logs in,', () => {
      beforeEach(() => {
        cy.get('input[formControlName=email]').type('yoga@studio.com');
        cy.get('input[formControlName=password]').type(
          `${'test!1234'}{enter}{enter}`
        );
      });

      it('Then he should navigates to the sessions page.', () => {
        cy.url().should('include', '/sessions');
      });

      describe('When the user clicks on Logout', () => {
        it('Then he should navigates to the homepage.', () => {
          cy.get('span').contains('Logout').click();
          cy.location('pathname').should('eq', '/');
        });
      });
    });
  });
});
