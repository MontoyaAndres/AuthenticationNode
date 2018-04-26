const express = require('express')
const router = express.Router()
const passport = require('passport')

const routeHelper = require('../helpers/routeHelper')
const usersController = require('../controllers/usersController')
require('../passport')

router.post('/signup',
  routeHelper.signUp,
  usersController.signUp)

router.post('/signin',
  passport.authenticate('local', { session: false }),
  usersController.signIn)

router.post('/oauth/google',
  passport.authenticate('googleToken', { session: false }),
  usersController.googleOAuth)

router.post('/oauth/facebook',
  passport.authenticate('facebookToken', { session: false }),
  usersController.facebookOAuth)

router.get('/secret',
  passport.authenticate('jwt', { session: false }),
  usersController.secret)

module.exports = router
