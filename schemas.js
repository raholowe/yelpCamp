const firstJoi = require('joi');
const sanitizeHTML=require('sanitize-html')


const extension= (joi)=>({
  base: joi.string(),
  type: 'string',
  messages:{
    'string.escapeHTML':'{{#label}} must not inclue HTML!'

  },
  rules:{
    escapeHTML:{
    validate(value, helpers){
      const clean = sanitizeHTML(value,{
        allowedTags:[],
        allowedAttributes:{},
      });
      if (clean!== value) return helpers.error('string.escapeHTML', {value})
        return clean;
    }
  }}
})
Joi= firstJoi.extend(extension)
module.exports.campgroundSchema= Joi.object({
  campground: Joi.object({
    title:Joi.string().required().escapeHTML(),
    price:Joi.number().required().min(0),
    //image:Joi.string().required(),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML()

  }).required(),
  deleteImages: Joi.array()
})


module.exports.reviewSchema= Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(0).max(5),
    body: Joi.string().required().escapeHTML()
    
  }).required()
})