const express=require('express')
const router =express.Router({mergeParams: true})
const catchAsync= require('../utils/catchAsync')
const ExpressError= require('../utils/ExpressError')
const {campgroundSchema, reviewSchema}= require('../schemas')
const {validateReview , isLoggedin , isReviewAuthor}=require('../middleware')
const review=require('../controllers/reviews')



router.post('/',validateReview,isLoggedin, catchAsync(review.createReview))
//delete review and remove the refrence from the campground
router.delete('/:reviewId',isLoggedin,isReviewAuthor, catchAsync(review.destroyReview))

module.exports = router;