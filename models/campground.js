const mongoose = require('mongoose');
const Review=require('./review')
const Schema =mongoose.Schema;
const User=require('./user')

const campGroundSchema= new Schema({
  title: String,
  images:  [{
    url: String,
    filename: String
  }],
  price: Number,
  description: String,
  location: String,
  reviews:[{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }],
  author:{
    type: Schema.Types.ObjectId,
    ref:'User'
  }
});

campGroundSchema.post('findOneAndDelete', async function(doc){
  if (doc){
    await Review.deleteMany({
      _id:
    {
      $in: doc.reviews
    }
    })
  }
})

module.exports= mongoose.model('campGround', campGroundSchema)