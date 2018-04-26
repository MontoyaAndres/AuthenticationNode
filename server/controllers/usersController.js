const JWT = require('jsonwebtoken')
const User = require('../models/user')
const { JWT_SECRET } = require('../config')

const signToken = user => {
  return JWT.sign({
    iss: 'CodeWorkingBro',
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET)
}

module.exports = {
  async signUp (req, res, next) {
    const { email, password } = req.body

    const foundUser = await User.findOne({ 'local.email': email })
    if (foundUser) {
      return res.status(403).json({ error: 'Email is already in use bro' })
    }

    const newUser = new User({
      'method': 'local',
      'local': {
        email,
        password
      }
    })

    await newUser.save()

    const token = signToken(newUser)

    res.status(200).json({ token })
  },

  async signIn (req, res, next) {
    const token = signToken(req.user)
    res.status(200).json({ token })
  },

  async googleOAuth (req, res, next) {
    const token = signToken(req.user)
    res.status(200).json({ token })
  },

  async facebookOAuth (req, res, next) {
    const token = signToken(req.user)
    res.status(200).json({ token })
  },

  async secret (req, res, next) {
    res.json({ secret: 'resource' })
  }
}
