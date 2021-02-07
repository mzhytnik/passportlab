const Sequelize = require('sequelize')
const importModels = require('./models')

const init = () => {
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: { ssl: true }
  })
  return sequelize
}

const dbInstance = init()
const models = importModels(dbInstance)

module.exports = { dbInstance, models }
