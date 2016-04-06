var crypto = require('crypto'),
    User = require('../models/user.js');
module.exports = function(app) {
  /**
   * 设计：
   * /login ： 用户登录
   * /reg : 用户注册
   * /post : 发表文章
   * /logout : 登出
   */
  app.get('/', function(req, res) {
    res.render('index', {title : '成飞',
      supp :['mop', 'broom', 'duster']});
  });
  app.get('/reg', function(req, res) {
    res.render('reg',{ title : '注册'});
  });
  app.post('/reg', function(req, res) {
    var name = req.body.name,
        password = req.body.password,
        passwordRepeate = req.body.passwordRepeate;
    if(password != passwordRepeate) {
      return res.redirect('/reg');
    }
    //生成MD5加密
    var md5 = crypto.createHash('md5'),
        password = md5.update(password).digest('hex');
    var newUser = new User({
      name: name,
      password:password,
      email:req.body.email
    });
    User.get(newUser.name, function(err,user) {
      if(err) {
        return res.redirect('/');
      }
      console.log(JSON.stringify(user));
      if(user) {
        return res.redirect('/reg');
      }
      //如果不存在新增用户
      newUser.save(function(err, user) {
        if(err) {
          return res.redirect('/reg');
        }
        //用户信息存入session
        req.session.user = user;
        console.log("穿件成");
        res.redirect('/');
      });
    });
  });
  app.get('/login', function(req, res) {
    res.render('login', {title : '登录'});
  });
  app.post('login', function(req, res) {

  });
  app.get('/post', function(req, res) {
    res.render('post', {title : '发表'});
  });
  app.post('/post', function(req, res) {

  });
  app.get('/logout', function(req, res) {
  });
}