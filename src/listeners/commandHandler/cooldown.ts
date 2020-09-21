import { Listener, Command } from 'discord-akairo'
import { Message } from 'discord.js'

class CommandCooldownListener extends Listener {
    constructor() {
        super('commandCooldown', {
            emitter: 'commandHandler',
            event: 'cooldown'
        })
    }

    async exec(message: Message, command: Command, remaining: number): Promise<Message | void> {
        const commandAlias = command.aliases[0]
        const timeLeft = Math.ceil(remaining / 1000)

        return message.util?.reply(
            `the command \`${commandAlias}\` is still on cooldown for ${timeLeft} seconds.`
        )
    }
}

export default CommandCooldownListener
