import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { Settings } from '../../constants'

interface Arguments {
    newPrefix: string
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
                    id: 'newPrefix',
                    type: 'string',
                    prompt: {
                        start: (message: Message) =>
                            `${message.author}, what prefix would you like to use?`,
                        retry: (message: Message) =>
                            `${message.author}, invalid prefix. Please try again.`
                    }
                }
            ]
        })
    }

    async exec(message: Message, { newPrefix }: Arguments): Promise<Message | void> {
        if (!newPrefix) return

        const currentPrefix = await this.client.settings.get(
            message.guild!.id,
            Settings.PREFIX,
            this.client.config.defaultPrefix
        )

        if (currentPrefix === newPrefix) {
            return message.util?.reply(`my command prefix is already set to \`${newPrefix}\`.`)
        }

        await this.client.settings.set(message.guild!.id, Settings.PREFIX, newPrefix)
        return message.util?.reply(`my command prefix has been set to \`${newPrefix}\`.`)
    }
}

export default PrefixCommand
