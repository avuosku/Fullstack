// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  use: {
    baseURL: 'http://localhost:5173', // Sovelluksen URL
    headless: true, // Ajaa testit taustalla ilman UI:ta
    viewport: { width: 1280, height: 720 },
    actionTimeout: 5000, // Aikakatkaisu toiminnoille
  },
  webServer: {
    command: 'npm run dev', // Sovelluksen käynnistyskomento
    port: 5173, // Varmista, että tämä vastaa frontendin porttia
    timeout: 120 * 1000, // Odota 2 minuuttia palvelimen käynnistymistä
    reuseExistingServer: !process.env.CI,
  },
});
