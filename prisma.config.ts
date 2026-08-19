import "dotenv/config";
import { defineConfig } from '@prisma/config'

export default defineConfig({
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
})
