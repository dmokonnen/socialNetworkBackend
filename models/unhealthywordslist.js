const Joi = require('joi');
const mongoose = require('mongoose');

const unhealthyWordsSchema = new mongoose.Schema({

  wordlist: [{
    type: String, 
    require:true,  
    unique:true 
  }]  
});

const UnhealthyWords = mongoose.model('UnhealthyWords', unhealthyWordsSchema);

function validateUnhealthy(unhealthyWords) {
  const schema = {
    wordlist: Joi.array().min(1).max(255)
  };
  return Joi.validate(unhealthyWords, schema);
}

exports.UnhealthyWords = UnhealthyWords; 
exports.validateUnhealthylist = validateUnhealthy;