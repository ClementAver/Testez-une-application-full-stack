/// <reference types="cypress" />

describe('Given a logged user on the homepage,', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', (req) => {
      if (req.body.email === 'yoga@studio.com') {
        req.reply({
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
      } else if (req.body.email === 'john-doe@mail.me') {
        req.reply({
          body: {
            token: 'mu17ip456',
            type: 'Bearer',
            id: 2,
            username: 'john-doe@mail.me',
            firstName: 'John',
            lastName: 'Doe',
            admin: false,
          },
        });
      }
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
    ).as('getAdmin');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/user/2',
      },
      {
        id: 2,
        username: 'john-doe@mail.me',
        firstName: 'John',
        lastName: 'Doe',
        admin: false,
        email: 'john-doe@mail.me',
      }
    ).as('getUser');
  });

  describe('When he clicks on Account,', () => {
    it('Then he should be able to see his informations.', () => {
      cy.visit('/login');

      cy.get('input[formControlName=email]').type('yoga@studio.com');
      cy.get('input[formControlName=password]').type(
        `${'test!1234'}{enter}{enter}`
      );

      cy.get('span').contains('Account').click();

      cy.wait('@getAdmin').then(() => {
        cy.contains('Name: firstName LASTNAME').should('be.visible');
        cy.contains('Email: yoga@studio.com').should('be.visible');
        cy.contains('You are admin').should('be.visible');
      });
    });

    describe('When he presses the "previous" button', () => {
      it('Then he should navigate to the previous page.', () => {
        cy.visit('/login');
        cy.get('input[formControlName=email]').type('yoga@studio.com');
        cy.get('input[formControlName=password]').type(
          `${'test!1234'}{enter}{enter}`
        );

        cy.get('span').contains('Account').click();
        cy.wait('@getAdmin');

        cy.go('back');
        cy.url().should('include', '/sessions');
      });
    });

    describe('Given he is not admin,', () => {
      describe('When he clicks on "Delete account"', () => {
        it('Then he should be able to delete his account.', () => {
          cy.visit('/login');

          cy.get('input[formControlName=email]').type('john-doe@mail.me');
          cy.get('input[formControlName=password]').type(
            `${'test!1234'}{enter}{enter}`
          );

          cy.get('span').contains('Account').click();

          cy.wait('@getUser').then(() => {
            cy.contains('Name: John DOE').should('be.visible');
            cy.contains('Email: john-doe@mail.me').should('be.visible');
            cy.contains('You are admin').should('not.exist');

            cy.intercept('DELETE', '/api/user/2', {}).as('deleteUser');

            cy.get('button').contains('Detail').click();

            cy.wait('@deleteUser').then(() => {
              cy.contains('Your account has been deleted !').should(
                'be.visible'
              );
              cy.url().should('eq', (Cypress.config().baseUrl + '/'));
            });
          });
        });
      });
    });
  });
});
