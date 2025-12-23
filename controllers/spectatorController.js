const spectatorModel = require('../models/spectatorModel');
const {logOut} = require('./sharedController')
const argon2=  require('argon2');
const passport = require('passport')
require('../config/passport')(passport);
const { body, validationResult, matchedData } = require("express-validator");

async function logIn(req, res, next) {
    const { username} = req.body;
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) { // TODO use express-validator. for more tailored errors
            return res.render('login',{pageCss: "auth.css" ,username: username,err: info?.message|| 'Login failed'});
        }
        req.logIn(user, (err)=>{
            if (err) return next(err);
            if(req.user.rolename ===  'admin'){
                console.log("User logged in as admin");
            res.redirect(`/admin/messages`);
            }
            else if(req.user.rolename === 'user'){
            res.redirect(`/user/messages`);
            }
            else if(req.user.rolename === 'spectator'){
            res.redirect(`/messages`);
            }
            else{
                res.redirect('/login');
            }
        })

    })(req, res, next)

}

function viewLogIn(req, res, next) {
    res.render('login',{pageCss: "auth.css" });
}

const validateUser = [
    body('name')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isAlpha()
        .withMessage('Your first name should only consist of alphabets, Enter it again ')
        .isLength({min:2, max:20})
        .withMessage('Your first name should have between 2 and 20 characters'),
    body('lastname')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isAlpha()
        .withMessage('Your last name should only consist of alphabets, Enter it again ')
        .isLength({min:3, max:20})
        .withMessage('Your first name should have between 3 and 20 characters'),
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number')
        .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one symbol'),
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters long')
        .isAlphanumeric().withMessage('Username can only contain letters and numbers')

]

function root(req, res, next) {
    res.redirect('/login');
}
const register = [
    validateUser,
    async (req, res, next) =>{
    const { username, name, lastname, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('sign-up', {
            pageCss: "auth.css" ,
            username: username,
            password: password ,
            nameI: name || "",
            lastname: lastname || "",
            err: errors.array().map(e => `- ${e.msg}`).join("\n")

        })
    }
    try {
        const alreadyExists = await spectatorModel.checkUserExists(req.body.username)
        if(alreadyExists){
            return res.render('sign-up', {
                pageCss: "auth.css" ,
            username: username,
            password: password ,
            nameI: name || "",
            lastname: lastname || "",
                err: ['Username already exists']
            });
        }

        await spectatorModel.addUser({
            username: req.body.username,
            lastName: req.body.lastname,
            firstName: req.body.name,
            plainPassword: req.body.password,
        })
        return logIn(req,res,next)

    }
    catch (err) {
        next(err);
    }

}
]

function viewRegister(req, res, next) {
res.render('sign-up',{
                pageCss: "auth.css" });
}

const CLUB_PASS = process.env.MEMBER_PASSCODE;

async function joinClub(req, res, next) {
try {
    const isCorrect = await argon2.verify(CLUB_PASS, req.body.passkey);
if (!isCorrect) {
    res.render('joinClub',{
                pageCss:"auth.css",err: 'incorrect passkey'});
}
else{
    await spectatorModel.upgradeRole(req.user.id)
    res.redirect(`/user/messages`)}
}
catch (err) {
    next(err);
}
}

function ViewJoinClub(req, res, next) {
res.render('joinClub',{
                pageCss:"auth.css"})
}


async function viewMessages(req, res, next) {
const messages =  await spectatorModel.getAllMessageContent()
    res.render('messages', {
                pageCss:"messages.css",messages: messages , userId:req.user.id,roleName:req.user.rolename, firstName:req.user.firstname, lastName:req.user.lastname});
}


module.exports = {register: register,viewRegister,
    viewLogIn, logIn, viewMessages: viewMessages,ViewJoinClub,root, joinClub: joinClub,logOut: logOut};