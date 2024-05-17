//initialze npm packages
const express=require('express');
const app= express();
const path= require('path');
const mongoose = require('mongoose');
const session = require('express-session')
const flash= require('connect-flash')
const ejsMate= require('ejs-mate')
const campGround= require('./models/campground')
const methodOverride= require('method-override')
const catchAsync= require('./utils/catchAsync')
const ExpressError= require('./utils/ExpressError')
const { title } = require('process');
const {campgroundSchema, reviewSchema}= require('./schemas')
const Review= require('./models/review')
const campgroundsRoutes= require('./routes/campgrounds')
const reviewsRoutes= require('./routes/reviews')
const usersRoutes=require('./routes/user')
const passport= require('passport')
const LocalPassport= require('passport-local')
const User= require('./models/user')
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(express.json({ extended: true }));


const sessionConfig ={
  secret: 'tempSecret',
  resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    expires: Date.now() +1000*60*60*24*7,
    maxAge:1000*60*60*24*7
  }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalPassport(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
  res.locals.currentUser=req.user;
  res.locals.success=req.flash('success')
  res.locals.error=req.flash('error')
  next()
})

app.use('/campgrounds', campgroundsRoutes)
app.use('/campgrounds/:id/review', reviewsRoutes)
app.use('/', usersRoutes)

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

//just a fake user creator
app.get('/fakeuser', async (req,res)=>{
  const user= new User({email: 'test@test.com', username:'test'})
  const newuser= await User.register(user, 'password')
  res.send(newuser)
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