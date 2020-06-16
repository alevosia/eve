import { Listener } from 'discord-akairo'

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        })
    }

    exec(): void {
        this.client.logger.log('info', `${this.client.user?.username} reporting for duty!`)
    }
}

export default ReadyListener
