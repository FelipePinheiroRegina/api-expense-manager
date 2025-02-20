import { env } from './env'
import { app } from './app'

app
  .listen({
    host: '0.0.0.0',
    port: env.SERVER_PORT,
  })
  .then(() => console.log('Server running 🔥🔥🔥', env.SERVER_PORT))
