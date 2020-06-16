import { Command } from 'discord-akairo'
import { Message, Channel } from 'discord.js'
import { Settings } from '../../constants'

interface Arguments {
    logType: 'message' | 'messages' | 'member' | 'members'
    channel?: Channel
}

class SayCommand extends Command {
    constructor() {
        super('log', {
            aliases: ['log'],
            description: 'Set the channels to send message or member logs.',
            category: 'mod',
            channel: 'guild',
            userPermissions: ['VIEW_AUDIT_LOG', 'MANAGE_MESSAGES'],
            args: [
                {
                    id: 'logType',
                    type: 'string'
                },
                {
                    id: 'channel',
                    type: 'channel'
                }
            ]
        })
    }

    async exec(message: Message, { logType, channel }: Arguments): Promise<Message | void> {
        if (!logType || !channel) return

        this.client.logger.log('info', channel.type)

        if (logType === 'message' || logType === 'messages') {
            await this.client.settings.set(
                message.guild!.id,
                Settings.MESSAGE_LOGS_CHANNEL_ID,
                channel.id
            )

            return message?.util?.send(
                `Message logs channel has been set to ${channel?.toString()}.`
            )
        }

        if (logType === 'member' || logType === 'members') {
            await this.client.settings.set(
                message.guild!.id,
                Settings.MEMBER_LOGS_CHANNEL_ID,
                channel.id
            )

            return message?.util?.send(
                `Member logs channel has been set to ${channel?.toString()}.`
            )
        }
    }
}

export default SayCommand
