const jwt = require('jsonwebtoken')

const generateToken = ({id}) => jwt.sign({
  iss: 'passportlab',
  sub: id,
  iat: new Date().getTime(),
  exp: new Date().setDate(new Date().getDate() + 1)
}, process.env.JWT_SECRET)

module.exports =  {generateToken}
