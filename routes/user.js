const express=require('express')
const router =express.Router({mergeParams: true})
const catchAsync= require('../utils/catchAsync')
const ExpressError= require('../utils/ExpressError')
const User= require('../models/user')

router.get('/register', (req,res)=>{
  res.render('users/register')
})
router.post('/register', catchAsync(async (req,res)=>{
  try{
  const{username, email, password}=req.body
  const user= new User({email, username})
  const newuser= await User.register(user, password)
  console.log(newuser)
  req.flash('success','Welcome to Yelp Camp')
  res.redirect('/campgrounds')
  }
  catch(e){
    req.flash('error',e.message)
    res.redirect('register')
  }
}))

module.exports = router