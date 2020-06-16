import { Listener } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'
import { Settings } from '../../constants'

class MessageDeleteListener extends Listener {
    constructor() {
        super('messageDelete', {
            emitter: 'client',
            event: 'messageDelete',
            category: 'messages'
        })
    }

    exec(message: Message): Promise<Message> | void {
        if (!message.guild) return

        const channelId: string = this.client.settings.get(
            message?.guild.id,
            Settings.MESSAGE_LOGS_CHANNEL_ID,
            null
        )

        this.client.logger.log('info', `Message Logs Channel ID: ${channelId}`)

        if (channelId) {
            const channel = this.client.channels.cache.get(channelId) as TextChannel
            return channel.send(`${message.author}: ${message.content}`)
        }
    }
}

export default MessageDeleteListener
