/// <reference types="cypress" />

const admin_front = Cypress.env('admin');
const api = Cypress.env('api');    

describe('Deveria testar as funcionalidades de autorização do módulo admin da Academia Lanza', () => {
    
        beforeEach(() => {
            cy.visit(admin_front);
    
        });
    
        it('Deveria fazer o primeiro login e registrar-se.', function() {
            //Clicar no botão para ir para a tela de Primeiro Login
            cy.get('.mt-16 > .font-bold').click();
            cy.primeiroLogin();

            let id; 
            let token;

            //Registrar-se
            cy.fixture('adminRegistrar').as('admin').then(() => {
        
                cy.registrar(this.admin);
                cy.wait('@registrarRequest').then((interception) => {
                    console.log(interception.response.body);
                    id = interception.response.body.usuario._id;
                    token = interception.response.body.token;

                    cy.get('.bem-vindo > .p-3').should('contain', 'BEM-VINDO');

                    cy.request({
                        url: `${api}/api/admin/administrador/${id}`,
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                    }).its('status').should('be.equal', 204);
                });

             
            });

           

        });

        it('Não deveria conseguir registrar o mesmo usuário 2 vezes', function() {  
            cy.get('.mt-16 > .font-bold').click(); 
            cy.primeiroLogin();

            cy.fixture('adminRepetido').as('admin').then(() => {   
                let id;
                let token;    
                cy.registrar(this.admin);
                cy.wait('@registrarRequest').then((interception) => {
                    id = interception.response.body.usuario._id;
                    token = interception.response.body.token;

                    cy.wait(7000);
                    cy.get('.mt-16 > [stroke="currentColor"]').click();
                    cy.wait(1000);
                    cy.get('.mt-16 > .font-bold').click(); 
                    cy.primeiroLogin();
                    cy.registrar(this.admin, true);   
                    cy.get('.erroRegistrar').should('contain', 'Admin já existe');   
                    cy.request({
                        url: `${api}/api/admin/administrador/${id}`,
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                    }).its('status').should('be.equal', 204);
                });
            });
        });

        it('Deveria logar com sucesso depois de registrar', function() {  
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

                    cy.wait(1000);
                    cy.get('[type="email"]').type(this.admin.email);
                    cy.get('[type="password"]').type(this.admin.senha);
                    cy.get('[type="submit"]').click(); 
                    cy.wait(1000);
                    cy.get('.bem-vindo > .p-3').should('contain', 'BEM-VINDO');

                    cy.wait(1000);

                    cy.request({
                        url: `${api}/api/admin/administrador/${id}`,
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                    }).its('status').should('be.equal', 204);
                });
            });
           
        });

        
        it('Deveria retornar mensagem de erro quando o login está errado', function() {  
            
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

                    cy.wait(1000);
                    cy.get('[type="email"]').type(this.admin.email);
                    cy.get('[type="password"]').type("senha errada");
                    cy.get('[type="submit"]').click(); 
                    cy.wait(1000);

                    cy.wait(1000);

                    cy.get('.Toastify__toast-body > :nth-child(2)').should('contain', 'Credenciais de login erradas')

                    cy.request({
                        url: `${api}/api/admin/administrador/${id}`,
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` },
                    }).its('status').should('be.equal', 204);
                });
            });
        });
        
});