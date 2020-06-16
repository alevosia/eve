import { Listener, Command } from 'discord-akairo'
import { Message } from 'discord.js'

class CommandBlockedListener extends Listener {
    constructor() {
        super('commandBlocked', {
            emitter: 'commandHandler',
            event: 'commandBlocked'
        })
    }

    exec(message: Message, command: Command, reason: string): void {
        this.client.logger.log(
            'info',
            `${message.author.username} was blocked from using ${command.id} because of ${reason}!`
        )
    }
}

export default CommandBlockedListener
