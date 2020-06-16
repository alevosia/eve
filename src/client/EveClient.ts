import {
    AkairoClient,
    CommandHandler,
    InhibitorHandler,
    ListenerHandler,
    SequelizeProvider
} from 'discord-akairo'
import { Logger } from 'winston'
import { join } from 'path'
import { logger } from '../util/logger'
import { Settings } from '../constants'
import Guild from '../models/Guild'

declare module 'discord-akairo' {
    interface AkairoClient {
        config: EveOptions
        settings: SequelizeProvider
        commandHandler: CommandHandler
        inhibitorHandler: InhibitorHandler
        listenerHandler: ListenerHandler
        logger: Logger
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
                ownerID: config.owners
            },
            {
                messageCacheMaxSize: 1000,
                disableMentions: 'everyone'
            }
        )

        this.configure(config)
    }

    configure(config: EveOptions): void {
        this.config = config
        this.logger = logger

        process.on('unhandledRejection', (error: any) => this.logger.error(error.stack))

        this.settings = new SequelizeProvider(Guild, {
            idColumn: 'guild_id',
            dataColumn: 'settings'
        })

        this.commandHandler = new CommandHandler(this, {
            directory: join(__dirname, '..', 'commands'),
            prefix: (message) => {
                if (message.guild) {
                    return this.settings.get(message.guild.id, Settings.PREFIX, config.prefix)
                }

                return config.prefix
            },
            allowMention: true,
            commandUtil: true,
            handleEdits: true
        })

        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: join(__dirname, '..', 'inhibitors')
        })

        this.listenerHandler = new ListenerHandler(this, {
            directory: join(__dirname, '..', 'listeners')
        })
    }

    private async _init(): Promise<void> {
        this.logger.log('info', 'Initiating start sequence...')

        await this.settings.init()
        this.logger.log('info', 'Guild settings initialized.')

        this.commandHandler.useInhibitorHandler(this.inhibitorHandler)
        this.commandHandler.useListenerHandler(this.listenerHandler)

        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            inhibitorHandler: this.inhibitorHandler,
            listenerHandler: this.listenerHandler
        })

        this.commandHandler.loadAll()
        this.logger.log('info', 'Commands loaded.')

        this.inhibitorHandler.loadAll()
        this.logger.log('info', 'Inhibitors loaded.')

        this.listenerHandler.loadAll()
        this.logger.log('info', 'Listeners loaded.')
    }

    start(): void {
        this._init()
        this.login(this.config.token)
    }
}

export default EveClient
