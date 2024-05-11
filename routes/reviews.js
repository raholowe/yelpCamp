const express=require('express')
const router =express.Router({mergeParams: true})
const catchAsync= require('../utils/catchAsync')
const ExpressError= require('../utils/ExpressError')
const campGround= require('../models/campground')
const Review= require('../models/review')
const {campgroundSchema, reviewSchema}= require('../schemas')

//validator for the reveiw model
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


router.post('/',validateReview, catchAsync(async (req,res)=>{
  const campground= await campGround.findById(req.params.id);
  const review = new Review(req.body.review)
  campground.reviews.push(review)
  await review.save()
  await campground.save()
  res.redirect(`/campgrounds/${campground.id}`)
}))
//delete review and remove the refrence from the campground
router.delete('/:reviewId', catchAsync(async(req,res,)=>{
  await campGround.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.reviewId}})
  await Review.findByIdAndDelete(req.params.reviewId)
  res.redirect(`/campgrounds/${req.params.id}`)
  
}))

module.exports = router;