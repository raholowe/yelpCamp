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
const campgrounds= require('./routes/campgrounds')
const reviews= require('./routes/reviews')

app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(express.json({ extended: true }));
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/review', reviews)



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


//test Connection
app.get('/',(req,res)=>{
  res.render('home')
})

//middleware
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