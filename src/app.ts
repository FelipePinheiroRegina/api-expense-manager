import fastify from 'fastify'
import { AppRoutes } from './routes/index'
import { errorHandler } from './middlewares/error-handler'
import { githubOauthPlugin } from './plugins/github-oauth'
import cookie from '@fastify/cookie'
import { env } from './env'

export const app = fastify()
app.register(cookie, {
  secret: env.SECRET_KEY_COOKIE,
})
githubOauthPlugin(app)
app.register(AppRoutes)
app.setErrorHandler(errorHandler)
