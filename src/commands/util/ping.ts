import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

class PingCommand extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping'],
            category: 'util'
        })
    }

    async exec(message: Message): Promise<Message | void> {
        const sent = await message?.util?.reply('Pong!')

        if (sent) {
            const timeDiff =
                (sent.editedAt || sent.createdAt).getTime() -
                (message.editedAt || message.createdAt).getTime()

            return message?.util?.reply([
                'Pong!',
                `🔂 **RTT**: ${timeDiff} ms`,
                `💟 **Heartbeat**: ${Math.round(this.client.ws.ping)} ms`
            ])
        }
    }
}

export default PingCommand
