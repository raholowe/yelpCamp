const express=require('express')
const router =express.Router({mergeParams: true})
const catchAsync= require('../utils/catchAsync')
const ExpressError= require('../utils/ExpressError')
const User= require('../models/user')
const passport = require('passport')
const { storeReturnTo } = require('../middleware');

router.get('/register', (req,res)=>{
  res.render('users/register')
})
router.post('/register', catchAsync(async (req,res,next)=>{
  try{
  const{username, email, password}=req.body
  const user= new User({email, username})
  const newuser= await User.register(user, password)
  req.login(newuser,err=>{
    if(err){
      return next(err);
    }
  })
  console.log(newuser)
  req.flash('success','Welcome to Yelp Camp')
  res.redirect('/campgrounds')
  }
  catch(e){
    req.flash('error',e.message)
    res.redirect('register')
  }
}))

router.get('/login',(req,res)=>{
  res.render('users/login')
})
router.post('/login',storeReturnTo,passport.authenticate('local', {failureFlash:true,failureRedirect:'login'}),(req,res)=>{
  req.flash('success', "Logged In")
  const redirectUrl = res.locals.returnTo || '/campgrounds';
  delete req.session.returnTo
  console.log(redirectUrl)
  res.redirect(redirectUrl)
})

router.get('/logout', (req,res)=>{
  req.logOut(function(err){
    if(err){
      return next(err)
    }
    req.flash('success', 'Logged Out!')
    res.redirect('/campgrounds')
  })
})

module.exports = router