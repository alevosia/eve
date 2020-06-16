import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo'
import { join } from 'path'

declare module 'discord-akairo' {
    interface AkairoClient {
        config: EveOptions
        commandHandler: CommandHandler
        inhibitorHandler: InhibitorHandler
        listenerHandler: ListenerHandler
    }
}

interface EveOptions {
    owners?: string | string[]
    token?: string
    prefix: string
}

class EveClient extends AkairoClient {
    constructor(config: EveOptions) {
        super(
            {
                ownerID: config.owners,
            },
            {
                messageCacheMaxSize: 1000,
                disableMentions: 'everyone',
            }
        )

        this.configure(config)
    }

    configure(config: EveOptions): void {
        this.config = config

        this.commandHandler = new CommandHandler(this, {
            directory: join(__dirname, '..', 'commands'),
            prefix: this.config.prefix,
        })

        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: join(__dirname, '..', 'inhibitors'),
        })

        this.listenerHandler = new ListenerHandler(this, {
            directory: join(__dirname, '..', 'listeners'),
        })
    }

    private _init(): void {
        console.log('Initiating start sequence...')
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler)
        this.commandHandler.useListenerHandler(this.listenerHandler)

        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            inhibitorHandler: this.inhibitorHandler,
            listenerHandler: this.listenerHandler,
        })

        this.commandHandler.loadAll()
        console.log('Commands loaded.')

        this.inhibitorHandler.loadAll()
        console.log('Inhibitors loaded.')

        this.listenerHandler.loadAll()
        console.log('Listeners loaded.')
    }

    start(): void {
        this._init()
        this.login(this.config.token)
    }
}

export default EveClient
