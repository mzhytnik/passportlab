const {Strategy, ExtractJwt}= require("passport-jwt")
const {models} = require('../db')
const {User} = models

const jwt = new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  async (jwtPayload, done) => {
    try {
      const user = await User.findOne({where: {id: jwtPayload.sub}, raw: true, attributes: ['id', 'type']})
      return done(null, user)
    } catch (e) {
      return done(e)
    }
  }
)

module.exports = jwt
