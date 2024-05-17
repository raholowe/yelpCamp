const express=require('express')
const router =express.Router({mergeParams: true})
const catchAsync= require('../utils/catchAsync')
const ExpressError= require('../utils/ExpressError')
const passport = require('passport')
const { storeReturnTo } = require('../middleware');
const user=require('../controllers/users')

// show the registration page
//add the new user to the database
router.route('/register')
  .get(user.registerPage)
  .post(catchAsync(user.registerNewUser))

//show the login page
// login the user
router.route('/login')
  .get(user.login)
  .post(storeReturnTo,passport.authenticate('local', {failureFlash:true,failureRedirect:'login'}),user.authenticateLogin)

//logout the user
router.get('/logout', user.logout)

module.exports = router