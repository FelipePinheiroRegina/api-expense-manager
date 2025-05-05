import fastify from 'fastify'
import { fastifyCookie } from '@fastify/cookie'
import { fastifyJwt } from '@fastify/jwt'

import { AppRoutes } from '@/http/routes'
import { githubOauthPlugin } from './plugins/github-oauth'

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

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

app.register(githubOauthPlugin)
app.register(AppRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error.code === 'FST_ERR_VALIDATION') {
    return reply.status(400).send({
      message: 'Validation error.',
      issues: error?.validation ? error.validation[0].message : '',
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to an external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
