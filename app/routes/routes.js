module.exports = function(app, passport) {

  // Routes

  app.get('/', function(req, res) {
    res.send('Fantasy Big Brother Home Page')
  });

  // User Routes
  var apiRouter = express.Router();

  apiRouter.get('/', function(req, res) {
    res.json({ message: 'Testing User Routes' });
  });

  // Register Routes
  app.use('/api', apiRouter);

}