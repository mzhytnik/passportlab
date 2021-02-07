const importModels = sequelize => {
  const models = ({
    User: sequelize.import('./user'),
  })
  return models
}

module.exports = importModels
