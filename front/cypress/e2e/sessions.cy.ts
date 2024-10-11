/// <reference types="cypress" />

describe('Given a logged user on the sessions page,', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/session', [
      {
        id: 1,
        name: 'Session de découverte',
        date: '2024-09-12T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'Portes ouvertes toute la journée.',
        users: [],
        createdAt: '2024-09-25T13:26:04',
        updatedAt: '2024-09-25T13:26:04',
      },
    ]).as('session');

    cy.intercept('GET', '/api/session/1', {
      id: 1,
      name: 'Session de découverte',
      date: '2024-09-12T00:00:00.000+00:00',
      teacher_id: 1,
      description: 'Portes ouvertes toute la journée.',
      users: [],
      createdAt: '2024-09-25T13:26:04',
      updatedAt: '2024-09-25T13:26:04',
    });

    cy.intercept('POST', '/api/session', [
      {
        id: 2,
        name: 'Stage postnatal',
        date: '2024-10-10T00:00:00.000+00:00',
        teacher_id: 1,
        description: 'Basé sur des postures douces.',
        users: [],
        createdAt: '2024-10-05T07:46:25.3914004',
        updatedAt: '2024-10-05T07:46:25.4262755',
      },
    ]).as('session');

    cy.intercept('PUT', '/api/session/1', {
      id: 1,
      name: 'Session de redécouverte',
      date: '2024-09-12T00:00:00.000+00:00',
      teacher_id: 1,
      description: "Portes ouvertes l'après-midi.",
      users: [],
      createdAt: '2024-09-25T13:26:04',
      updatedAt: '2024-09-25T13:26:04',
    });

    cy.intercept('GET', '/api/teacher', [
      {
        id: 1,
        lastName: 'DELAHAYE',
        firstName: 'Margot',
        createdAt: '2024-09-20T13:54:26',
        updatedAt: '2024-09-20T13:54:26',
      },
      {
        id: 2,
        lastName: 'THIERCELIN',
        firstName: 'Hélène',
        createdAt: '2024-09-20T13:54:26',
        updatedAt: '2024-09-20T13:54:26',
      },
    ]);

    cy.intercept('GET', '/api/teacher/1', {
      id: 1,
      lastName: 'DELAHAYE',
      firstName: 'Margot',
      createdAt: '2024-09-20T13:54:26',
      updatedAt: '2024-09-20T13:54:26',
    });
  });

  describe("When the user isn't admin,", () => {
    beforeEach(() => {
      cy.intercept('POST', '/api/auth/login', {
        body: {
          id: 1,
          username: 'userName',
          firstName: 'firstName',
          lastName: 'lastName',
          admin: false,
        },
      });

      cy.visit('/login');

      cy.get('input[formControlName=email]').type('yoga@studio.com');
      cy.get('input[formControlName=password]').type(
        `${'test!1234'}{enter}{enter}`
      );
    });

    it('Then he should be able to browse the available sessions.', () => {
      cy.contains('Session de découverte').should('be.visible');
    });

    describe("When he clicks on a session 'Detail' button,", () => {
      it('Then he should be able to see details about one session.', () => {
        cy.get('span').contains('Detail').click();
        cy.contains('Create at:').should('be.visible');
      });

      describe("When he clicks on a session 'Participate' button,", () => {
        it('Then he should be able to participate to one session.', () => {
          cy.intercept('POST', '/api/session/1/participate/1', {});
          cy.intercept('GET', '/api/session/1', {
            id: 1,
            name: 'Session de découverte',
            date: '2024-09-12T00:00:00.000+00:00',
            teacher_id: 1,
            description: 'Portes ouvertes toute la journée.',
            users: [],
            createdAt: '2024-09-25T13:26:04',
            updatedAt: '2024-09-25T13:26:04',
          });

          cy.get('span').contains('Detail').click();

          cy.intercept('GET', '/api/session/1', {
            id: 1,
            name: 'Session de découverte',
            date: '2024-09-12T00:00:00.000+00:00',
            teacher_id: 1,
            description: 'Portes ouvertes toute la journée.',
            users: [1],
            createdAt: '2024-09-25T13:26:04',
            updatedAt: '2024-09-25T13:26:04',
          });

          cy.get('span').contains('Participate').click();
          cy.contains('1 attendees').should('be.visible');
        });
      });

      describe("When he clicks on a session 'Do not participate' button,", () => {
        it('Then he should be able to unparticipate from one session.', () => {
          cy.intercept('POST', '/api/session/1/participate/1', {});
          cy.intercept('DELETE', '/api/session/1/participate/1', {});

          cy.intercept('GET', '/api/session/1', {
            id: 1,
            name: 'Session de découverte',
            date: '2024-09-12T00:00:00.000+00:00',
            teacher_id: 1,
            description: 'Portes ouvertes toute la journée.',
            users: [],
            createdAt: '2024-09-25T13:26:04',
            updatedAt: '2024-09-25T13:26:04',
          });

          cy.get('span').contains('Detail').click();

          cy.intercept('GET', '/api/session/1', {
            id: 1,
            name: 'Session de découverte',
            date: '2024-09-12T00:00:00.000+00:00',
            teacher_id: 1,
            description: 'Portes ouvertes toute la journée.',
            users: [1],
            createdAt: '2024-09-25T13:26:04',
            updatedAt: '2024-09-25T13:26:04',
          });

          cy.get('span').contains('Participate').click();
          cy.contains('1 attendees').should('be.visible');

          cy.intercept('GET', '/api/session/1', {
            id: 1,
            name: 'Session de découverte',
            date: '2024-09-12T00:00:00.000+00:00',
            teacher_id: 1,
            description: 'Portes ouvertes toute la journée.',
            users: [],
            createdAt: '2024-09-25T13:26:04',
            updatedAt: '2024-09-25T13:26:04',
          });

          cy.get('span').contains('Do not participate').click();
          cy.contains('0 attendees').should('be.visible');
        });
      });
    });
  });

  describe('When the user is admin,', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api/auth/login', {
        body: {
          id: 1,
          username: 'userName',
          firstName: 'firstName',
          lastName: 'lastName',
          admin: true,
        },
      });

      cy.visit('/login');

      cy.get('input[formControlName=email]').type('yoga@studio.com');
      cy.get('input[formControlName=password]').type(
        `${'test!1234'}{enter}{enter}`
      );
    });

    it('Then he should be able to browse the available sessions.', () => {
      cy.contains('Session de découverte').should('be.visible');
    });

    describe("When he clicks the 'Create' button,", () => {
      it('Then he should be able to create a new session.', () => {
        cy.intercept('GET', '/api/session', [
          {
            id: 1,
            name: 'Session de découverte',
            date: '2024-09-12T00:00:00.000+00:00',
            teacher_id: 1,
            description: 'Portes ouvertes toute la journée.',
            users: [],
            createdAt: '2024-09-25T13:26:04',
            updatedAt: '2024-09-25T13:26:04',
          },
          {
            id: 2,
            name: 'Stage postnatal',
            date: '2024-10-10T00:00:00.000+00:00',
            teacher_id: 1,
            description: 'Basé sur des postures douces.',
            users: [],
            createdAt: '2024-10-05T07:46:25.3914004',
            updatedAt: '2024-10-05T07:46:25.4262755',
          },
        ]).as('session');

        cy.get('span').contains('Create').click();
        cy.get('input[formControlName=name]').type('Stage postnatal');
        const today = new Date().toISOString().split('T')[0];
        cy.get('input[formControlName=date]').type(today);
        cy.get('mat-select[formControlName=teacher_id]').click();
        cy.get('mat-option').first().click();
        cy.get('textarea[formControlName=description]').type(
          'Basé sur des postures douces.'
        );
        cy.get('span').contains('Save').click();

        cy.contains('Stage postnatal').should('be.visible');
      });
    });

    describe("When he clicks the 'Edit' button,", () => {
      it('Then he should be able to edit a session.', () => {
        cy.intercept('GET', '/api/session', [
          {
            id: 1,
            name: 'Session de redécouverte',
            date: '2024-09-12T00:00:00.000+00:00',
            teacher_id: 1,
            description: "Portes ouvertes l'après-midi.",
            users: [],
            createdAt: '2024-09-25T13:26:04',
            updatedAt: '2024-09-25T13:26:04',
          },
          {
            id: 2,
            name: 'Stage postnatal',
            date: '2024-10-10T00:00:00.000+00:00',
            teacher_id: 1,
            description: 'Basé sur des postures douces.',
            users: [],
            createdAt: '2024-10-05T07:46:25.3914004',
            updatedAt: '2024-10-05T07:46:25.4262755',
          },
        ]).as('session');

        cy.get('span').contains('Edit').click();
        cy.get('input[formControlName=name]').type(' updated');
        const today = new Date().toISOString().split('T')[0];
        cy.get('input[formControlName=date]').type(today);
        cy.get('mat-select[formControlName=teacher_id]').click();
        cy.get('mat-option').first().click();
        cy.get('textarea[formControlName=description]').type(' updated.');
        cy.get('span').contains('Save').click();

        cy.contains('Session de redécouverte').should('be.visible');
      });
    });

    describe("When he clicks on a session 'Detail' button,", () => {
      it('Then he should be able to see details about one session.', () => {
        cy.get('span').contains('Detail').click();
        cy.contains('Create at:').should('be.visible');
      });

      it('Then he should be able to delete a session.', () => {
        cy.intercept('DELETE', '/api/session/1', {});
        cy.intercept('GET', '/api/session', [
          {
            id: 2,
            name: 'Stage postnatal',
            date: '2024-10-10T00:00:00.000+00:00',
            teacher_id: 1,
            description: 'Basé sur des postures douces.',
            users: [],
            createdAt: '2024-10-05T07:46:25.3914004',
            updatedAt: '2024-10-05T07:46:25.4262755',
          },
        ]).as('session');

        cy.get('span').contains('Detail').click();
        cy.get('span').contains('Delete').click();
        cy.contains('Session de découverte').should('not.exist');
      });
    });
  });
});
