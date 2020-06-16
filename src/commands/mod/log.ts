import { Command } from 'discord-akairo'
import { Message, Channel } from 'discord.js'
import { Settings } from '../../constants'

interface Arguments {
    type: 'messages' | 'members'
    channel?: Channel
}

class SayCommand extends Command {
    constructor() {
        super('log', {
            aliases: ['log'],
            category: 'mod',
            channel: 'guild',
            userPermissions: ['VIEW_AUDIT_LOG', 'MANAGE_MESSAGES'],
            args: [
                {
                    id: 'type',
                    type: 'string'
                },
                {
                    id: 'channel',
                    type: 'channel'
                }
            ]
        })
    }

    exec(message: Message, { type, channel }: Arguments): Promise<Message> | void {
        if (!type || !channel) return

        this.client.logger.log('info', channel.type)

        if (type === 'messages') {
            this.client.settings.set(
                message.guild!.id,
                Settings.MESSAGE_LOGS_CHANNEL_ID,
                channel.id
            )

            return message?.util?.send(`Message logs channel has been to ${channel?.toString()}.`)
        }

        if (type === 'members') {
            this.client.settings.set(message.guild!.id, Settings.MEMBER_LOGS_CHANNEL_ID, channel.id)
            return message?.util?.send(`Member logs channel has been to ${channel?.toString()}.`)
        }
    }
}

export default SayCommand
