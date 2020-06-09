const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const app = express();

//Passport config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser:true, useUnifiedTopology:true})
.then(console.log('Successfully connected to DB...'))
.catch(err => console.log(err));

// EJS MiddleWare
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use('/public', express.static(path.join(__dirname, 'static')));

// Bodyparser
// Info from the form is stored in request.body
app.use(express.urlencoded( {extended : false} ));

// Express Session Middleware
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true,
}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    app.locals.success_msg = req.flash('success_msg');
    app.locals.error_msg = req.flash('error_msg');
    app.locals.email = req.flash('email_msg');
    app.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server Started on ${PORT}`));
