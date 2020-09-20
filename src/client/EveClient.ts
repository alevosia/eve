import {
    AkairoClient,
    CommandHandler,
    InhibitorHandler,
    ListenerHandler,
    SequelizeProvider
} from 'discord-akairo'
import { Message } from 'discord.js'
import { Logger } from 'winston'
import { join } from 'path'
import { logger } from '../util/logger'
import { Settings } from '../constants'
import Guild from '../models/Guild'
import { __rootdir__ } from '../root'

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
    defaultPrefix: string
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

        // error logging
        process.on('unhandledRejection', (error: any) => this.logger.error(error.stack))

        // settings provider
        this.settings = new SequelizeProvider(Guild, {
            idColumn: 'guild_id',
            dataColumn: 'settings'
        })

        this.commandHandler = new CommandHandler(this, {
            directory: join(__rootdir__, 'commands'),
            prefix: (message) => {
                if (message.guild) {
                    return this.settings.get(
                        message.guild.id,
                        Settings.PREFIX,
                        config.defaultPrefix
                    )
                }

                return config.defaultPrefix
            },
            blockClient: true,
            blockBots: true,
            allowMention: true,
            handleEdits: true,
            commandUtil: true,
            commandUtilLifetime: 150000, // 5m
            defaultCooldown: 15000, // 15s
            ignoreCooldown: config.owners,
            argumentDefaults: {
                prompt: {
                    retries: 3,
                    time: 10000,
                    cancelWord: 'cancel',
                    stopWord: 'stop',
                    optional: false,
                    infinite: false,
                    limit: 100,
                    breakout: true,
                    start: null,

                    retry: (message: Message): string =>
                        `${message.author}, invalid command argument(s) provided. Please try again.`,
                    timeout: (message: Message): string =>
                        `${message.author}, you have run out of time. Command has been cancelled.`,
                    ended: (message: Message): string =>
                        `${message.author}, you have reached the maximum amount of tries. Command has been cancelled.`,
                    cancel: (message: Message): string =>
                        `${message.author}, command has been cancelled.`
                }
            }
        })

        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: join(__rootdir__, 'inhibitors')
        })

        this.listenerHandler = new ListenerHandler(this, {
            directory: join(__rootdir__, 'listeners')
        })
    }

    private async _init(): Promise<void> {
        this.logger.info('Initiating start sequence...')

        await this.settings.init()
        this.logger.info('Guild settings initialized.')

        // Since the inhibitor and listener handlers are a part of the command handling process,
        // the command handler has to know them
        this.commandHandler.useInhibitorHandler(this.inhibitorHandler)
        this.commandHandler.useListenerHandler(this.listenerHandler)

        this.listenerHandler.setEmitters({
            commandHandler: this.commandHandler,
            inhibitorHandler: this.inhibitorHandler,
            listenerHandler: this.listenerHandler
        })

        this.commandHandler.loadAll()
        this.logger.info('Commands loaded.')

        this.inhibitorHandler.loadAll()
        this.logger.info('Inhibitors loaded.')

        this.listenerHandler.loadAll()
        this.logger.info('Listeners loaded.')
    }

    async start(): Promise<void> {
        await this._init()
        this.login(this.config.token)
    }
}

export default EveClient
