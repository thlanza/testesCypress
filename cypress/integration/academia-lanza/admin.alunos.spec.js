/// <reference types="cypress" />

const admin_front = Cypress.env('admin_front');
const api = Cypress.env('api');
    
describe('Deveria testar a parte de alunos do módulo admin da Academia Lanza', function() {
    
    beforeEach(function() {
        cy.visit(admin_front);

        cy.get('.mt-16 > .font-bold').click(); 
        cy.primeiroLogin();
        
        cy.fixture('adminLogar').as('admin').then(() => {   
            let id;
            let token;  
            cy.registrar(this.admin);
            cy.wait(1000);
            cy.get('.mt-16 > [stroke="currentColor"]').click();
            cy.wait(1000);
            cy.wait('@registrarRequest').then((interception) => {
                id = interception.response.body.usuario._id;
                token = interception.response.body.token;
                cy.wrap(id).as('id');
                cy.wrap(token).as('token');

                cy.wait(1000);
                cy.get('[type="email"]').type(this.admin.email);
                cy.get('[type="password"]').type(this.admin.senha);;
                cy.get('[type="submit"]').click();
                cy.wait(1000);           
            });
        });
    });

    afterEach(() => {
        cy.get('@token').then(token => {
            cy.get('@id').then(id => {
                cy.request({
                    url: `${api}/api/admin/administrador/${id}`,
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                }).its('status').should('be.equal', 204);
            })                                       
        });
    });
    it('Deveria fazer o seed dos alunos e os alunos estarem disponíveis na página', function() {
        cy.get('.alunos').click(); 
        cy.get('.numero').should('contain', '0'); 

        //Fazendo o seed das modalidades e alunos
        cy.request({
            url: `${api}/api/modalidades/seed`,
            method: 'POST',
        }).its('status').should('be.equal', 201);
    
        cy.request({
            url: `${api}/api/alunos/seedAlunos`,
            method: 'POST',
        }).its('status').should('be.equal', 201);

        cy.reload();

        //número na página indica o número correto de registros
        cy.get('.numero').should('contain', '50');
        
        //paginação aponta que há registros
        cy.get(':nth-child(8) > [role="button"]').contains('7');

        //deletar coleção de modalidades e alunos para que o teste seja repetível
        cy.request({
            url: `${api}/api/modalidades/deletarColecaoModalidades`,
            method: 'DELETE',
        }).its('status').should('be.equal', 204);
    
        cy.request({
            url: `${api}/api/alunos/deletarColecaoAlunos`,
            method: 'DELETE',
        }).its('status').should('be.equal', 204);

    });

});