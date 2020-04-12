const _ = require('lodash');
const accStatus = require('../constants/accstatus');
const {User, uservalidate} = require('../models/user');
const {Advertisement, advertvalidate} = require('../models/advertisement');
const {UnhealthyWords, validateUnhealthylist} = require('../models/unhealthywordslist');

//render data for users view
exports.getUsers = async  (req, res,next) => {
    const users = await User.find().sort('name');
    res.send(users);
};
exports.deleteUser = async (req,res)=>{
    
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send('The user with the given ID was not found.');
  
    res.send(user);};
exports.deactivateUser = async (req,res,next)=>{
          // use joi and validate the body contents(email, password....) are valid
          const { error } = uservalidate(req.body); 
          if (error) return res.status(400).send(error.details[0].message);
      
          const user = await User.findByIdAndUpdate(req.params.id,{
              accountStatus: accStatus.DEACTIVATED
          },{new: true })
      
          if (!user) return res.status(404).send('The user with the given ID was not found.');
          res.send(user);
};
exports.activateUser = async (req,res)=>{
              // use joi and validate the body contents(email, password....) are valid
              const { error } = uservalidate(req.body); 
              if (error) return res.status(400).send(error.details[0].message);
          
              const user = await User.findByIdAndUpdate(req.params.id,{
                  accountStatus: accStatus.ACTIVE
              },{new: true })
          
              if (!user) return res.status(404).send('The user with the given ID was not found.');
              res.send(user);
};

exports.pushAdvert = async (req,res)=>{
  //TODO: uplaod image and get its path!!!

  // use joi and validate the body contents(email, password....) are valid
  const {error}  = advertvalidate(req.body);                      
  //console.log(error.details);

  if (error) return res.status(400).send(error.details[0].message);

  // use loadash's utility method pick and hash the password
  const advert = new Advertisement(_.pick(req.body, ['description','title','targetCity', 'imagesURL',]));
  await advert.save();
  res.send(advert);
};

exports.getAdvert = async (req,res)=>{

    const advert = await Advertisement.find();
    res.send(advert);
};

exports.createUnhealthyWord = async (req,res)=>{
  
   // console.log(req.body);
    const {error}  = validateUnhealthylist(req.body);                      
    if (error) return res.status(400).send(error.details[0].message);

    const unhealthyWords = new UnhealthyWords(_.pick(req.body, ['wordlist']));

    //check if its already created, if not create it
    if(!UnhealthyWords.find()) {
        await unhealthyWords.save();
        return res.send(unhealthyWords);
    }
   // console.log(req.body.wordlist[0]);
    //check if the word already exists if so just return success or already exsist
    let dbInstance = await UnhealthyWords.findOne({ wordlist:req.body.wordlist[0]});

    if(dbInstance) return res.status(400).send('Word already in the list.');

    //if not in the list save it 

    dbInstance = await UnhealthyWords.findOne();
    await UnhealthyWords.updateOne({
                                    _id:dbInstance._id
                                },
                                {
                                    $push:{
                                        wordlist:req.body.wordlist[0]
                                    }
                                },
                                {
                                    upsert:true
                                },function(err){
            if(err){
                    console.log("Updating error: ",err);
            }else{
                    console.log("Successfully added to list");
            } }
            );
    res.send(unhealthyWords);
  };
