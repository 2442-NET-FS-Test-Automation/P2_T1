//Runs testing support - runs before every componenet spec

import "./commands";
import "@cypress/code-coverage/support";

import {mount} from "cypress/react";

//We need the react app real stylesheet
import "../../src/css/App.css";
import "../../src/css/index.css";

Cypress.Commands.add("mount", mount);
