const express=require('express')
const router =express.Router()
const catchAsync= require('../utils/catchAsync')
const ExpressError= require('../utils/ExpressError')
const campGround= require('../models/campground')
const {campgroundSchema, reviewSchema}= require('../schemas')
const {isLoggedin,isAuthor,validateCampground}=require('../middleware')



 // initial view all campgrounds route
 router.get('/' , catchAsync(async(req,res)=>{
  const campgrounds= await campGround.find({})
  res.render('campgrounds/index',{campgrounds})


}))

//view the create new campoground page
router.get('/new',isLoggedin,(req,res)=>{

  res.render('campgrounds/new')
})

//add a new campground to the database and show it
router.post('/new',isLoggedin, validateCampground,catchAsync(async(req,res)=>{
  const camp= new campGround(req.body.campground)
  camp.author= req.user._id
  await camp.save()
  req.flash('success',"Successfully Added Campground")
  res.redirect(`/campgrounds/${camp.id}`)
}))


//initial view specific campground route
router.get('/:id', catchAsync(async (req,res)=>{
  const {id}= req.params
  const camp= await campGround.findById(id).populate('reviews').populate('author')
  if (!camp){
    req.flash('error',"Campground does not exist")
    res.redirect('/campgrounds')
  }
  res.render('campgrounds/show',{camp})
}))

//update a camp ground page
router.get('/:id/edit',isLoggedin,isAuthor, catchAsync(async (req,res)=>{
  const {id}= req.params
  const camp= await campGround.findById(id)
  res.render(`campgrounds/edit`,{camp})
}))

//update the campground in the database then show
router.put('/:id',isLoggedin,isAuthor,validateCampground,catchAsync( async(req,res,next)=>{
  const {id}= req.params
  const camp= await campGround.findByIdAndUpdate(id,{...req.body.campground},{runValidators:true, new:true})
  req.flash('success', 'Successfully Updated Campground')
  res.redirect(`/campgrounds/${camp.id}`)
  

}))

router.delete('/:id',isLoggedin, isAuthor,catchAsync(async(req,res)=>{
  const {id}= req.params
  const camp= await campGround.findByIdAndDelete(id)
  res.redirect('/campgrounds')
}))

//export the campground router
module.exports = router;