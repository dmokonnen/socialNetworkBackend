const Joi = require('joi');
const bcrypt = require('bcrypt');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  
  //validate at the client first
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

    //check the email
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

    //check the password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  //USER ID : json web token in the user model
  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(8).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router; 