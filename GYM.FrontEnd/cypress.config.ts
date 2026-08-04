import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", //Url de REACT -> FrontEnd
    supportFile: "cypress/support/e2e.ts" //Codigo disponible para todas las pruebas/tests
  },
  component:{
    devServer:{
      framework: "react",
      bundler: "vite",
    }
  }
});
