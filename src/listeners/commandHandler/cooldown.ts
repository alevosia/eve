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
        return message.util?.reply(
            `the command \`${command.aliases[0]}\` is still on cooldown for ${Math.ceil(
                remaining / 1000
            )} seconds.`
        )
    }
}

export default CommandCooldownListener
