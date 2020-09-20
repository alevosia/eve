import dotenv from 'dotenv'

if (process.env.NODE_ENV === 'development') {
    dotenv.config()
}

import EveClient from './client/EveClient'

import { owners, defaultPrefix } from './config.json'

const client = new EveClient({
    token: process.env.TOKEN,
    owners,
    defaultPrefix
})

client.start()
