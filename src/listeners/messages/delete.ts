import { Listener } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'
import { Settings } from '../../constants'
import { FIREBRICK } from '../../constants'

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
            message.guild.id,
            Settings.MESSAGE_LOGS_CHANNEL_ID,
            null
        )

        if (channelId) {
            const channel = this.client.channels.cache.get(channelId) as TextChannel
            const name = message.member?.displayName
            const avatarUrl = message.author.displayAvatarURL()

            const embed = this.client.util
                .embed()
                .setColor(FIREBRICK)
                .setAuthor(name, avatarUrl)
                .setTitle('Deleted Message')
                .setDescription(message.content)
                .setTimestamp()

            return channel.send(embed)
        }
    }
}

export default MessageDeleteListener
