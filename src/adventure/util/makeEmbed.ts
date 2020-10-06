import { AkairoClient } from 'discord-akairo'
import { MessageEmbed } from 'discord.js'
import { CNode, MyState } from '../../types'

interface MakeEmbedParams {
    client: AkairoClient
    node: CNode<MyState>
}

export const makeEmbed = ({ client, node }: MakeEmbedParams): MessageEmbed => {
    const embed = client.util
        .embed()
        .setTitle(node?.title)
        .setDescription(node?.text)
        .setColor('AQUA')

    if (node.imageUrl) {
        embed.setImage(node.imageUrl)
    }

    return embed
}
