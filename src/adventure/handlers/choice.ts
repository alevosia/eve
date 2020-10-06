import { MessageReaction } from 'discord.js'
import { NodeHandler } from '../../types'
import { makeEmbed } from '../util'

const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']

export const choiceHandler: NodeHandler = async ({ client, message, node }) => {
    const embed = makeEmbed({ client, node })

    // create a map with the emoji number as key
    // and the node's nextNodeId as the value
    let i = 0
    const map: Map<string, string | undefined> = new Map()
    for (const key in node.choices) {
        // add a field for each choice
        embed.addField(i + 1, node.choices[key].text, true)
        map.set(emojis[i], node.choices[key].nextNodeId)
        i++
    }

    // send embed containing the choices
    const sent = await message.channel.send(embed)

    // add reaction for each choice available
    const promises: Promise<MessageReaction>[] = []
    for (let j = 0; j < map.size; j++) {
        promises.push(sent.react(emojis[j]))
    }
    await Promise.all(promises)

    // wait for player's choice
    const filter = (reaction: MessageReaction) =>
        map.has(reaction.emoji.name) && reaction.users.cache.has(message.author.id)

    const reactionName = await sent
        .awaitReactions(filter, { max: 1, time: 60000 })
        .then((coll) => coll.first()?.emoji.name)

    if (!reactionName) {
        await message.reply("time's up!")
        return null
    }

    return map.get(reactionName)
}
