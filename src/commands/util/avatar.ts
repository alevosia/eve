import { Command } from 'discord-akairo'
import { Message, User } from 'discord.js'
import { Colors } from '../../constants'

interface Arguments {
    user: User
}

class AvatarCommand extends Command {
    constructor() {
        super('avatar', {
            aliases: ['avatar'],
            category: 'util',
            channel: 'guild',
            args: [
                {
                    id: 'user',
                    type: 'user',
                    description: 'The user you want to get the avatar of.',
                    prompt: {
                        start: (message: Message) =>
                            `${message.author}, who would you like to get the avatar of?`,
                        retry: (message: Message) =>
                            `${message.author}, invalid user. Please try again.`,
                        optional: true
                    },
                    default: (message: Message) => message.author
                }
            ]
        })
    }

    async exec(message: Message, { user }: Arguments): Promise<Message | void> {
        const embed = this.client.util
            .embed()
            .setColor(Colors.MAYA_BLUE)
            .setTitle(`${user.username}'s avatar`)
            .setImage(
                user.displayAvatarURL({
                    size: 1024,
                    dynamic: true
                })
            )
            .setFooter(
                `Request by ${message.member?.displayName}`,
                message.author.displayAvatarURL()
            )

        return message.util?.send(embed)
    }
}

export default AvatarCommand
