import Akairo, { Command } from 'discord-akairo'
import Discord, { Message } from 'discord.js'
import { formatMilliseconds } from '../../util/formatMilliseconds'
import { Colors } from '../../constants'

class StatusCommand extends Command {
    constructor() {
        super('status', {
            aliases: ['status'],
            category: 'owner',
            clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
            ownerOnly: true
        })
    }

    async exec(message: Message): Promise<Message | void> {
        const embed = this.client?.util
            ?.embed()
            .setColor(Colors.MAYA_BLUE)
            .setTitle(`${this.client.user?.username} Statistics`)
            .addField(
                'Discord',
                [
                    `**Guilds**: ${this.client.guilds.holds.length}`,
                    `**Channels**: ${this.client.guilds.holds.length}`,
                    `**Users**: ${this.client.users.holds.length}`
                ],
                true
            )
            .addField(
                'Technical',
                [
                    `**Uptime**: ${formatMilliseconds(this.client.uptime)}`,
                    `**Memory**: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`
                ],
                true
            )
            .setFooter(`Discord.js: v${Discord.version} | Akairo: v${Akairo.version}`)

        return message?.util?.send({ embed })
    }
}

export default StatusCommand
