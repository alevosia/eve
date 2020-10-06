import { AkairoClient, Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { campaign } from '../../adventure/campaign'
import { CNode, CNodeType, MyState } from '../../types'
import { MessageReaction } from 'discord.js'

interface SendEmbedParams {
    client: AkairoClient
    message: Message
    node?: CNode<MyState>
}

const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']

type SendEmbedFn = (params: SendEmbedParams) => Promise<Message | void>

const sendEnd: SendEmbedFn = async ({ client, message }) => {
    const embed = client.util
        .embed()
        .setTitle(campaign.name)
        .setImage('https://dtkrippene.files.wordpress.com/2014/02/the-end-tanisha.jpg')
        .setColor('RED')

    return message.channel.send(embed)
}

class AdventureCommand extends Command {
    constructor() {
        super('adventure', {
            aliases: ['adventure', 'adv'],
            clientPermissions: [
                'SEND_MESSAGES',
                'MANAGE_MESSAGES',
                'ADD_REACTIONS',
                'EMBED_LINKS',
                'ATTACH_FILES',
                'VIEW_CHANNEL'
            ],
            userPermissions: [
                'SEND_MESSAGES',
                'READ_MESSAGE_HISTORY',
                'ADD_REACTIONS',
                'VIEW_CHANNEL'
            ],
            channel: 'guild',
            category: 'games',
            cooldown: 100000
        })
    }

    async exec(message: Message): Promise<Message | void> {
        const channel = message.channel

        if (channel.type !== 'text') {
            return
        }

        const client = this.client
        let nodeId: string | undefined = 'start'

        while (nodeId) {
            const node: CNode<MyState> | undefined = campaign.nodes[nodeId]

            if (!node) {
                break
            }

            if (node.type === CNodeType.READ) {
                const embed = client.util
                    .embed()
                    .setTitle(node?.title)
                    .setDescription(node?.text)
                    .setColor('AQUA')

                if (node.imageUrl) {
                    embed.setImage(node.imageUrl)
                }

                const sent = await message.channel.send(embed)

                await sent.react('▶️')

                const filter = (reaction: MessageReaction) =>
                    reaction.emoji.name === '▶️' && reaction.users.cache.has(message.author.id)

                const emojiName = await sent
                    .awaitReactions(filter, { max: 1, time: 120000 })
                    .then((coll) => coll.first()?.emoji.name)

                if (!emojiName) {
                    await message.reply('no response.')
                    break
                }

                nodeId = node.nextNodeId
            } else if (node.type === CNodeType.CHOICE) {
                const embed = client.util
                    .embed()
                    .setTitle(node?.title)
                    .setDescription(node?.text)
                    .setColor('AQUA')

                if (node.imageUrl) {
                    embed.setImage(node.imageUrl)
                }

                let i = 0
                const map: Map<string, string | undefined> = new Map()

                for (const key in node.choices) {
                    embed.addField(i + 1, node.choices[key].text, true)
                    map.set(emojis[i], node.choices[key].nextNodeId)
                    i++
                }

                const sent = await message.channel.send(embed)

                const promises: Promise<MessageReaction>[] = []

                for (let j = 0; j < map.size; j++) {
                    promises.push(sent.react(emojis[j]))
                }

                await Promise.all(promises)

                const filter = (reaction: MessageReaction) =>
                    map.has(reaction.emoji.name) && reaction.users.cache.has(message.author.id)

                const reactionName = await sent
                    .awaitReactions(filter, { max: 1, time: 60000 })
                    .then((coll) => coll.first()?.emoji.name)

                if (!reactionName) {
                    break
                }

                nodeId = map.get(reactionName)
            } else {
                // TODO: Implement INPUT
            }
        }

        return sendEnd({ client, message })
    }
}

export default AdventureCommand
