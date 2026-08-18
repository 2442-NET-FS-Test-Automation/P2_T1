//Login testing
/// <reference types="cypress" />

describe('login', () => {

    //Antes del login queremos estar en el lugar indicado
    beforeEach(() => {
        cy.visit("http://localhost:5173/login");
    });

    it("Log in con credenciales validas para rol user", () => {
        //Log in
        cy.get("input[placeholder='you@email.com']").type("user@test.com"); //Poner correo
        cy.get("input[placeholder='••••••••']").type("1234"); //Poner contraseña
        cy.contains("button", "Log In ⚔️").click(); //Click en el boton de login, contains por el texto que contiene el boton

        cy.url().should("include", "/home-user");

        //Checar que el token se guarde
        cy.window().then((win) => {
            const token = win.localStorage.getItem("gym.token");

            expect(token).to.not.be.null;
            expect(token).to.not.be.empty;
        });

        //Ir a nav bar
        cy.get('[title="Profile Menu"]').click(); //Click en el boton de login, por el titulo del boton

        //Checar que solo tenga acceso al panel de usuario no al de trainer o admin
        cy.contains("Trainer Panel").should("not.exist"); //No ve el panel de trainer
        cy.contains("Admin Panel").should("not.exist"); //No ve el panel de admin

        //Log out
        cy.contains("button", "Log Out").click();

        //Confirmar Log out
        cy.url().should("include", "/login");
        cy.contains("h2", "Log in to your account").click();
        // Verificar que el token fue eliminado
        cy.window().then((win) => {
            const token = win.localStorage.getItem("gym.token");
            expect(token).to.be.null;
        });

    })

    it("Log in con credenciales validas para rol trainer", () => {
        //Log in
        cy.get("input[placeholder='you@email.com']").type("trainer@test.com"); //Poner correo
        cy.get("input[placeholder='••••••••']").type("1234"); //Poner contraseña
        cy.contains("button", "Log In ⚔️").click(); //Click en el boton de login, contains por el texto que contiene el boton

        //Checar por medio de la url que estamos en la landing page tras un login exitoso
        cy.url().should("include", "/home-user");

        //Checar que se guarde el token
        cy.window().then((win) => {
            const token = win.localStorage.getItem("gym.token");

            expect(token).to.not.be.null;
            expect(token).to.not.be.empty;
        });

        //Ir a nav bar
        cy.get('[title="Profile Menu"]').click(); //Click en el boton de login, por el titulo del boton

        //Checar que solo tenga acceso al panel de trainer no al de  admin
        cy.contains("Trainer Panel").should("exist"); //No ve el panel de trainer
        cy.contains("Admin Panel").should("not.exist"); //No ve el panel de admin

        //Log out
        cy.contains("button", "Log Out").click();

        //Confirmar Log out
        cy.url().should("include", "/login");
        cy.contains("h2", "Log in to your account").click();
        // Verificar que el token fue eliminado
        cy.window().then((win) => {
            const token = win.localStorage.getItem("gym.token");
            expect(token).to.be.null;
        });

    })

    it("Log in con credenciales validas para rol admin", () => {
        //Log in
        cy.login("admin@test.com", "1234")
       
        cy.visit("/home-user")
        //Checar que el token se guarde
        cy.window().then((win) => {
            const token = win.localStorage.getItem("gym.token");

            expect(token).to.not.be.null;
            expect(token).to.not.be.empty;
        });
        
        //Ir a nav bar
        cy.get('[title="Profile Menu"]').click(); //Click en el boton de login, por el titulo del boton

        //Checar que solo tenga acceso al panel de usuario no al de trainer o admin
        cy.contains("Trainer Panel").should("not.exist"); //No ve el panel de trainer
        cy.contains("Admin Panel").should("exist"); //No ve el panel de admin

        //Log out
        cy.contains("button", "Log Out").click();

        //Confirmar Log out
        cy.url().should("include", "/login");
        cy.contains("h2", "Log in to your account").click();

        // Verificar que el token fue eliminado
        cy.window().then((win) => {
            const token = win.localStorage.getItem("gym.token");
            expect(token).to.be.null;
        });

    })

    it("Log in con credenciales invalidas", () => {
        //Intentar log in
        cy.get("input[placeholder='you@email.com']").type("user@test.com"); //Poner correo
        cy.get("input[placeholder='••••••••']").type("bad-password"); //Poner contraseña
        cy.contains("button", "Log In ⚔️").click(); //Click en el boton de login, contains por el texto que contiene el boton

        cy.contains("Invalid username or password");
        cy.url().should("include", "/login");
        // Verificar que el token no fue registrado
        cy.window().then((win) => {
            const token = win.localStorage.getItem("gym.token");
            expect(token).to.be.null;
        });

    })
})