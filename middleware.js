const {campgroundSchema, reviewSchema}=require('./schemas')
const campGround= require('./models/campground')
const ExpressError= require('./utils/ExpressError')
module.exports.isLoggedin= (req,res,next)=>{
  console.log("req.user....",req.user)
  if(!req.isAuthenticated()){
  req.session.returnTo = req.originalUrl; 
  req.flash('error', 'You must be signed in')
  return res.redirect('/login')
}
next()
}

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
      res.locals.returnTo = req.session.returnTo;
  }
  next();
}

//Validate the Data being sent to the database for a new campground
module.exports.validateCampground=(req,res,next)=>{

  const {error}= campgroundSchema.validate(req.body)
  
  if(error){
    const msg=error.details.map(el=>el.message).join(',')
    throw new ExpressError(msg, 400)
  }
  else{
    next();
  }
 
}

module.exports.isAuthor= async(req,res,next)=>{
  const {id}=req.params
  const campground=await campGround.findById(id)
  if(!campground.author.equals(req.user._id)){
    req.flash('error','You do not have permision to do that')
    return res.redirect(`/campgrounds/${id}`)
  }
  next()
}

//validator for the reveiw model
module.exports.validateReview=(req,res,next)=>{
  const {error}= reviewSchema.validate(req.body)
  
  if(error){
    const msg=error.details.map(el=>el.message).join(',')
    throw new ExpressError(msg, 400)
  }
  else{
    next();
  }

}