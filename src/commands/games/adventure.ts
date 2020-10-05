import { AkairoClient, Command } from 'discord-akairo'
import { CollectorFilter } from 'discord.js'
import { Message } from 'discord.js'
import { sleep } from '../../util/sleep'
import { campaign } from '../../adventure/campaign'
import { CNode, CNodeType, MyState } from '../../types'

interface SendEmbedParams {
    client: AkairoClient
    message: Message
    node?: CNode<MyState>
}

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
                'EMBED_LINKS',
                'ATTACH_FILES',
                'CONNECT',
                'SPEAK',
                'PRIORITY_SPEAKER'
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
        const choiceFilter: CollectorFilter = (m: Message) =>
            m.author.id === message.author.id && !isNaN(Number(m.content))

        let nodeId: string | undefined = 'start'

        while (true) {
            if (!nodeId) {
                return sendEnd({ client, message })
            }

            const node: CNode<MyState> | undefined = campaign.nodes[nodeId]

            if (!node) {
                return sendEnd({ client, message, node })
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

                message.channel.send(embed)
                nodeId = node.nextNodeId
                await sleep(3000)
            } else if (node.type === CNodeType.CHOICE) {
                const embed = client.util
                    .embed()
                    .setTitle(node?.title)
                    .setDescription(node?.text)
                    .setColor('AQUA')

                if (node.imageUrl) {
                    embed.setImage(node.imageUrl)
                }

                let i = 1
                const map: Map<number, string | undefined> = new Map()

                for (const key in node.choices) {
                    embed.addField(i, node.choices[key].text, true)
                    map.set(i, node.choices[key].nextNodeId)
                    i++
                }

                await message.channel.send(embed)

                const response = await message.channel
                    .awaitMessages(choiceFilter, {
                        max: 1,
                        time: 60000
                    })
                    .then((col) => col.first()?.content)

                if (!response) {
                    return message.reply('No response.')
                }

                nodeId = map.get(Number(response))
            } else {
                // TODO: Implement INPUT
            }
        }
    }
}

export default AdventureCommand
