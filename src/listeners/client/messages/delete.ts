import { Listener } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'
import { Settings } from '../../../constants'
import { Colors } from '../../../constants'

class MessageDeleteListener extends Listener {
    constructor() {
        super('messageDelete', {
            emitter: 'client',
            event: 'messageDelete',
            category: 'messages'
        })
    }

    async exec(message: Message): Promise<Message | void> {
        // Ignore bots, DMs, and unchanged content
        if (message.author.bot || !message.guild) {
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

        // Create the embed and send
        const authorName = message.member?.displayName
        const authorAvatarUrl = message.author.displayAvatarURL()
        const embed = this.client.util
            .embed()
            .setColor(Colors.FIREBRICK)
            .setAuthor(authorName, authorAvatarUrl)
            .setTitle('Deleted Message')
            .setDescription(message.content)
            .setFooter(`Channel: ${channel.name}`)
            .setTimestamp()

        try {
            return await channel.send(embed)
        } catch (error) {
            this.client.logger.error(`[MessageUpdateListener] - ${error.name}`)
            this.client.settings.delete(message.guild.id, Settings.MESSAGE_LOGS_CHANNEL_ID)

            return message.guild.owner?.send(
                `I am unable to send message logs to ${channel}. ` +
                    `I have reset the message logs channel from my settings. ` +
                    `Make sure I have the proper permissions and set the channel again.`
            )
        }
    }
}

export default MessageDeleteListener
