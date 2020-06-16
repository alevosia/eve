import { Listener } from 'discord-akairo'

class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready',
        })
    }

    exec(): void {
        console.log(`${this.client.user?.username} reporting for duty!`)
    }
}

export default ReadyListener
