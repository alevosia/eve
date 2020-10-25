import { Sequelize, Model, DataTypes } from 'sequelize'
import { join } from 'path'
import { __rootdir__ } from '../root'

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: join(__rootdir__, '..', 'database.sqlite'),
    logging: false
})

export class Guild extends Model {}

Guild.init(
    {
        guild_id: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        settings: DataTypes.JSON
    },
    { sequelize, modelName: 'guild' }
)
