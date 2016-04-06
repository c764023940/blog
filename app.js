var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
//添加session支持
var session = require('express-session');
var settings = require('./settings');
//添加flash 页面通知
var flash = require('connect-flash');
//var users = require('./routes/users');

var MongoStore  = require('connect-mongo')(session);
var app = express();

// 设置views文件夹为存放视图文件的目录；__dirname为全局变量，存储当前正在执行脚本所在的目录
app.set('views', path.join(__dirname, 'views'));
//设置视图模板引擎为ejs
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//加载日志中间件
app.use(logger('dev'));
//加载解析json的中间件
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);
routes(app);
app.listen(app.get('port'), function() {
  console.log('Express server listening on port' + app.get('port'));
});
app.use(session({
  secret: settings.cookieSecret,
  key:settings.db,//cookie名字
  cookie: {maxAge: 1000*60*60*24*30},//30天
  store: new MongoStore({
    db: settings.db,
    host: settings.host,
    port: settings.port
  })
}));
//使用flash
app.use(flash());
// 捕捉404错误并转发到错误处理器
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
