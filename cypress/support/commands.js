// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import loc from './locators';

Cypress.Commands.add('clickAlert', (locator, message) => {
    cy.get(locator).click();
    cy.on('window:alert', msg => {
        expect(msg).to.be.equal(message)
    });
});

Cypress.Commands.add('registrar', (admin, requisicaoNula = false) => {
    cy.get('[placeholder="Coloque aqui seu primeiro nome"]')
    .type(admin.primeiroNome);
    cy.get('[placeholder="Coloque aqui seu sobrenome"]')
        .type(admin.sobrenome);   
    cy.get('[type="password"]')  
        .type(admin.senha);       
    cy.get('[placeholder="Coloque aqui seu email"]')  
        .type(admin.email);   
    if(requisicaoNula !== true) { 
    cy.intercept({
            method: 'POST',
            url: 'http://localhost:5000/api/admin/registrar',
        }).as('registrarRequest');
    }

    cy.get('input[type=file]').selectFile('./cypress/fixtures/foto.jpg');  


    cy.get('[type="submit"]').click(); 
});


Cypress.Commands.add('registrarAluno', (aluno) => {
    cy.get('[placeholder="Coloque aqui seu primeiro nome"]')
    .type(aluno.primeiroNome);
    cy.get('[placeholder="Coloque aqui seu sobrenome"]')
        .type(aluno.sobrenome);   
    cy.get('[type="password"]')  
        .type(aluno.senha);       
    cy.get('[placeholder="Coloque aqui seu email"]')  
        .type(aluno.email);  
        
    cy.intercept({
            method: 'POST',
            url: 'http://localhost:5000/api/alunos/matricular',
        }).as('matricularAlunoRequest');
        
    cy.get('#react-select-2-input').type(`${aluno.modalidade}{enter}`);
    cy.get('input[type=file]').selectFile('./cypress/fixtures/aluno.jpg');  
    cy.get('[type="submit"]').click(); 
});

Cypress.Commands.add('matricular', function(nao_deletar = false) {
    let token;
    cy.get('[href="/login"] > .mr-16').click();
    cy.wait(2000);
    cy.get('.text-gray-300').click();
    cy.wait(2000)

              //Registrar-se
    cy.fixture('alunoRegistrar').as('aluno').then(() => {

    cy.registrarAluno(this.aluno);
    cy.wait('@matricularAlunoRequest').then((interception) => {
        console.log(interception.response.body);
        // id = interception.response.body.usuario._id;
        token = interception.response.body.token;
        cy.wait(3000);
        // cy.get('.text-mygreen').should('contain', 'BEM VINDO À')
        // cy.get('.bem-vindo > .p-3').should('contain', 'BEM-VINDO');
        cy.get('.deslogar').should('exist');
        if(!nao_deletar) {
        cy.request({
            url: `http://localhost:5000/api/alunos/cancelarInscricao`,
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        }).its('status').should('be.equal', 204);
        }
    });
    
});
})

Cypress.Commands.add('primeiroLogin', () => {
    cy.get('.text-center').should('contain', 'Logue com a senha que lhe foi fornecida.');
    //Preencher formulário de primeiro login
    cy.get('[type="email"]').type(Cypress.env('email_admin'));
    cy.get('[type="password"]').type(Cypress.env('senha_admin'));
    cy.get('.mt-5 > .bg-myblue').click();
    cy.get('.text-center').should('contain', 'Preencha seus dados para registrar-se.');
});

Cypress.Commands.add('resetApp', () => {
   cy.get(loc.MENU.SETTINGS).click();
   cy.get(loc.MENU.RESET).click();
});

Cypress.Commands.add('getToken', (user, passwd) => {
    cy.request({
        method: 'POST',
        url: '/signin',
        body: {
            email: user,
            redirecionar: false,
            senha: passwd
        }
    }).its('body.token').should('not.be.empty')
    .then(token => {
        Cypress.env('token', token);
        return token
    });
});

Cypress.Commands.add('resetRest', () => {
    cy.getToken('thlanza@hotmail.com', 'lanza1').then(token => {
        cy.request({
            method: 'GET',
            url: '/reset',
            headers: { Authorization: `JWT ${token}`}
        }).its('status').should('be.equal', 200)
    })
});

Cypress.Commands.add('getContaByName', name => {
    cy.getToken('thlanza@hotmail.com', 'lanza1').then(token => {
        cy.request({
            method: 'GET',
            url: '/contas',
            headers: { Authorization: `JWT ${token}`},
            qs: {
                nome: name
            }
        }).then(res => {
            return res.body[0].id
        })
    });
});

Cypress.Commands.overwrite('request', (originalFn, ...options) => {
    if(options.length === 1) {
        if(Cypress.env('token')) {
            options[0].headers = {
                Authorization: `JWT ${Cypress.env('token')}`
            }
        };
    }

    return originalFn(...options);
});
