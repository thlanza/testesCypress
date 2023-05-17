/// <reference types="cypress" />

    
describe('Deveria testar a parte de modalidades do módulo admin da Academia Lanza', function() {
    
    beforeEach(function() {
        cy.visit('http://localhost:3000');

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
                    url: `http://localhost:5000/api/admin/administrador/${id}`,
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                }).its('status').should('be.equal', 204);
            })                                       
        });
    });

    it('Deveria adicionar uma modalidade e depois deletá-la', function() {  
        cy.get('.modalidades').click();
        cy.get('.criar-nova').click();
        cy.wait(1500);
        cy.get('.nome-modalidade').type('Nova Modalidade');
        cy.get('.horario').type('09:30');
        cy.get('#react-select-2-input').type("Segunda{enter}");
        cy.get('#react-select-2-input').type("Quarta{enter}");
        cy.get('[type="submit"]').click();
        cy.get('.nome-modalidade').should('contain', 'Nova Modalidade');
        cy.get('[id="deletar"]').click();
        cy.wait(500);
        cy.get('.sem-modalidades').should('contain', 'Sem modalidades no momento!')
    });

    it('Deveria editar uma modalidade', function() {  
        cy.get('.modalidades').click();
        cy.get('.criar-nova').click();
        cy.wait(1500);
        cy.get('.nome-modalidade').type('Nova Modalidade');
        cy.get('.horario').type('09:30');
        cy.get('#react-select-2-input').type("Segunda{enter}");
        cy.get('#react-select-2-input').type("Quarta{enter}");
        cy.get('[type="submit"]').click();
        // cy.get('[id="deletar"]').click();
        cy.get('[id="editar"]').click();
        cy.get('.nome-modalidade').type('{selectall}{backspace}');
        cy.get('.nome-modalidade').type('Modalidade Editada');
        cy.get('.horario').type('10:30');
        cy.get('#react-select-3-input').type("Segunda{enter}");
        cy.get('#react-select-3-input').type("Quarta{enter}");
        cy.get('.nome-modalidade').should('contain', 'Modalidade Editada');
        cy.get('[id="deletar"]').click();
    });

});