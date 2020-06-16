import { Sequelize, Model, DataTypes } from 'sequelize'
const sequelize = new Sequelize('sqlite::memory')

class Guild extends Model {}

Guild.init(
    {
        guild_id: DataTypes.STRING,
        settings: DataTypes.JSON
    },
    { sequelize, modelName: 'guild' }
)

sequelize.sync()

export default Guild
