var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser'); 

var createSlackEventAdapter = require('@slack/events-api').createSlackEventAdapter;
var slackEvents = createSlackEventAdapter(process.env.SLACK_VERIFICATION_TOKEN);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var standupRouter = require('./routes/standup')

var app = express();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/standup', standupRouter);
app.use('/slack/events', slackEvents.expressMiddleware());

slackEvents.on('message', (event)=> {
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
});
slackEvents.on('error', console.error);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
