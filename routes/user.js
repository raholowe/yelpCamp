const express=require('express')
const router =express.Router({mergeParams: true})
const catchAsync= require('../utils/catchAsync')
const ExpressError= require('../utils/ExpressError')
const passport = require('passport')
const { storeReturnTo } = require('../middleware');
const user=require('../controllers/users')

// show the registration page
router.get('/register', user.registerPage)

//add the new user to the database
router.post('/register', catchAsync(user.registerNewUser))

//show the login page
router.get('/login',user.login)

// login the user
router.post('/login',storeReturnTo,passport.authenticate('local', {failureFlash:true,failureRedirect:'login'}),user.authenticateLogin)

//logout the user
router.get('/logout', user.logout)

module.exports = router