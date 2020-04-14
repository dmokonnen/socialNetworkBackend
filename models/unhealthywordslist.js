const Joi = require("joi");
const mongoose = require("mongoose");

const unhealthyWordsSchema = new mongoose.Schema({
  word: {
    type: String,
    require: true,
    unique: true,
  },
});

/**
 * Custom error generator for duplicates
 */
const modelErrorHandler = (error, res, next) => {
  if (error.name === "MongoError" && error.code === 11000) {
    next({ message: "There was a duplicate key error", code: 11000 });
  } else {
    next(); // will still error out
  }
};

unhealthyWordsSchema.post("save", modelErrorHandler); // for create errors

unhealthyWordsSchema.post("update", modelErrorHandler); // for update errors

const UnhealthyWords = mongoose.model("UnhealthyWords", unhealthyWordsSchema);

function validateUnhealthy(unhealthyWords) {
  const schema = {
    word: Joi.string().min(1).max(255).required(),
  };
  return Joi.validate(unhealthyWords, schema);
}

exports.UnhealthyWords = UnhealthyWords;
exports.validateUnhealthylist = validateUnhealthy;
