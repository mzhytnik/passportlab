require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const passport = require('passport')
const { v4 } = require('uuid')
const {jwtStrategy, googleStrategy} = require('./strategies')
const {USER_TYPES} = require('./const')
const {generateToken} = require('./utils')
const {checkAccess} = require('./middlewares')
const {dbInstance, models} = require('./db')
const {User} = models


const app = express()
const PORT = process.env.PORT || 3000

passport.use(jwtStrategy)
passport.use(googleStrategy)

app.use(express.json())
app.use(morgan('dev'))


/* 
  GOOGLE AUTHENTICATION WITH PASSPORT
  as you can see both endpoints below are used only to authenticate user using Google 
  and then giving them standard token as if user was authenticated by native (login+password) method
  redirecting user to this endpoint will send him to google authentication page
*/
app.get('/auth/google', passport.authenticate('google', { scope: ['openid', 'profile', 'email'], session: false }))


// this callback is invoked after user successfully passes authentication
app.get('/auth/google/callback', passport.authenticate('google', { scope: ['openid', 'profile', 'email'], session: false }), (req, res) => {
  /*
    since google login requires user interaction - you won't be able to pass token back usual way in a request response
     one of the ways to handle it - is to redirect user to frontend with token as a query parameter which then can be stored and user can be logged in
     the other way - use cookies
  */
  return res.redirect(`${process.env.HOST}/auth?token=${req.user.token}`)
})


// "dumb" example of frontend
app.get('/auth', (req, res) => res.sendFile(__dirname + '/index.html'))
app.get('/profile', (req, res) => res.sendFile(__dirname + '/profile.html'))

// NATIVE AUTHENTICATION WITH PASSPORT

app.post('/register', async (req, res) => {
  const {login, password, type = 0} = req.body
  const user = await User.findOne({where: {login}})
  if (user) {
    return res.status(400).json({message: "User already exists"})
  }
  // for demonstrative purposes only, you MUST NOT store plaintext passwords
  const userRecord = await User.create({id: v4(), login, password, type, provider: PROVIDERS.NATIVE})
  const rawUser = userRecord.get({plain: true})
  
  const token = generateToken(rawUser)

  return res.json({token})
})

// this route should be accessible to all authenticated users either with federated login (google) or native (login + password)
app.get('/secret', passport.authenticate('jwt', {session: false}), (req,res) => {
  return res.json({user: req.user})
})

/* this route should b accessible to authorized users only (admin for example)
  in this scenario passport is used to AUTHENTICATE user and checkAccess is used to AUTHORIZE user
*/
app.get('/secret/admin', passport.authenticate('jwt', {session: false}), checkAccess(USER_TYPES.ADMIN), (req, res) => {
  return res.json({message: "User is an admin", user: req.user})
})



app.listen(PORT, () => {
  return dbInstance.sync()
    .then(() => console.log(`listening on :${PORT}`))
    .catch((err) => console.log(err))
})

