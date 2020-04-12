const Joi = require('joi');
const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
  description:{
    type: String,
    required: true,
  
  },
  title:{
    type : String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true
  },
  targetCriteria: {
        type: String,
        required: true
 
  },
  url:{
    type: String,    

  },
  imagesURL: [{
    type: String,    
  }]  
});


const Advertisement = mongoose.model('Advertisement', advertisementSchema);

function validateAdvertisement(advertisement) {
  const schema = {
    description: Joi.string().min(2).max(50).trim().required(),
    title: Joi.string().min(2).max(50).trim().required(),
    targetCity: Joi.string().trim().required(),
    imagesURL: Joi.string().min(5).max(255)
  };
  return Joi.validate(advertisement, schema);
}

exports.Advertisement = Advertisement; 
exports.advertvalidate = validateAdvertisement;