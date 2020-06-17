if (process.env.NODE_ENV === 'dev') {
    require('dotenv').config()
}

import EveClient from './client/EveClient'

import { owners, defaultPrefix } from './config.json'

const client = new EveClient({
    token: process.env.TOKEN,
    owners,
    defaultPrefix
})

client.start()
