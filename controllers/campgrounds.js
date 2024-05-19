const Campground= require('../models/campground')

//show all campgrounds
module.exports.index=async(req,res)=>{
  const campgrounds= await Campground.find({})
  res.render('campgrounds/index',{campgrounds})
}

//new campground page
module.exports.new =(req,res)=>{
  res.render('campgrounds/new')
}

//create and add campground to database
module.exports.Createnew =async(req,res)=>{
  const camp= new Campground(req.body.campground)
  camp.images=req.files.map((f)=>({url:f.path, filename:f.filename}))
  camp.author= req.user._id
  await camp.save()
  console.log(camp)
  req.flash('success',"Successfully Added Campground")
  res.redirect(`/campgrounds/${camp.id}`)
}

//show a single campground
module.exports.showCampground=async (req,res)=>{
  const {id}= req.params
  const camp= await Campground.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('author')
  if (!camp){
    req.flash('error',"Campground does not exist")
    res.redirect('/campgrounds')
  }
  res.render('campgrounds/show',{camp})
}

// show the campground edit page
module.exports.campgroundEdit=async (req,res)=>{
  const {id}= req.params
  const camp= await Campground.findById(id)
  res.render(`campgrounds/edit`,{camp})
}

//update the campground in the database
module.exports.updateCampground=async(req,res,next)=>{
  const {id}= req.params
  const camp= await Campground.findByIdAndUpdate(id,{...req.body.campground},{runValidators:true, new:true})
  req.flash('success', 'Successfully Updated Campground')
  res.redirect(`/campgrounds/${camp.id}`)
}
//destroy ther campground in the database
module.exports.destroyCampground=async(req,res)=>{
  const {id}= req.params
  const camp= await Campground.findByIdAndDelete(id)
  res.redirect('/campgrounds')
}