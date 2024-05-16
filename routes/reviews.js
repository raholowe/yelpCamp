const express=require('express')
const router =express.Router({mergeParams: true})
const catchAsync= require('../utils/catchAsync')
const ExpressError= require('../utils/ExpressError')
const campGround= require('../models/campground')
const Review= require('../models/review')
const {campgroundSchema, reviewSchema}= require('../schemas')
const {validateReview , isLoggedin , isReviewAuthor}=require('../middleware')



router.post('/',validateReview,isLoggedin, catchAsync(async (req,res)=>{
  const campground= await campGround.findById(req.params.id);
  const review = new Review(req.body.review)
  review.author=req.user._id
  campground.reviews.push(review)
  await review.save()
  await campground.save()
  req.flash('success',"Review Created")
  res.redirect(`/campgrounds/${campground.id}`)
}))
//delete review and remove the refrence from the campground
router.delete('/:reviewId',isLoggedin,isReviewAuthor, catchAsync(async(req,res,)=>{
  await campGround.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.reviewId}})
  await Review.findByIdAndDelete(req.params.reviewId)
  req.flash('success','Successfully Deleted Review')
  res.redirect(`/campgrounds/${req.params.id}`)
  
}))

module.exports = router;