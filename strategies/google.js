const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const {v4} = require('uuid')
const {PROVIDERS} = require('../const')
const {models} = require('../db')
const {generateToken} = require('../utils')
const {User} = models

const {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL, HOST} = process.env

const google = new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${HOST}${GOOGLE_CALLBACK_URL}`
  },
  async (accessToken, refreshToken, profile, done) => {
    // you can also store access/refresh tokens if you're planning to access google services on behalf of this user
    const login = profile.emails[0].value
    const user = await User.findOne({where: {login, provider: PROVIDERS.GOOGLE }, raw: true})
    if (user) {
      // here you can update user info, for example profile pic or name
      const token = generateToken(user)
      return done(null, {token})
    } else {
      const userRecord = await User.create({login, provider: PROVIDERS.GOOGLE, password: 'FEDERATED', id: v4()})
      const rawUser = userRecord.get({plain: true})
      const token = generateToken(rawUser)
      return done(null, {token})
    }
  }
)


module.exports = google
