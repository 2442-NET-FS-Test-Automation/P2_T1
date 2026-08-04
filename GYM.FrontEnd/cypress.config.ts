import { defineConfig } from "cypress";
import registerCodeCoverage from "@cypress/code-coverage/task";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", //Url de REACT -> FrontEnd
    supportFile: "cypress/support/e2e.ts", //Codigo disponible para todas las pruebas/tests
    setupNodeEvents(on, config) {
      on("task", {
        log(message){
          console.log(`[spec] ${message}`);
          return null;
        }
      })
      registerCodeCoverage(on, config);

      return config;
    },
  },
  component:{
    devServer:{
      framework: "react",
      bundler: "vite",
    }
  }
});
