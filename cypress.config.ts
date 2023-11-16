import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return {
        ...config,
        browsers: config.browsers.filter(
          (browser) => browser.name === 'chrome'
        ),
      };
    },
    video: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    baseUrl: 'http://localhost:3000',
    retries: {
      runMode: 1,
    },
  },
});
