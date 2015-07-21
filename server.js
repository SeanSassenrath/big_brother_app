var express       = require('express');
var app           = express();
var morgan        = require('morgan');
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var port          = process.env.PORT || 1337

var passport      = require('passport')
var flash         = require('connect-flash');
var cookieParser  = require('cookie-parser');
var session       = require('express-session')

mongoose.connect('mongodb://localhost/bigbrotherapp')

// Configure Passport
require('./config/passport')(passport);

// Configuration
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS Configuration
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});

// Log all requests to console
app.use(morgan('dev'));

// Required for Passport
app.use(session({ secret: 'theskyisblue' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes
require('./app/routes/routes.js')(app, passport)

// app.get('/', function(req, res) {
//   res.send('Fantasy Big Brother Home Page')
// });

// // User Routes
// var apiRouter = express.Router();

// apiRouter.get('/', function(req, res) {
//   res.json({ message: 'Testing User Routes' });
// });

// // Register Routes
// app.use('/api', apiRouter);

// Start Server
app.listen(port);
console.log('Welcome to Fantasy Big Brother on port ' + port);
