const mongoose = require('mongoose');
const Review=require('./review')
const Schema =mongoose.Schema;
const User=require('./user')

const imageSchema=new Schema({
  url: String,
  filename: String
})

imageSchema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload','/upload/w_200')
})

const campGroundSchema= new Schema({
  title: String,
  images:  [imageSchema],
  geolocation:{
    type:{
      type:String,
      enum:['Point'],
      required:true
    },
    coordinates:{
      type: [Number],
      required:true
    }
  },
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