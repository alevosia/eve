import { Listener } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'
import { Settings } from '../../constants'
import { Colors } from '../../constants'

class MessageDeleteListener extends Listener {
    constructor() {
        super('messageDelete', {
            emitter: 'client',
            event: 'messageDelete',
            category: 'messages'
        })
    }

    async exec(message: Message): Promise<Message | void> {
        if (!message.guild) {
            return
        }

        const channelId = this.client.settings.get(
            message.guild.id,
            Settings.MESSAGE_LOGS_CHANNEL_ID,
            null
        )

        if (!channelId) {
            return
        }

        const channel = this.client.channels.cache.get(channelId)

        // message logs channel must be a TextChannel
        if (!(channel instanceof TextChannel)) {
            this.client.settings.delete(message.guild.id, Settings.MESSAGE_LOGS_CHANNEL_ID)
            return
        }

        const name = message.member?.displayName || message.author.username
        const avatarUrl = message.author.displayAvatarURL()

        const embed = this.client.util
            .embed()
            .setColor(Colors.FIREBRICK)
            .setAuthor(name, avatarUrl)
            .setTitle('Deleted Message')
            .setDescription(message.content)
            .setTimestamp()

        return channel.send(embed)
    }
}

export default MessageDeleteListener
