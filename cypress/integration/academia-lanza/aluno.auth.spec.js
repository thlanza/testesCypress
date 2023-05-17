/// <reference types="cypress" />
import 'cypress-iframe';

describe('Deveria testar o módulo Aluno do site Academia Lanza', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3001');
        cy.request('POST', 'http://localhost:5000/api/modalidades/seed');
    });
    afterEach(() => {
        cy.request('DELETE', 'http://localhost:5000/api/modalidades/deletarColecaoModalidades');
    });
    it.skip('Deveria matricular', function() {
        cy.matricular();
    });

    it('Deveria matricular, deslogar e logar', function() {
        let token;
        cy.matricular(true)
        cy.get('.deslogar').click();

    cy.fixture('alunoRegistrar').as('aluno').then(() => {
        cy.get('[placeholder="Coloque aqui seu email"]')
        .type(this.aluno.email);
        cy.get('[type="password"]')  
            .type(this.aluno.senha);   
        cy.intercept({ method: 'POST', url: 'http://localhost:5000/api/alunos/logar'}).as('logar');
   
        cy.get('[type="submit"]').click(); 

        cy.wait(2000);

        cy.get('.deslogar').should('exist');

        cy.wait('@logar').then((interception) => {
            console.log("logar body", interception.response.body);
            // id = interception.response.body.usuario._id;
            token = interception.response.body.token;
            cy.wait(3000);
    
            cy.request({
                url: `http://localhost:5000/api/alunos/cancelarInscricao`,
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            }).its('status').should('be.equal', 204);
            
        });

     });

    


      




    })

    

    
});