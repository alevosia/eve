import { Command, Argument } from 'discord-akairo'
import { Message, User, Guild } from 'discord.js'
// import { MAYA_BLUE } from '../../constants'

interface Arguments {
    entity: User | Guild
}

class InfoCommand extends Command {
    constructor() {
        super('info', {
            aliases: ['info'],
            category: 'util',
            channel: 'guild',
            args: [
                {
                    id: 'entity',
                    type: Argument.union('user', 'guild'),
                    description: 'The user or guild you want to get the information of.',
                    prompt: {
                        start: (message: Message) =>
                            `${message.author}, who would you like to get the information of?`,
                        retry: (message: Message) =>
                            `${message.author}, invalid user. Please try again.`,
                        optional: true
                    },
                    default: (message: Message) => message.guild
                }
            ]
        })
    }

    async exec(message: Message, { entity }: Arguments): Promise<Message | void> {
        if (entity instanceof Guild) {
            return message.util?.send(`Guild Name: ${entity.name}`)
        }

        return message.util?.send(`Username: ${entity.username}`)
    }
}

export default InfoCommand
