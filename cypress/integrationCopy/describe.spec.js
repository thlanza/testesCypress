/// <reference types="cypress" />

it('A external test...', () => {

});

describe('Should group tests', () => {

    describe('Should group more specific tests', () => {
        it('A specific test...', () => {

        });
        
    });

    it.skip('A internal test...', () => {

    });
    
});