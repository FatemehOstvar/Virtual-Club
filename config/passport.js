const LocalStrategy = require('passport-local').Strategy;
const db = require('../models/spectatorModel');
const bcrypt = require('bcryptjs');

module.exports= function(passport) {
    passport.use(new LocalStrategy({usernameField:'username', passwordField:'password'},async (username, password, done) => {
        try{
            const user = await db.checkUserExists(username);
            if(!user){
                return done(null, false, {message: 'User Not Found'});
            }
            const match = await bcrypt.compare(password, user.password);
            if(!match){
                return done(null, false, {message: 'Wrong username or password'});
            }
            else{
                return done(null, user);
            }
        }
        catch(err){
            return done(err, false, {message: err});
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    });
    passport.deserializeUser(async (id, done) => {
        try{
            const user = await db.findById(id);
            done(null, user);

        }
        catch(err){
            return done(err);
        }
    })

}

