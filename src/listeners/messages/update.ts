import { Listener } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'
import { Settings } from '../../constants'
import { diffWords } from '../../util'

class MessageUpdateListener extends Listener {
    constructor() {
        super('messageUpdate', {
            emitter: 'client',
            event: 'messageUpdate',
            category: 'messages'
        })
    }

    async exec(oldMessage: Message, newMessage: Message): Promise<Message | void> {
        // Ignore bots, DMs, and unchanged content
        if (
            newMessage.author.bot ||
            !newMessage.guild ||
            newMessage.channel.type === 'dm' ||
            oldMessage.content === newMessage.content
        ) {
            return
        }

        // Get the guild's message logs channel's id from guild settings
        const channelId = this.client.settings.get(
            newMessage.guild.id,
            Settings.MESSAGE_LOGS_CHANNEL_ID,
            null
        )

        if (!channelId) {
            return
        }

        const channel = this.client.channels.cache.get(channelId)

        // Message logs channel must be a TextChannel otherwise,
        // delete the id from the guild settings
        if (!(channel instanceof TextChannel)) {
            this.client.settings.delete(newMessage.guild.id, Settings.MESSAGE_LOGS_CHANNEL_ID)
            return
        }

        // Strip markdown characters
        const oldContent = oldMessage.content.replace(/\*|~|_|\||`/g, '')
        const updatedContent = newMessage.content.replace(/\*|~|_|\||`/g, '')

        // Get the difference between the two messages
        const changes = await diffWords(oldContent, updatedContent)

        if (!changes) {
            return
        }

        // Strike-through for removed content and bold characters for added content
        const str = changes.reduce((total, { removed, added, value }) => {
            if (added) {
                return total.concat(`**${value}**`)
            } else if (removed) {
                return total.concat(`~~${value}~~`)
            } else {
                return total.concat(value)
            }
        }, '')

        // Create the embed and send
        const authorName = newMessage.member?.displayName
        const authorAvatarUrl = newMessage.author.displayAvatarURL()
        const embed = this.client.util
            .embed()
            .setAuthor(authorName, authorAvatarUrl)
            .setTitle('Edited Message')
            .setDescription(str)
            .setFooter(`Channel: ${newMessage.channel.name}`)
            .setTimestamp()

        try {
            return await channel.send(embed)
        } catch (error) {
            this.client.logger.error(`[MessageUpdateListener] - ${error.name}`)
            this.client.settings.delete(newMessage.guild.id, Settings.MESSAGE_LOGS_CHANNEL_ID)

            return newMessage.guild.owner?.send(
                `I am unable to send message logs to ${channel}. ` +
                    `I have reset the message logs channel from my settings. ` +
                    `Make sure I have the proper permissions and set the channel again.`
            )
        }
    }
}

export default MessageUpdateListener
