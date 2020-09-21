import { Listener } from 'discord-akairo'

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        })
    }

    async exec(): Promise<void> {
        this.client.logger.info(`${this.client.user?.username} reporting for duty!`)
    }
}

export default ReadyListener
