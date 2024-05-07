//initialze npm packages
const express=require('express');
const app= express();
const path= require('path');
const mongoose = require('mongoose');
const ejsMate= require('ejs-mate')
const campGround= require('./models/campground')
const methodOverride= require('method-override')

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

//test Connection
app.get('/',(req,res)=>{
  res.render('home')
})
//initial create a new campground route
app.get('/campgrounds/new',(req,res)=>{
  res.render('campgrounds/new')
})

 // initial view all campgrounds route
app.get('/campgrounds' , async(req,res)=>{
  const campgrounds= await campGround.find({})
  res.render('campgrounds/index',{campgrounds})

})
app.post('/campgrounds/new', async (req,res)=>{
  const camp= new campGround(req.body.campground)
  await camp.save()
  res.redirect(`/campgrounds/${camp.id}`)
})


//initial view specific campground route
app.get('/campgrounds/:id', async (req,res)=>{
  const {id}= req.params
  const camp= await campGround.findById(id)
  res.render('campgrounds/show',{camp})
})

//update routes
app.get('/campgrounds/:id/edit', async (req,res)=>{
  const {id}= req.params
  const camp= await campGround.findById(id)
  res.render(`campgrounds/edit`,{camp})
})
app.put('/campgrounds/:id',async(req,res)=>{
  const {id}= req.params
  const camp= await campGround.findByIdAndUpdate(id,{...req.body.campground},{runValidators:true, new:true})
  res.redirect(`/campgrounds/${camp.id}`)
})

//delete route
app.delete('/campgrounds/:id',async(req,res)=>{
  const {id}= req.params
  const camp= await campGround.findByIdAndDelete(id)
  res.redirect('/campgrounds')
})






app.listen(3000,()=>{
  console.log('Listening on port 3000')
})