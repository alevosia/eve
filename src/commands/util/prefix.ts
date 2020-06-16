import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { Settings } from '../../constants'

interface Arguments {
    prefix: string
}

class PrefixCommand extends Command {
    constructor() {
        super('prefix', {
            aliases: ['prefix'],
            category: 'util',
            channel: 'guild',
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    id: 'prefix',
                    type: 'string'
                }
            ]
        })
    }

    async exec(message: Message, { prefix }: Arguments): Promise<Message | void> {
        if (!prefix) return

        await this.client.settings.set(message.guild!.id, Settings.PREFIX, prefix)
        return message.channel.send(`My command prefix has been set to \`${prefix}\`.`)
    }
}

export default PrefixCommand
