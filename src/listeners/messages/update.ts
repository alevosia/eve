import { Listener } from 'discord-akairo'
import { Message, TextChannel } from 'discord.js'
import { diffWords } from 'diff'
import { Settings } from '../../constants'
import { promisify } from 'util'

const asyncDiffWords = promisify(diffWords)

class MessageUpdateListener extends Listener {
    constructor() {
        super('messageUpdate', {
            emitter: 'client',
            event: 'messageUpdate',
            category: 'messages'
        })
    }

    async exec(oldMessage: Message, newMessage: Message): Promise<Message | void> {
        if (
            !newMessage.guild ||
            newMessage.author.bot ||
            oldMessage.content === newMessage.content
        ) {
            return
        }

        const channelId: string = this.client.settings.get(
            newMessage.guild.id,
            Settings.MESSAGE_LOGS_CHANNEL_ID,
            null
        )

        if (channelId) {
            const channel = this.client.channels.cache.get(channelId) as TextChannel

            const old = oldMessage.content.replace(/\*|~|_|\||`/g, '')
            const updated = newMessage.content.replace(/\*|~|_|\||`/g, '')
            const changes = await asyncDiffWords(old, updated)

            if (!changes) return

            const str = changes.reduce((total, change) => {
                if (change.removed) {
                    return total.concat(`~~${change.value}~~`)
                } else if (change.added) {
                    return total.concat(`**${change.value}**`)
                } else {
                    return total.concat(change.value)
                }
            }, '')

            const authorName = newMessage.member?.displayName
            const authorAvatarUrl = newMessage.author.displayAvatarURL()
            const embed = this.client.util
                .embed()
                .setAuthor(authorName, authorAvatarUrl)
                .setTitle('Edited Message')
                .setDescription(str)
                .setTimestamp()

            return channel.send(embed)
        }
    }
}

export default MessageUpdateListener
