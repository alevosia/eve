import { Listener, Command } from 'discord-akairo'
import { Message } from 'discord.js'

class MissingPermissionsListener extends Listener {
    constructor() {
        super('missingPermissions', {
            emitter: 'commandHandler',
            event: 'missingPermissions'
        })
    }

    async exec(
        message: Message,
        _: Command,
        type: string,
        missing: unknown
    ): Promise<Message | void> {
        if (type === 'user') {
            return message.util?.reply(
                `you're missing the permission \`${missing}\` to execute this command.`
            )
        } else {
            return message.util?.reply(
                `I'm missing the permission \`${missing}\` to execute this command.`
            )
        }
    }
}

export default MissingPermissionsListener
