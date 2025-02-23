import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
  SERVER_PORT: z.coerce.number().default(3000),
  CLIENT_ID: z.string(),
  CLIENT_SECRET: z.string(),
  SECRET_KEY_COOKIE: z.string(),
  API_CLOUD_NAME: z.string(),
  API_CLOUD_KEY: z.string(),
  API_CLOUD_SECRET: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success !== true) {
  console.log('Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
