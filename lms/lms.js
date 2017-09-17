
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
var db = require('./dbconfig.js');
var lib = require('./libs/phpfn.js')



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

//server-listening port
var server = app.listen(3000,function(){
console.log('the server started on 3000');
});

//home page request
app.get('/', function(req, res) {
  console.log('index: started');
  res.render('index',{js_alert_src:''});
  console.log('index: ended');
});

app.post('/reg', function(req, res) {
 console.log('reg started');
  var sess = req.cookies;
  if (typeof sess.loggedin !== 'undefined' && sess.loggedin == true) {
console.log('redirect reg to pro');
  res.redirect('/profile');
    console.log('check1');
  }

  if (typeof req.body.reg !== 'undefined' && typeof req.body.user !== 'undefined' &&
    typeof req.body.pass !== 'undefined' && typeof req.body.user !== '' && typeof req.body.pass !== '') {


    var pass = req.body.pass;
    var passMD5 = crypto.createHash('md5').update(pass).digest("hex");
    var user = req.body.user;

    var con = mysql.createConnection(db.dbconn());
    con.connect(function(err) {
      if (err) throw err;
      console.log("db Connected!: id check");

      var sql = "SELECT * FROM users WHERE user_email=?";
      con.query(sql, [user], function(err, data) {
        if (err) throw err;
        // db if id already stored and else part

        console.log('db query:id check  already there');
        if (data.length != 0) {
          if (data[0].user_email == user) {
            console.log('db id already taken part!');
            res.writeHead(200, {
              'Content-Type': 'text/html'
            });
            res.write('<script language="javascript">');
            res.write('alert("User Id Already Taken!");');
            res.write('</script>');
            res.end();
          }
        } else {
          sql = "INSERT INTO users VALUES ('',?,?)";
          con.query(sql, [user, passMD5], function(err, data) {
            if (err) throw err;
            console.log('db query:id create successful');

            if (data.affectedRows == 1) {


              res.render('index',{js_alert_src:'alert(\'Successfully Registered!\');'});


            } else {
              console.log('db query:id id insert failed!');

              res.writeHead(200, {
                'Content-Type': 'text/html'
              });
              res.write('<script language="javascript">');
              res.write('alert("Something Went Wrong!");');
              res.write('</script>');
              res.end();
            }
          });
        }
      });
    });
  }
  console.log('reg ended');
});



app.get('/logout',function(req,res){
  console.log('logout started !');
  if (typeof req.cookies.loggedin !== 'undefined') {
    cookie = req.cookies;
        for (var prop in cookie) {
            if (!cookie.hasOwnProperty(prop)) {
                continue;
            }
            res.cookie(prop, '', {expires: new Date(0)});
        }
        res.redirect('/');
  }
  else {
    res.redirect('/');

  }
  console.log('logout ended!');
});

var login= require("./controllers/login.js");
app.post('/login_script', function(req,res){
  login.login_script(req,res);
});





var profile= require("./controllers/profile.js");

    app.get ('/profile',function (req,res){profile.profile_controller(req,res)}
);
