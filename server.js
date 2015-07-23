var express       = require('express');
var app           = express();
var morgan        = require('morgan');
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var config        = require('./config/settings')
var path          = require('path');

var passport      = require('passport')
var flash         = require('connect-flash');
var cookieParser  = require('cookie-parser');
var session       = require('express-session')

// Configure Passport
// require('./config/passport')(passport);

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

mongoose.connect(config.database)

// set static files location
app.use(express.static(__dirname + '/public'));

// Required for Passport
// app.use(session({ secret: config.secret }));
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(flash());

// Routes
var apiRoutes = require('./app/routes/user')(app, express)
app.use('/api', apiRoutes);
// require('./app/routes/player.js')(app)
// require('./app/routes/user.js')(app, passport)

// MAIN CATCHALL ROUTE - SEND USERS TO ANGULAR
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// Start Server
app.listen(config.port);
console.log('Welcome to Fantasy Big Brother on port ' + config.port);
