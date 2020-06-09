const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Model of a User
const User = require('../models/User');

// Login Page (/user/login)
router.get('/login', (req, res) => {
    res.render('login');
});

// Register Page (/user/register)
router.get('/register', (req, res) => {
    res.render('register');
});

// Register Handle
router.post('/register', (req, res) => {
    // Pull Values from the req.body
    const { name, email, password, password2 } = req.body;
    
    let errors = [];
    
    // Check that all fields have values
    if(!name || !email || !password || !password2){
        errors.push({msg : 'Please Fill In All Fields'});
    }

    if(password !== password2){
        errors.push({msg : 'Passwords do not match'});
    }

    if(password.length < 6){
        errors.push({ msg : 'Password Should be atleast 6 characters' });
    }

    if(errors.length > 0){
        // If errors re-render register page w/ warnings
        res.render('register', { 
            // Keep form fields filled
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else{
        //Registration Passed Successfully
        User.findOne({email : email})
            .then(user => {
                if(user){
                    // User Exists
                    errors.push({msg : 'This email is already registered'});
                    res.render('register', {
                        errors,
                        name,
                        email
                    });
                } 
                else {
                    // new instance of User model
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    
                    // Hash User password
                    bcrypt.genSalt(10, (err, salt) => { 
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            // set new user password to hashed password and save
                            newUser.password = hash;
                    
                            //req.flash('success_msg', '');
                            newUser.save()
                                // // If user save redirect to login
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    req.flash('email_msg', email);
                                    res.redirect('/users/login');
                                })
                                .catch(err => {
                                    req.flash('error_msg', 'Something went wrong');
                                }); 
                        });
                    });
                }
            });
    }
});

// Handling the Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect : '/dashboard',
        failureRedirect : '/users/login',
        failureFlash : true
    })(req, res, next);
});

// Loggin Out
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', 'Successfully Logged Out');
    res.redirect('login');
});

module.exports = router;