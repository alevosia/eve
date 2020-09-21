import { Command } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'
import { Settings } from '../../constants'

interface Arguments {
    logType: 'message' | 'member'
    channel?: TextChannel
}

class LogCommand extends Command {
    constructor() {
        super('log', {
            aliases: ['log'],
            description: 'Set the channels to send message or member logs.',
            category: 'mod',
            channel: 'guild',
            clientPermissions: ['SEND_MESSAGES'],
            userPermissions: ['VIEW_AUDIT_LOG', 'MANAGE_MESSAGES'],
            args: [
                {
                    id: 'logType',
                    type: [
                        ['message', 'messages'],
                        ['member', 'members']
                    ],
                    prompt: {
                        start: (message: Message) =>
                            `${message.author}, what do you want to log? ` +
                            `Type in \`messages\` if you want to log edited and deleted messages. ` +
                            `Type in \`members\` if you want to log members joining, leaving, kicked, etc.`,
                        retry: (message: Message) =>
                            `${message.author}, invalid log type provided. Please try again.`
                    }
                },
                {
                    id: 'channel',
                    type: 'textChannel',
                    prompt: {
                        start: (message: Message) =>
                            `${message.author}, which text channel do you want to log it?`,
                        retry: (message: Message) =>
                            `${message.author}, invalid text channel provided. Please try again.`
                    }
                }
            ]
        })
    }

    async exec(message: Message, { logType, channel }: Arguments): Promise<Message | void> {
        if (!logType || !channel) return

        if (logType === 'message') {
            await this.client.settings.set(
                message.guild!.id,
                Settings.MESSAGE_LOGS_CHANNEL_ID,
                channel.id
            )

            return message?.util?.send(
                `Message logs channel has been set to ${channel?.toString()}.`
            )
        }

        if (logType === 'member') {
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

export default LogCommand
