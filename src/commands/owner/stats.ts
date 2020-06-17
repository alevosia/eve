import Akairo, { Command } from 'discord-akairo'
import Discord, { Message } from 'discord.js'
import { formatMilliseconds } from '../../util/formatMilliseconds'
import { MAYA_BLUE } from '../../constants'

class StatsCommand extends Command {
    constructor() {
        super('stats', {
            aliases: ['stats'],
            category: 'owner',
            clientPermissions: ['EMBED_LINKS'],
            ownerOnly: true
        })
    }

    async exec(message: Message): Promise<Message | void> {
        const embed = this.client?.util
            ?.embed()
            .setColor(MAYA_BLUE)
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

export default StatsCommand
