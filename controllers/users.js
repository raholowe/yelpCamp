const User= require('../models/user')

//show register user page
module.exports.registerPage=(req,res)=>{
  res.render('users/register')
}

//add user to database
module.exports.registerNewUser=async (req,res,next)=>{
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
}

//show login page
module.exports.login=(req,res)=>{
  res.render('users/login')
}

module.exports.authenticateLogin=(req,res)=>{
  req.flash('success', "Logged In")
  const redirectUrl = res.locals.returnTo || '/campgrounds';
  delete req.session.returnTo
  console.log(redirectUrl)
  res.redirect(redirectUrl)
}

module.exports.logout=(req,res)=>{
  req.logOut(function(err){
    if(err){
      return next(err)
    }
    req.flash('success', 'Logged Out!')
    res.redirect('/campgrounds')
  })
}