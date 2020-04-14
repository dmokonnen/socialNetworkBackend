const _ = require("lodash");
const accStatus = require("../constants/accstatus");
const { User, uservalidate } = require("../models/user");
const { Advertisement, advertvalidate } = require("../models/advertisement");
const {
  UnhealthyWords,
  validateUnhealthylist,
} = require("../models/unhealthywordslist");
const CRUDRest = require("./rest");

//render data for users view
exports.getUsers = async (req, res, next) => {
  const users = await User.find().sort("name");
  res.send(users);
};
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user)
    return res.status(404).send("The user with the given ID was not found.");

  res.send(user);
};
exports.deactivateUser = async (req, res, next) => {
  // use joi and validate the body contents(email, password....) are valid
  const { error } = uservalidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      accountStatus: accStatus.DEACTIVATED,
    },
    { new: true }
  );

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  res.send(user);
};
exports.activateUser = async (req, res) => {
  // use joi and validate the body contents(email, password....) are valid
  const { error } = uservalidate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      accountStatus: accStatus.ACTIVE,
    },
    { new: true }
  );

  if (!user)
    return res.status(404).send("The user with the given ID was not found.");
  res.send(user);
};

exports.pushAdvert = async (req, res) => {
  //TODO: uplaod image and get its path!!!

  // use joi and validate the body contents(email, password....) are valid
  const { error } = advertvalidate(req.body);
  //console.log(error.details);

  if (error) return res.status(400).send(error.details[0].message);

  // use loadash's utility method pick and hash the password
  const advert = new Advertisement(
    _.pick(req.body, ["description", "title", "targetCity", "imagesURL"])
  );
  await advert.save();
  res.send(advert);
};

exports.getAdvert = async (req, res) => {
  const advert = await Advertisement.find();
  res.send(advert);
};

/**
 * Create unhealthy word
 *
 * Needs the following request parameter in the post body
 * REQUIRE: {
 *  word: string
 * }
 *
 * RETURN: {
 *  IF SUCCESSFUL: {
 *    id, word, __v
 *  }
 *  IF FAILURE: {
 *    message, code
 * }
 * }
 */
exports.createUnhealthyWord = async (req, res, next) => {
  const { error } = validateUnhealthylist(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  return CRUDRest.create(req, res, next, UnhealthyWords);
};

/**
 * Read unhealthy word
 *
 * Needs nothing except being admin and logged in
 */
exports.getUnhealthyWords = async (req, res, next) => {
  return CRUDRest.getAll(req, res, next, UnhealthyWords);
};

/**
 * Update unhealthy word
 *
 *
 * Needs the id in URL to be updated plus the word in body
 */
exports.updateUnhealthyWord = async (req, res, next) => {
  return CRUDRest.update(req, res, next, UnhealthyWords);
};

/**
 * Delete unhealthy word
 *
 * Need the id in the URL
 */
exports.deleteUnhealthyWord = async (req, res, next) => {
  return CRUDRest.delete(req, res, next, UnhealthyWords);
};
