const buildEnv = () => {
    cy.server();
    cy.route({
        method: 'POST',
        url: '/signin',
        response: {
            id: 1000,
            nome: 'Usuário falso',
            token: 'Uma string muito grande que não deveria ser aceito mas na verdade, vai'
        }
    }).as('signin')
    cy.route({
        method: 'GET',
        url: '/saldo',
        response: [{
            conta_id: 999,
            conta: "Carteira",
            saldo: "100.00"
        }, 
        {
            conta_id: 9909,
            conta: "Banco",
            saldo: "10000000.00"
        }, 
    ]
    }).as('saldo');

    cy.route({
        method: 'GET',
        url: '/contas',
        response: [
            {id: 1, nome: 'Carteira', visivel: true, usuario_id: 1 },
            {id: 2, nome: 'Banco', visivel: true, usuario_id: 1}
        ]
    }).as('contas');

    cy.route({
        method: 'GET',
        url: '/extrato/**',
        response: [{"conta":"Conta para movimentacoes","id":1469071,"descricao":"Movimentacao para exclusao","envolvido":"AAA","observacao":null,"tipo":"DESP","data_transacao":"2023-01-30T03:00:00.000Z","data_pagamento":"2023-01-30T03:00:00.000Z","valor":"-1500.00","status":true,"conta_id":1571490,"usuario_id":36194,"transferencia_id":null,"parcelamento_id":null},{"conta":"Conta com movimentacao","id":1469072,"descricao":"Movimentacao de conta","envolvido":"BBB","observacao":null,"tipo":"DESP","data_transacao":"2023-01-30T03:00:00.000Z","data_pagamento":"2023-01-30T03:00:00.000Z","valor":"-1500.00","status":true,"conta_id":1571491,"usuario_id":36194,"transferencia_id":null,"parcelamento_id":null},{"conta":"Conta para saldo","id":1469074,"descricao":"Movimentacao 2, calculo saldo","envolvido":"DDD","observacao":null,"tipo":"DESP","data_transacao":"2023-01-30T03:00:00.000Z","data_pagamento":"2023-01-30T03:00:00.000Z","valor":"-1000.00","status":true,"conta_id":1571492,"usuario_id":36194,"transferencia_id":null,"parcelamento_id":null},{"conta":"Conta para saldo","id":1469075,"descricao":"Movimentacao 3, calculo saldo","envolvido":"EEE","observacao":null,"tipo":"REC","data_transacao":"2023-01-30T03:00:00.000Z","data_pagamento":"2023-01-30T03:00:00.000Z","valor":"1534.00","status":true,"conta_id":1571492,"usuario_id":36194,"transferencia_id":null,"parcelamento_id":null},{"conta":"Conta para extrato","id":1469076,"descricao":"Movimentacao para extrato","envolvido":"FFF","observacao":null,"tipo":"DESP","data_transacao":"2023-01-30T03:00:00.000Z","data_pagamento":"2023-01-30T03:00:00.000Z","valor":"-220.00","status":true,"conta_id":1571493,"usuario_id":36194,"transferencia_id":null,"parcelamento_id":null}]
    });

};

export default buildEnv;