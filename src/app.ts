import fastify from 'fastify'
import { AppRoutes } from './routes/index'
import { errorHandler } from './middlewares/error-handler'
import { githubOauthPlugin } from './plugins/github-oauth'
import cookie from '@fastify/cookie'
import { env } from './env'
import {
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider,
  jsonSchemaTransform,
} from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastifyMultipart } from '@fastify/multipart'

export const app = fastify().withTypeProvider<ZodTypeProvider>()
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'API EXPENSE MANAGER',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(cookie, {
  secret: env.SECRET_KEY_COOKIE,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fastifyMultipart)
app.register(githubOauthPlugin)
app.register(AppRoutes)
app.setErrorHandler(errorHandler)
