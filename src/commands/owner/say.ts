import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

interface Arguments {
    text?: string
}

class SayCommand extends Command {
    constructor() {
        super('say', {
            aliases: ['say'],
            category: 'owner',
            ownerOnly: true,
            clientPermissions: ['MANAGE_MESSAGES'],
            args: [
                {
                    id: 'text',
                    type: 'string',
                    match: 'content'
                }
            ]
        })
    }

    async exec(message: Message, args: Arguments): Promise<Message | void> {
        await message.delete({ reason: 'say command' })
        return message?.util?.send(args.text)
    }
}

export default SayCommand
