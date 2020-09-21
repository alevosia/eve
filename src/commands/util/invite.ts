import { Message } from 'discord.js'
import { Command } from 'discord-akairo'
import { Colors } from '../../constants'

class InviteCommand extends Command {
    constructor() {
        super('invite', {
            aliases: ['invite'],
            category: 'util',
            channel: 'guild'
            // clientPermissions: ['SEND_MESSAGES']
        })
    }

    async exec(message: Message): Promise<Message | void> {
        const invite = await this.client.generateInvite(['ADMINISTRATOR'])

        const embed = this.client.util
            .embed()
            .setAuthor(this.client.user?.username, this.client.user?.displayAvatarURL())
            .setDescription(`[Invite Me](${invite})`)
            .setColor(Colors.MAYA_BLUE)

        try {
            return await message.channel.send(embed)
        } catch (error) {
            this.client.logger.error(error)
            return message.author.send(embed)
        }
    }
}

export default InviteCommand
