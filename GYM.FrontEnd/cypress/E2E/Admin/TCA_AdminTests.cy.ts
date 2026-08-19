/// <reference types="cypress" />
import { createTestToken } from "../../support/auth";

describe('TCA05 - Add Exercise UI Flow (REQ-08)', () => {
    const uniqueExerciseName = `Barbell Squat ${Date.now()}`;

    beforeEach(() => {
        // 1. Intercept de Login
        cy.intercept("POST", "**/authentication/login", {
            statusCode: 200,
            body: {
                token: createTestToken("Cypress Admin", "Admin")
            }
        }).as("login");

        // 2. Intercept para la lista de ejercicios inicial
        cy.intercept("GET", "**/api/Training/exercises*", {
            statusCode: 200,
            body: []
        }).as("getExercises");

        // 3. Login e ir a la app
        cy.visit("http://localhost:5173/login");
        cy.get("input[placeholder='you@email.com']").type("admin@test.com");
        cy.get("input[placeholder='••••••••']").type("1234");
        cy.contains("button", "Log In ⚔️").click();
        cy.wait("@login");
    });

    it("Flujo completo: Formulario de adición de ejercicio hasta actualización del catálogo", () => {
        // Intercept de la petición POST que crea el ejercicio
        cy.intercept("POST", "**/api/Training/exercises*", {
            statusCode: 200,
            body: {
                id: 999,
                name: uniqueExerciseName,
                description: "Squat exercise technique",
                visualReferenceUrl: "https://example.com/demo.gif",
                sets: 3,
                reps: 10
            }
        }).as("addExercise");

        // Intercept del GET posterior para reflejar el elemento agregado en la lista
        cy.intercept("GET", "**/api/Training/exercises*", {
            statusCode: 200,
            body: [
                {
                    id: 999,
                    name: uniqueExerciseName,
                    description: "Squat exercise technique",
                    visualReferenceUrl: "https://example.com/demo.gif",
                    sets: 3,
                    reps: 10
                }
            ]
        }).as("getExercisesUpdated");

        // 1. Navegar a la página de ejercicios
        cy.visit("http://localhost:5173/admin/exercises");

        // 2. Clic en el botón para abrir el modal
        cy.contains("Create Exercise").click();

        // 3. Llenar el formulario dentro del modal
        cy.get("input[placeholder*='e.g. Barbell Squat']").type(uniqueExerciseName);
        cy.get("textarea[placeholder*='Describe the proper technique']").type("Proper squat depth and posture.");
        
        // Limpiar valores por defecto si vienen prellenados (3 y 10) y escribir
        cy.get("input[type='number']").eq(0).clear().type("4");
        cy.get("input[type='number']").eq(1).clear().type("12");

        cy.get("input[placeholder*='https://example.com/demo.gif']").type("https://media.giphy.com/example.gif");

        // 4. Hacer clic en el botón de confirmación del modal
        //cy.contains("button", "Create Exercise").click();
        cy.get(".modal").contains("button", "Create Exercise").click();

        // 5. Esperar la llamada del API
        cy.wait("@addExercise");

        // 6. Assert E2E: Confirmar que la UI muestra el nuevo ejercicio en la lista
        cy.contains(uniqueExerciseName).should("be.visible");
    });

    it("TCA10 - Complete UI flow when Admin deletes an exercise item from the interface", () => {
        const exerciseToDelete = "Plank";

        // 1. Intercept de trainings para evitar 401
        cy.intercept("GET", "**/api/Training/trainings*", {
            statusCode: 200,
            body: []
        }).as("getTrainings");

        // 2. Intercept INICIAL de ejercicios (con Plank y Bicep Curls)
        cy.intercept("GET", "**/api/Training/exercises*", {
            statusCode: 200,
            body: [
                {
                    id: 101,
                    name: exerciseToDelete,
                    description: "Hold a straight-body position supported by your forearms...",
                    visualReferenceUrl: "https://example.com/plank.gif",
                    sets: 3,
                    reps: 1
                },
                {
                    id: 102,
                    name: "Dumbbell Bicep Curls",
                    description: "Curl dumbbells upward...",
                    visualReferenceUrl: "https://example.com/biceps.gif",
                    sets: 3,
                    reps: 12
                }
            ]
        }).as("getExercisesWithData");

        // 3. Intercept del DELETE
        cy.intercept("DELETE", "**/api/Training/exercises/*", {
            statusCode: 200,
            body: {}
        }).as("deleteExercise");

        // Navegar a la página de ejercicios
        cy.visit("http://localhost:5173/admin/exercises");

        // Esperar a que cargue la lista inicial
        cy.wait("@getExercisesWithData");

        // Verificar que Plank está en la tabla
        cy.contains("tr", exerciseToDelete).should("be.visible");

        // 4. AHORA SÍ: Redefinimos el GET para cuando React vuelva a pedir la lista tras borrar
        cy.intercept("GET", "**/api/Training/exercises*", {
            statusCode: 200,
            body: [
                {
                    id: 102,
                    name: "Dumbbell Bicep Curls",
                    description: "Curl dumbbells upward...",
                    visualReferenceUrl: "https://example.com/biceps.gif",
                    sets: 3,
                    reps: 12
                }
            ]
        }).as("getExercisesAfterDelete");

        // 5. Hacer clic en la papelera de "Plank"
        cy.contains("tr", exerciseToDelete)
            .find("button")
            .last()
            .click({ force: true });

        // Esperar la petición DELETE de la API
        cy.wait("@deleteExercise");

        // 6. Assert E2E: Confirmar que "Plank" ya no existe en la tabla
        cy.contains("tr", exerciseToDelete).should("not.exist");
    });

    it("TCA15 - Complete UI flow when Admin edits an exercise via the frontend edit form", () => {
        const originalName = "Incline Bench Press";
        const updatedName = "Incline Bench Press (Updated)";

        // 1. Intercept de trainings para evitar 401
        cy.intercept("GET", "**/api/Training/trainings*", {
            statusCode: 200,
            body: []
        }).as("getTrainings");

        // 2. Intercept INICIAL del ejercicio
        cy.intercept("GET", "**/api/Training/exercises*", {
            statusCode: 200,
            body: [
                {
                    id: 201,
                    name: originalName,
                    description: "Original description for incline press",
                    visualReferenceUrl: "https://example.com/incline.gif",
                    sets: 3,
                    reps: 10
                }
            ]
        }).as("getExercisesForEdit");

        // 3. Intercept del PUT para la edición (Sin la / al final para atrapar tanto /exercises como /exercises/201)
        cy.intercept("PUT", "**/api/Training/exercises*", {
            statusCode: 200,
            body: {
                id: 201,
                name: updatedName,
                description: "Updated description with improved form",
                visualReferenceUrl: "https://example.com/incline-updated.gif",
                sets: 4,
                reps: 12
            }
        }).as("editExercise");

        // Navegar a la página de ejercicios
        cy.visit("http://localhost:5173/admin/exercises");

        // Esperar carga inicial
        cy.wait("@getExercisesForEdit");

        // Confirmar que el ejercicio original aparece en la tabla
        cy.contains("tr", originalName).should("be.visible");

        // 4. Redefinir el GET para devolver los datos actualizados tras guardar
        cy.intercept("GET", "**/api/Training/exercises*", {
            statusCode: 200,
            body: [
                {
                    id: 201,
                    name: updatedName,
                    description: "Updated description with improved form",
                    visualReferenceUrl: "https://example.com/incline-updated.gif",
                    sets: 4,
                    reps: 12
                }
            ]
        }).as("getExercisesAfterEdit");

        // 5. Hacer clic en el Lápiz de edición (primer botón)
        cy.contains("tr", originalName)
            .find("button")
            .first()
            .click({ force: true });

        // 6. Llenar modal de edición
        cy.get(".modal").should("be.visible");
        
        cy.get("input[placeholder*='e.g. Barbell Squat']").clear().type(updatedName);
        cy.get("textarea[placeholder*='Describe the proper technique']").clear().type("Updated description with improved form");

        // Usar {selectall} para asegurar que el valor se reemplace limpio
        cy.get("input[type='number']").eq(0).type("{selectall}4");
        cy.get("input[type='number']").eq(1).type("{selectall}12");

        // 7. Clic en "Save Changes"
        cy.get(".modal").contains("button", "Save Changes").click();

        // 8. Esperar la respuesta simulada del PUT
        cy.wait("@editExercise");

        // 9. Assertions E2E:
        cy.contains("tr", updatedName).should("be.visible");
    });

    it.skip("TCA20 - Complete UI flow in the Create Staff User modal from input submission to feedback", () => {
        const newStaffFirstName = `Staff${Date.now().toString().slice(-4)}`;
        const newStaffLastName = "Tester";
        const newStaffEmail = `staff_${Date.now()}@gymquest.com`;

        // 1. Intercept del GET de usuarios con la estructura REAL del backend
        cy.intercept("GET", "**/api/User/all-users*", {
            statusCode: 200,
            body: [
                {
                    id: 1,
                    email: "trainer@test.com",
                    phone: "1313131313",
                    role: "Trainer",
                    name: "Carlos",
                    surname: "1",
                    joinAt: "2026-07-20T00:00:00"
                }
            ]
        }).as("getUsers");

        // 2. Intercept preventivo de trainings por si el sidebar lo solicita
        cy.intercept("GET", "**/api/Training/trainings*", {
            statusCode: 200,
            body: []
        }).as("getTrainings");

        // 3. Intercept del POST para la creación de usuarios
        cy.intercept("POST", "**/api/User*", {
            statusCode: 201,
            body: {
                id: 99,
                email: newStaffEmail,
                phone: "3312345678",
                role: "Trainer",
                name: newStaffFirstName,
                surname: newStaffLastName,
                joinAt: "2026-08-19T00:00:00"
            }
        }).as("addStaffUser");

        // 4. Navegar a la administración de usuarios
        cy.visit("http://localhost:5173/admin/users");
        cy.wait("@getUsers");

        // 5. Redefinir GET para reflejar el nuevo usuario al actualizar la tabla
        cy.intercept("GET", "**/api/User/all-users*", {
            statusCode: 200,
            body: [
                {
                    id: 1,
                    email: "trainer@test.com",
                    phone: "1313131313",
                    role: "Trainer",
                    name: "Carlos",
                    surname: "1",
                    joinAt: "2026-07-20T00:00:00"
                },
                {
                    id: 99,
                    email: newStaffEmail,
                    phone: "3312345678",
                    role: "Trainer",
                    name: newStaffFirstName,
                    surname: newStaffLastName,
                    joinAt: "2026-08-19T00:00:00"
                }
            ]
        }).as("getUsersUpdated");

        // 6. Abrir modal
        cy.contains("button", "Create Staff User").click();
        cy.get(".modal").should("be.visible");

        // 7. Llenar inputs
        cy.get(".modal input[placeholder*='Alex']").type(newStaffFirstName);
        cy.get(".modal input[placeholder*='Turner']").type(newStaffLastName);
        cy.get(".modal input[placeholder*='alex@gymquest.com']").type(newStaffEmail);
        cy.get(".modal input[placeholder*='10 digit number']").type("3312345678");
        cy.get(".modal input[type='password']").type("Password123!");

        // 8. Enviar formulario
        cy.get(".modal").contains("button", "Create Staff Account").click();

        // 9. Esperar petición POST
        cy.wait("@addStaffUser");

        // 10. Assertions E2E
        cy.get(".modal").should("not.exist");
        cy.contains("tr", newStaffEmail).should("be.visible");
    });

    it("TCA25 - Complete UI flow when Admin promotes a user to Trainer role", () => {
        const targetEmail = "user@test.com";

        // 1. Intercept del GET inicial
        cy.intercept("GET", "**/api/User/all-users*", {
            statusCode: 200,
            body: [
                {
                    id: 1,
                    email: targetEmail,
                    phone: "1212121212",
                    role: "User",
                    name: "Stefano",
                    surname: "0",
                    joinAt: "2026-07-20T00:00:00"
                }
            ]
        }).as("getUsersForPromote");

        // 2. Intercept preventivo de trainings
        cy.intercept("GET", "**/api/Training/trainings*", {
            statusCode: 200,
            body: []
        }).as("getTrainings");

        // 3. Intercept EXACTO para la ruta PATCH del cambio de rol (/api/User/{id}/role)
        cy.intercept("PATCH", "**/api/User/*/role", {
            statusCode: 200,
            body: { message: "Role updated successfully" }
        }).as("promoteUserApi");

        // 4. Navegar a la página de usuarios
        cy.visit("http://localhost:5173/admin/users");
        cy.wait("@getUsersForPromote");

        // Validar estado inicial ("User")
        cy.contains("tr", targetEmail).within(() => {
            cy.contains("User").should("be.visible");
        });

        // 5. Redefinir el GET para simular la actualización del rol en la tabla
        cy.intercept("GET", "**/api/User/all-users*", {
            statusCode: 200,
            body: [
                {
                    id: 1,
                    email: targetEmail,
                    phone: "1212121212",
                    role: "Trainer",
                    name: "Stefano",
                    surname: "0",
                    joinAt: "2026-07-20T00:00:00"
                }
            ]
        }).as("getUsersAfterPromote");

        // 6. Ejecutar acción de promover
        cy.contains("tr", targetEmail)
            .contains("button", "Promote")
            .click({ force: true });

        // 7. Confirmar intercept del PATCH
        cy.wait("@promoteUserApi");

        // 8. Assertion final: El badge cambió a Trainer
        cy.contains("tr", targetEmail).within(() => {
            cy.contains("Trainer").should("be.visible");
        });
    });
});