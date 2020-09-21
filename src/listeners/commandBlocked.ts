import { Listener, Command } from 'discord-akairo'
import { Message } from 'discord.js'

class CommandBlockedListener extends Listener {
    constructor() {
        super('commandBlocked', {
            emitter: 'commandHandler',
            event: 'commandBlocked'
        })
    }

    async exec(message: Message, command: Command, reason: string): Promise<void> {
        this.client.logger.info(
            `${message.author.username} was blocked from using ${command.id} because of ${reason}!`
        )
    }
}

export default CommandBlockedListener
