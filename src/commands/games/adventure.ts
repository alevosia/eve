import { AkairoClient, Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { campaign } from '../../adventure/campaign'
import { CNode, CNodeType, MyState } from '../../types'
import { choiceHandler, readHandler } from '../../adventure/handlers'

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
        let nodeId: string | undefined | null = 'start'

        while (nodeId) {
            const node: CNode<MyState> | undefined = campaign.nodes[nodeId]

            if (!node) {
                break
            }

            switch (node.type) {
                case CNodeType.READ: {
                    nodeId = await readHandler({ client, message, node })
                    break
                }

                case CNodeType.CHOICE: {
                    nodeId = await choiceHandler({ client, message, node })
                    break
                }

                default: {
                    nodeId = null
                    break
                }
            }
        }

        return sendEnd({ client, message })
    }
}

export default AdventureCommand
