const api = Cypress.env('api');

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
            url: `${api}/api/admin/registrar`,
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
            url: `${api}/api/alunos/matricular`,
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
            url: `${api}/api/alunos/cancelarInscricao`,
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
