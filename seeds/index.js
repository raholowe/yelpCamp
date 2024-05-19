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
    const price= Math.floor(Math.random()*30)+10
    const newCamp=new campGround({
      author: '6642731627d71f0e420bc853',
      location: `${cities[random1000].city} , ${cities[random1000].state}`,
      title:`${samp(descriptors)} ${samp(places)}`,
      description:  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos quia deserunt ut. Eveniet sapiente totam vitae, facilis reiciendis necessitatibus commodi quaerat similique! Tenetur, atque! Pariatur tempora veritatis doloremque vero unde?',
      price: price,
      images:[
        {
          url: 'https://res.cloudinary.com/dzpdeyqbr/image/upload/v1716156226/YelpCamp/tcpoknn05g24iqx7fuld.jpg',
          filename: 'YelpCamp/tcpoknn05g24iqx7fuld'
        },
        {
          url: 'https://res.cloudinary.com/dzpdeyqbr/image/upload/v1716156226/YelpCamp/mvs01zbjashkg1b60iep.jpg',
          filename: 'YelpCamp/mvs01zbjashkg1b60iep'
        }
      ]
    })
    await newCamp.save()
  }
}

seedDatabse()
.then(()=>{
  mongoose.connection.close()
});