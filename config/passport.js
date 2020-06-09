const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load user module
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField : 'email' }, (email, password, done) => {
            // Find a user
            User.findOne({ email : email })
                .then(user => {
                    if(!user){
                        return done(null, false, { message : 'That email is not registered'});
                    }

                    // Match password to found User
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;
                        if(isMatch){
                            return done(null, user);
                        }
                        else{
                            return done(null, false, { message : 'Password does not match' });
                        }
                    });
                })
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) => {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}