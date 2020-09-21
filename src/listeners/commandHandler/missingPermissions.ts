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
        command: Command,
        type: string,
        missing: string[]
    ): Promise<Message | void> {
        // Generate the reply
        const subject = type === 'user' ? "You're" : "I'm"
        const permissions = missing.join(' | ')
        const commandAlias = command.aliases[0]

        const replyContent =
            `${subject} missing the permission(s) \`${permissions}\` ` +
            `to execute the command \`${commandAlias}\`.`

        if (message.channel.type === 'text') {
            const permissions = message.channel.permissionsFor(this.client.user!)

            if (permissions?.has('SEND_MESSAGES')) {
                return message.util?.reply(replyContent)
            }
        }

        return message.author.send(replyContent)
    }
}

export default MissingPermissionsListener
