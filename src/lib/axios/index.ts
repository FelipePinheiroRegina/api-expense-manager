import axios from 'axios'
import { env } from '@/env'

export const apiGithub = axios.create({
  baseURL: env.GITHUB_API_URL,
})
