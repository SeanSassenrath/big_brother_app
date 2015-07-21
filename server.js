var express       = require('express');
var app           = express();
var morgan        = require('morgan');
var bodyParser    = require('body-parser');
var mongoose      = require('mongoose');
var port          = process.env.PORT || 1337

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

// Routes

app.get('/', function(req, res) {
  res.send('Fantasy Big Brother Home Page')
});

// User Routes
var userRouter = express.Router();

userRouter.get('/', function(req, res) {
  res.json({ message: 'Testing User Routes' });
});

// Register Routes
app.use('/users', userRouter);

// Start Server
app.listen(port);
console.log('Welcome to Fantasy Big Brother on port ' + port);
