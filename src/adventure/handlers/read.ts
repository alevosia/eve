import { MessageReaction } from 'discord.js'
import { NodeHandler } from '../../types'
import { makeEmbed } from '../util/makeEmbed'

export const readHandler: NodeHandler = async ({ client, message, node }) => {
    const embed = makeEmbed({ client, node })
    const sent = await message.channel.send(embed)
    await sent.react('▶️')

    const filter = (reaction: MessageReaction) =>
        reaction.emoji.name === '▶️' && reaction.users.cache.has(message.author.id)

    const emojiName = await sent
        .awaitReactions(filter, { max: 1, time: 120000 })
        .then((coll) => coll.first()?.emoji.name)

    if (!emojiName) {
        await message.reply("time's up!")
        return null
    }

    return node.nextNodeId
}
