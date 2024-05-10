//initialze npm packages
const express=require('express');
const app= express();
const path= require('path');
const mongoose = require('mongoose');
const ejsMate= require('ejs-mate')
const campGround= require('./models/campground')
const methodOverride= require('method-override')
const catchAsync= require('./utils/catchAsync')
const ExpressError= require('./utils/ExpressError')
const { title } = require('process');
const {campgroundSchema, reviewSchema}= require('./schemas')
const Review= require('./models/review')

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(express.json({ extended: true }));



//set path for views
app.engine('ejs', ejsMate)
app.set('views',path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//connect to mongoose
mongoose.connect('mongodb://localhost:27017/yelpcamp')
const db= mongoose.connection;

//callback for if ther is an errror
//db.on("error", console.error.bind(console,"connection error:"))

//call back for first connection to database
db.once("open", ()=>{
  console.log("Database Connected")
})

const validateCampground=(req,res,next)=>{

  const {error}= campgroundSchema.validate(req.body)
  
  if(error){
    const msg=error.details.map(el=>el.message).join(',')
    throw new ExpressError(msg, 400)
  }
  else{
    next();
  }
 
}

const validateReview=(req,res,next)=>{
  const {error}= reviewSchema.validate(req.body)
  
  if(error){
    const msg=error.details.map(el=>el.message).join(',')
    throw new ExpressError(msg, 400)
  }
  else{
    next();
  }

}

//test Connection
app.get('/',(req,res)=>{
  res.render('home')
})
//initial create a new campground route
app.get('/campgrounds/new',(req,res)=>{
  res.render('campgrounds/new')
})

 // initial view all campgrounds route
app.get('/campgrounds' , catchAsync(async(req,res)=>{
  const campgrounds= await campGround.find({})
  res.render('campgrounds/index',{campgrounds})

}))
app.post('/campgrounds/new', validateCampground,catchAsync(async(req,res)=>{
  // if(!req.body.campground){
  //   throw new ExpressError('Invalid Campground Data',400)
  // }

  const camp= new campGround(req.body.campground)
  await camp.save()
  res.redirect(`/campgrounds/${camp.id}`)
}))


//initial view specific campground route
app.get('/campgrounds/:id', catchAsync(async (req,res)=>{
  const {id}= req.params
  const camp= await campGround.findById(id).populate('reviews')
  res.render('campgrounds/show',{camp})
}))

//update routes
app.get('/campgrounds/:id/edit', catchAsync(async (req,res)=>{
  const {id}= req.params
  const camp= await campGround.findById(id)
  res.render(`campgrounds/edit`,{camp})
}))
app.put('/campgrounds/:id',validateCampground,catchAsync( async(req,res,next)=>{
  
  const {id}= req.params
  const camp= await campGround.findByIdAndUpdate(id,{...req.body.campground},{runValidators:true, new:true})
  res.redirect(`/campgrounds/${camp.id}`)
  

}))

//delete route
app.delete('/campgrounds/:id',catchAsync(async(req,res)=>{
  const {id}= req.params
  const camp= await campGround.findByIdAndDelete(id)
  res.redirect('/campgrounds')
}))


//Route for reviews
//post new Reveiw
app.post('/campgrounds/:id/review',validateReview, catchAsync(async (req,res)=>{
  const campground= await campGround.findById(req.params.id);
  const review = new Review(req.body.review)
  campground.reviews.push(review)
  await review.save()
  await campground.save()
  res.redirect(`/campgrounds/${campground.id}`)
}))
//delete review and remove the refrence from the campground
app.delete('/campgrounds/:id/review/:reviewId', catchAsync(async(req,res,)=>{
  await campGround.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.reviewId}})
  await Review.findByIdAndDelete(req.params.reviewId)
  res.redirect(`/campgrounds/${req.params.id}`)
  
}))

app.all('*' ,(req,res,next)=>{
  next(new ExpressError('Page not Found', 404))
})

app.use((err,req,res,next)=>{
  const {statusCode=500}=err
  if(!err.message){
    err.message='Oh No, Something went Wrong!'
  }
  res.status(statusCode).render('error',{err})
  
})



app.listen(3000,()=>{
  console.log('Listening on port 3000')
})