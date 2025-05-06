import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
  SERVER_PORT: z.coerce.number().default(3000),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_API_URL: z.string().url(),
  JWT_SECRET: z.string(),
  API_CLOUD_NAME: z.string(),
  API_CLOUD_KEY: z.string(),
  API_CLOUD_SECRET: z.string(),
  FRONTEND_URL: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success !== true) {
  console.log('Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
