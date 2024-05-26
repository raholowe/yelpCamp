if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}
//initialze npm packages
const express=require('express');
const app= express();
const path= require('path');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoStore = require('connect-mongo');
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
const mongoSanitize = require('express-mongo-sanitize');
const helmet=require('helmet')
//const dbUrl=process.env.DB_URL
const dbUrl='mongodb://localhost:27017/yelpcamp'
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(express.json({ extended: true }));
app.use(mongoSanitize());

const store=MongoStore.create({
  mongoUrl: dbUrl,
  secret:'tempsecret',
  touchAfter: 24 * 3600
})
store.on('error', function(e){
  console.log('error storing session',e)
})


const sessionConfig ={
  store,
  name:'session',
  secret: 'tempSecret',
  resave:false,
  saveUninitialized:true,
  cookie:{
    httpOnly:true,
    //secure:true,
    expires: Date.now() +1000*60*60*24*7,
    maxAge:1000*60*60*24*7
  }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet())

const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
]
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
]
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
]
const fontSrcUrls = []
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/dzpdeyqbr/",
              "https://images.unsplash.com/",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
)






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
mongoose.connect(dbUrl)
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