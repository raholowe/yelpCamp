const mongoose = require('mongoose');
const campGround= require('../models/campground')
const cities= require('./cities')
const {places, descriptors} =require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelpcamp')
const db= mongoose.connection;

//callback for if ther is an errror
db.on("error", console.error.bind(console,"connection error:"))

//call back for first connection to database
db.once("open", ()=>{
  console.log("Database Connected")
})

const samp=(arr)=> arr[Math.floor(Math.random()*arr.length)];
  

const seedDatabse = async ()=>{
  await campGround.deleteMany({})
  for(let i =0; i<50;i++){
    const random1000= Math.floor(Math.random()*1000)
    const newCamp=new campGround({
      location: `${cities[random1000].city} , ${cities[random1000].state}`,
      title:`${samp(descriptors)} ${samp(places)}`
    })
    await newCamp.save()
  }
}

seedDatabse()
.then(()=>{
  mongoose.connection.close()
});