var express = require('express'),
    routes = require('./routes');

var app = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'recengine' }));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/index', routes.index);

app.get('/', routes.index);

app.get('/login', routes.login);

app.get('/register', routes.register);

app.get('/logout', routes.logout);

app.get('/forgot', routes.forgotPassword);

app.post('/register', routes.register_post_handler);

app.post('/login', routes.login_post_handler);

app.post('/forgot', routes.forgot_post_handler);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

