const express=require('express')
const router =express.Router()
const catchAsync= require('../utils/catchAsync')
const ExpressError= require('../utils/ExpressError')
const campgrounds= require('../controllers/campgrounds')
const {campgroundSchema, reviewSchema}= require('../schemas')
const {isLoggedin,isAuthor,validateCampground}=require('../middleware')



 // initial view all campgrounds route
 router.get('/' , catchAsync(campgrounds.index))

//view the create new campoground page
router.get('/new',isLoggedin,campgrounds.new)

//add a new campground to the database and show it
router.post('/new',isLoggedin, validateCampground,catchAsync(campgrounds.Createnew))

//initial view specific campground route
router.get('/:id', catchAsync(campgrounds.showCampground))

//update a camp ground page
router.get('/:id/edit',isLoggedin,isAuthor, catchAsync(campgrounds.campgroundEdit))

//update the campground in the database then show
router.put('/:id',isLoggedin,isAuthor,validateCampground,catchAsync(campgrounds.updateCampground ))

//delete the campground from the database
router.delete('/:id',isLoggedin, isAuthor,catchAsync(campgrounds.destroyCampground))

//export the campground router
module.exports = router;