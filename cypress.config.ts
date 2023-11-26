import { defineConfig } from 'cypress';
import { clearDatabase } from './src/lib/prisma';
import { main as seedDatabase } from './prisma/seed';

export default defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on('task', {
        async clearDatabase() {
          await clearDatabase();
          return null;
        },
      });
      on('task', {
        async seedDatabase() {
          await seedDatabase();
          return null;
        },
      });
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
