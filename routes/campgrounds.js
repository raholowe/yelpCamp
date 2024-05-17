const express=require('express')
const router =express.Router()
const catchAsync= require('../utils/catchAsync')
const ExpressError= require('../utils/ExpressError')
const campgrounds= require('../controllers/campgrounds')
const {campgroundSchema, reviewSchema}= require('../schemas')
const {isLoggedin,isAuthor,validateCampground}=require('../middleware')



 // initial view all campgrounds route
 router.get('/' , catchAsync(campgrounds.index))

 //add a new campground to the database and show it
 //view the create new campoground page
 router.route('/new')
  .post(isLoggedin, validateCampground,catchAsync(campgrounds.Createnew))
  .get(isLoggedin,campgrounds.new)
  
//initial view specific campground route
//update the campground in the database then show
//delete the campground from the database
router.route('/:id')
  .get(catchAsync(campgrounds.showCampground))
  .put(isLoggedin,isAuthor,validateCampground,catchAsync(campgrounds.updateCampground ))
  .delete(isLoggedin, isAuthor,catchAsync(campgrounds.destroyCampground))

//update a camp ground page
router.get('/:id/edit',isLoggedin,isAuthor, catchAsync(campgrounds.campgroundEdit))

//export the campground router
module.exports = router;