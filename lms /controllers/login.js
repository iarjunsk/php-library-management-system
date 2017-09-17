
//library inclusion
var cookieSession = require('cookie-session')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var bodyParser = require('body-parser')
var url = require('url');
var crypto = require('crypto');
var mysql = require('mysql');
var stringify = require('node-stringify');
var path = require('path');
var cookieSession = require('cookie-session');

//user-defined module
var db = require('../dbconfig.js');
var lib = require('../libs/phpfn.js')



//express includes
var express = require('express');
var app = express();
app.set('trust proxy', 1) // trust first proxy

app.use(cookieSession({
   name: 'session',
   keys: ['the beast!'],
   maxAge: 24 * 60 * 60 * 1000
}))

app.use(cookieParser());
app.use(session({
  secret: "the beast!",
  proxy: true,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 3600000 * 5,
    path: "/",
    httpOnly: true,
    secure: true
  }, //30 *4mins
  store: new RedisStore()
}));

// session variable creation and middle wares

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', './views');
app.set('view engine', 'pug');

exports.login_script=function(req, res) {
      console.log('login_script started');

      // checking the user
      if (typeof req.body.login !== undefined) {
        var email = lib.escapestr(req.body.email);
        var pass = lib.escapestr(req.body.pass);
        var MD5pass = crypto.createHash('md5').update(pass).digest("hex");



        var con = mysql.createConnection(db.dbconn());
        con.connect(function(err) {
          if (err) throw err;
          console.log('db profile db :connected!');
        var sel_user = "select * from users where user_email=? AND user_pass = ?";
          con.query(sel_user, [email, MD5pass], function(err, data) {
            if (err) throw err;
            console.log('db query:login cookie set ');
            var run_user = data;
            var check_user = run_user.length;
            if (check_user > 0) {
              res.cookie('loggedin', '1', {maxAge: 3600000});
              res.cookie('username', email, {maxAge: 3600000});
              res.redirect('/profile');
              } else {
              res.render('index',{js_alert_src:'alert(\'Email or password is not correct, try again!\');'});
              res.end();
            }
            console.log ('login script ended');
          });
        });
      }
    }
