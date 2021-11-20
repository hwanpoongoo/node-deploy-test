var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const session = require('express-session');
const logger = require('./logger');

const hpp = require('hpp');
const helmet = require('helmet');

const redis = require('redis');
const RedisStore = require('connect-redis')(session);



dotenv.config();
const redisClient = redis.createClient({
  url:`redis://${process.env.REDIS_HOST}:${process.env.REDISPORT}`,
  password : process.env.REDIS_PASSWORD,  
})


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadRouter = require('./routes/uploads');

const {sequelize} = require('./models');

var app = express();

sequelize.sync({force:false})
.then(() => {
  logger.info('데이터베이스 연결되었음');
})
.catch((err)=> {
  console.error(err);
});






// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false ,
    httpOnly : true
  },
  store : new RedisStore({client:redisClient}),
}))

if(process.env.NODE_ENV === 'production'){
  app.use(require('morgan')('combined'));
  app.use(helmet({contentSecurityPolicy:false}));
  app.use(hpp());
}else{
  app.use(require('morgan')('dev'));
}


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/uploads', uploadRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  logger.error(err.message);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
