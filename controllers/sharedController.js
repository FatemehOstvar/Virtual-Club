
const userModel = require("../models/userModel");


async function logOut(req, res, next) {
  req.logout((err)=>{
  if(err){
      return next(err);
  }
  res.redirect('login');
  });
}




const { body, validationResult, matchedData } = require("express-validator");

const validateMessage = [
    body('title')
        .trim()
        .isLength({ min: 2, max: 20 }).withMessage('Title should be at least 2 characters and at most 20'),
    body('content')
        .trim()
        .isLength({ min: 2, max: 400 }).withMessage('Content should be at most 400 characters'),
]


const createMessage =[
    validateMessage,
    async(req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.render(`newMessage`,{
            pageCss : "newMessage.css",
            err: errors.array().map(e => e.msg).join('\n-'),
            roleName: req.user.rolename,
            firstName: req.user.firstname,
            lastName: req.user.lastname,

        })
    }
    try {
        await userModel.addMessage(req.body, req.user.id)
        return  res.redirect(`messages`)
    }catch(err){
        return next(err);
    }
    }
]

function showNewMessage(req, res){
    res.render('newMessage',{pageCss :'newMessage.css',roleName: req.user.rolename});
}

module.exports = {showNewMessage,logOut,createMessage,createMessage}