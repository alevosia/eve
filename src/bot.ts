if (process.env.NODE_ENV !== 'prod') {
    require('dotenv').config()
}

import EveClient from './client/EveClient'

import config from './config.json'

const client = new EveClient({
    token: process.env.TOKEN,
    owners: config.owners,
    prefix: config.prefix,
})

client.start()
