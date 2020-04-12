const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');
const accStatus = require('../constants/accstatus');

const userSchema = new mongoose.Schema({
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true
  },
	userName: {
		type: String,
		trim: true,
		required: true,
		unique: true,
	},
  birthDate: {
    type: Date,
    required: true,
    // pattern = 'dd-MM-yyyy'
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
  },
  profilePic:{
    //TODO : add default profile pic
    type:String
  },
  address:[
    {
      //TODO add pattern to zipcode
      country:String,
      state:String,
      city:String,
      zipcode:String
        // pattern: '^[0-9]{5}(?:-[0-9]{4})?$' //"12345" and "12345-6789");       
    }
  ],
  followers:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  following:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  accountStatus:{
    type:String,
    default:accStatus.ACTIVE
  },
  isAdmin:{
    type:Boolean,
    default:false
  }, 
  unhealthyPostNo:{
    type:Number,
    default:0
  } 
});

userSchema.methods.generateAuthToken = function() { 

  //INCLUDE: user_id, admin_status and privateKey as TOKEN PAYLOAD
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    lastName: Joi.string().min(2).max(50).trim().required(),
    firstName: Joi.string().min(2).max(50).trim().required(),
    userName: Joi.string().min(2).max(50).trim().required(),
    // birthday must be a valid ISO-8601 date
    // dates before Jan 1, 2000 are not allowed ~ min user age 20
    birthDate: Joi.date().max('1-1-2000').iso(),
    email: Joi.string().min(5).max(255).trim().required().email(),
    password: Joi.string().min(8).max(255).required(),
    profilePic: Joi.string(),
    address: Joi.array().items(({
                country: Joi.string().required(),
                state:   Joi.string().required(),
                city :   Joi.string().required(),
                zipcode: Joi.string().required()
              // regex(/^[0-9]{5}(?:-[0-9]{4})?$/)
    })),
    accountStatus:Joi.string(),
    isAdmin: Joi.boolean()
  };
  return Joi.validate(user, schema);
}
exports.User = User; 
exports.validate = validateUser;