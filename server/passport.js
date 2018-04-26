const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { Strategy, ExtractJwt } = require('passport-jwt')
const GooglePlusTokenStrategy = require('passport-google-plus-token')
const FacebookTokenStrategy = require('passport-facebook-token')

const config = require('./config')
const User = require('./models/user')

// JSON WEB TOKEN STRATEGY
passport.use(new Strategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.JWT_SECRET
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.sub)
    if (!user) {
      return done(null, false)
    }

    done(null, user)
  } catch (err) {
    done(err, false)
  }
}))

// JSON WEB TOKEN LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ 'local.email': email })

    if (!user) {
      return done(null, false)
    }

    const isMatch = await user.isValidPassword(password)

    if (!isMatch) {
      return done(null, false)
    }

    done(null, user)
  } catch (err) {
    done(err, false)
  }
}))

// GOOGLE OAUTH STRATEGY
passport.use('googleToken', new GooglePlusTokenStrategy({
  clientID: config.oauth.google.clientID,
  clientSecret: config.oauth.google.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Should have full user profile over here
    console.log('profile', profile)
    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)

    const existingUser = await User.findOne({ 'google.id': profile.id })
    if (existingUser) {
      return done(null, existingUser)
    }

    const newUser = new User({
      method: 'google',
      google: {
        id: profile.id,
        email: profile.emails[0].value
      }
    })

    await newUser.save()
    done(null, newUser)
  } catch (err) {
    done(null, false, err.message)
  }
}))

// FACEBOOK OAUTH STRATEGY
passport.use('facebookToken', new FacebookTokenStrategy({
  clientID: config.oauth.facebook.clientID,
  clientSecret: config.oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Should have full user profile over here
    console.log('profile', profile)
    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)

    const existingUser = await User.findOne({ 'facebook.id': profile.id })
    if (existingUser) {
      return done(null, existingUser)
    }

    const newUser = new User({
      method: 'facebook',
      facebook: {
        id: profile.id,
        email: profile.emails[0].value
      }
    })

    await newUser.save()
    done(null, newUser)
  } catch (err) {
    done(null, false, err.message)
  }
}))
