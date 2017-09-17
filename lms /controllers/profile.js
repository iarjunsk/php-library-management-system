
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

exports.profile_controller = function(req,res){
      console.log(req.query);
      res.writeHead(200, {'Content-Type': 'text/html'});
    //redirects to login page if user is not yet logged in
      console.log('profile started');
    //COOKIE username is global here
      var username= req.cookies.username;
      if ((typeof req.cookies.loggedin === 'undefined' || req.cookies.loggedin == 0) && typeof req.cookies.username === 'undefined' )
         {
            res.render('index');
        }

        else
        {
        //For Adding Bookcases

        if (typeof req.query.ADDBOOK    !== 'undefined' &&
            typeof req.query.BOOKCASE    !== 'undefined' &&
            typeof req.query.SHELFCOUNT  !== 'undefined' &&
            typeof req.query.SHELFCAP    !== 'undefined' &&
                   req.query.BOOKCASE    != ''           &&
                   req.query.SHELFCOUNT  != ''           &&
                   req.query.SHELFCAP    != ''        ) {

          //var username= req.cookies.username;
          var bookcase= req.query.BOOKCASE;
          var shelf_count= req.query.SHELFCOUNT;
          var shelf_cap= req.query.SHELFCAP;

          var con = mysql.createConnection(db.dbconn());
          con.connect(function(err) {
            if (err) throw err;
            var sql = "INSERT INTO bookcases  (user_email, bookcase, shelf_count,shelf_cap)VALUES (?,?, ?,?)";
            con.query(sql, [username,bookcase,shelf_count,shelf_cap], function(err, data) {
              if (err) throw err;
              console.log('db query:profile  uname bookcase selfcount shelfcap :INSERT');
            });
          });
}


        //for adding books


          if(typeof req.query.ADDBOOK  !== 'undefined'  &&typeof req.query.D1 !== 'undefined'        &&
              typeof req.query.D2  !== 'undefined'       &&typeof req.query.D3  !== 'undefined'       &&
              typeof req.query.D4  !== 'undefined'       &&typeof req.query.D5  !== 'undefined'       &&
              typeof req.query.D6  !== 'undefined'&&
              req.query.D2 != ''       &&req.query.D3 != ''       &&
              req.query.D4 != ''       &&req.query.D5 != ''       &&req.query.D6 != ''       &&
              req.query.D2 != 'Title'  &&req.query.D3 != 'Author' &&
              req.query.D4 != 'Genre'  &&req.query.D5 != 'ISBN'   &&req.query.D6 != 0  ) {


            console.log('iam inside');
            //list[0]->bookcase,   list[1]->shelf_id

            var list = lib.explode("-", req.query.D1, 2);
            var bookcase = list[0];
            var shelf_id = list[1];

            var title  =req.query.D2;
            var author =req.query.D3;
            var gener  =req.query.D4;
            var isbn   =req.query.D5;
            var price  =req.query.D6;



              //For checking if the shelf is full or not
              var con = mysql.createConnection(db.dbconn());

              con.connect(function(err) {
                if (err) throw err;

                var count,limit;
                var sql = "SELECT * FROM books  WHERE user_email=? and bookcase=? and shelf_id=?"
                con.query(sql, [username, bookcase,shelf_id], function(err, data) {
                  if (err) throw err;
                  console.log('db query:profile  uname bookcase selfid :select');
                  var count=data.length;
                  var sql = "SELECT shelf_cap FROM   bookcases  WHERE  user_email=? and bookcase=?"  ;
                  con.query(sql, [username, bookcase], function(err, data) {
                    if (err) throw err;
                    console.log('db query:profile  uname bookcase :select');
                    var limit= data[0].shelf_cap;
                    if(count>=limit){

                    res.write('<script language="javascript">');
                    res.write('alert("This Shelf is full! Try other Shelfs.")');
                    res.write('</script>');


                    }
                    //end of checking if the shelf is full
                    else{console.log('aaaaaaaasdasdsadasdasdsadasdsadasdsadasdasd:    '+username);
                      sql = "INSERT INTO books  (user_email,bookcase, shelf_id, title,author,gener,isbn,price)VALUES (?,?,?,?,?,?,?,?) ";
                        con.query(sql, [username, bookcase,shelf_id,title,author,gener,isbn,price], function(err, data) {
                          if (err) throw err;
                          console.log('db query:profile  is self_full! :select');
                          if( data.affectedRows)
                          console.log('New record created successfully');

                        });
                      }
                    });
                  });
                });
              }





        //for deleting bookcase
        if (typeof req.query.DELBOOKCASE  !== 'undefined' &&
            typeof req.query.del          !== 'undefined' &&
            typeof req.query.del          != '' )
            {

            var str=req.query.del;
            var bookcase=str.trim();

            var username=req.cookies.username;

            var con = mysql.createConnection(db.dbconn());
            con.connect(function(err) {
              if (err) throw err;
              var sql = "UPDATE  books SET bookcase='heap' where  user_email=? AND bookcase=?";
              con.query(sql, [username,bookcase], function(err, data) {
                if (err) throw err;
                console.log('db query:profile book case emailid ! :update');
                if( data.affectedRows){}
                sql = "DELETE FROM bookcases WHERE user_email=? AND bookcase=?";
               con.query(sql, [username,bookcase], function(err, data) {
                 if (err) throw err;
                 if( data.affectedRows){console.log('db query:profile  bookcase :delete');}
               });
              });
            });
          }



        var t=`<html lang="en-US">
                <head>
                <meta charset="utf-8">
                <meta http-equiv="Content-Type" content="text/html">
                <title>User Profile</title>
                <link rel="stylesheet" type="text/css" media="all" href="./css/styles_profile.css">
                <script type="text/javascript" src="./js/jquery-1.10.2.min.js"></script>
                </head>

                <body>
                <div id="topbar">
                <a  href="logout"  style="float: right;margin-right:30px;">Log Out</a>
                </div>

                <div id="w">
                <div id="content" class="clearfix">
                <h1> User Profile </h1>
                <nav id="profiletabs">
                <ul class="clearfix">
                <li><a href="#activity">Bookcases</a></li>
                <li><a href="#friends">Heaps</a></li>
                <li><a href="#settings">Profile</a></li>
                </ul>
                </nav>


                <!-- BookCases -->
                <section id="activity">
                <div class="title_box" >
                <div id="title"><b>Add BookCase <b></div>
                <div id="content">

                <!-- Form for Adding Bookcases -->
                <table width="50%" border="1" cellpadding="1" cellspacing="1" class="test">
                <tr>
                <td>Bookcase Name</td>
                <td>Shelf Count</td>
                <td>Shelf Capacity</td>
                </tr>
                <form method="GET"  action="/profile">
                <tr>
                <td><input type="text" class="txtbox" value="" name="BOOKCASE" /></td>
                <td><input type="text" class="txtbox" value="" name="SHELFCOUNT" /></td>
                <td><input type="text" class="txtbox" value="" name="SHELFCAP"/></td>
                <td><input type="submit" value="Add" name="ADDBOOK" /></td>
                </tr>
                </form>
                </table>
                <!-- Table for Bookcase -->
                <form method="GET"  action="/profile">
                <table class="hovertable">
                <tr>
                <th>Bookcase Name</th><th>Shelf Count</th><th>Shelf Capacity</th><th>   </th>
                </tr>`;

                  // sequential db acccess
                  var pool =  mysql.createPool(db.dbconn());


                  var a='',b='',c='',i=0,n=0, d='',e='',f='',g='';

                  //Dynamically filling Data into the Table Bookcase

                  console.log("db dynamic update Connected! profile:"+username);

                  var sql = "SELECT * FROM   bookcases  WHERE  user_email=?";
                  pool.query(sql, [username], function(err, data) {
                  if (err) throw err;
                  console.log('db query:profile  username :select');
                  res.write(t);
                  if(data.length==0)
                  {
                  res.write('No rows found');
                  }
                  else{  a='',b='',c='',i=0,n=data.length;
                  while (i<n) {
                  a= data[i].bookcase;
                  b= data[i].shelf_count;
                  c= data[i].shelf_cap;
                  res.write(`
                  <tr onmouseover=\"this.style.backgroundColor='#ffff66';\" onmouseout=\"this.style.backgroundColor='#d4e3e5';\">
                  <td>`+a+`</td>
                  <td>`+b+`</td>
                  <td>`+c+`</td>
                  <td><input name="del" type=\"radio\" value=\" `+a+` \"></td>
                  </tr>`);
                  i++;
                  }
                  }
                  res.write(`
                  </table>
                  <input type="submit" value="Delete BookCase" name="DELBOOKCASE" />
                  </form>
                  </div>
                  <!-- Form for Adding Books  -->
                  <div class="title_box" >
                  <div id="title"><b>Add Books to Your BookCase<b></div>
                  <div id="content">

                  <form method="GET"  action="/profile">
                  <table width="70%" border="1" cellpadding="1" cellspacing="1" class="test">
                  <tr>
                  <td>Select Book Case</td>
                  </tr>

                  <tr>
                  <td>
                  <select  name="D1" style="width: 142px"  >
                  `);

                  //Dynamically filling the combo box  with Bookcases
                  sql = "SELECT * FROM   bookcases  WHERE  user_email =?";
                  pool.query(sql, [username], function(err, data) {
                  console.log('db query:profile  username :select');
                  if (err) console.log(err);
                  if(data.length==0)
                  {
                  res.write('No rows found');
                  }
                  else{  a='',b=0,c=0,i=0,n=data.length;
                  while (i<n) {
                  b=data[i].bookcase;
                  c=data[i].shelf_count;
                  for(var r=1;r<= c;r++){
                  res.write( ` <option value=\"`+ b+`-`+r +`\">`+b+` , Shelf`+ r+` </option> `);
                  }
                  i++;
                  }
                  }
                  res.write(`</select></td>
                    <td><input name="D2" value="Title" onfocus="if (this.value == "Title") this.value=''"/></td>
                    <td><input name="D3" value="Author" onfocus="if (this.value == "Author") this.value=''"/></td>
                    </tr>
                    <tr>
                    <td><input name="D4" value="Genre" onfocus="if (this.value == "Genre") this.value=''"/></td>
                    <td><input name="D5" value="ISBN" onfocus="if (this.value == "ISBN") this.value=''"/></td>
                    <td><input name="D6" value="Last Price" onfocus="if (this.value == "Last Price") this.value=''"/></td>
                    </tr>
                    <tr>
                    <td><input type="submit" value="Add" style="width:142px; margin-top: 10px;margin-bottom: 10px;  " name="ADDBOOK" /></td>
                    </tr>
                    </table>
                    </form>
                    <!-- Table For the Books -->
                    <table class="hovertable"    style="width:570px;">
                    <tr><th>Bookcase</th><th>Shelf_ID</th><th> Title  </th><th>Author   </th><th> Gener  </th><th>ISBN   </th><th> Price  </th></tr>`);



                  //filling data into the table Books
                  sql = "SELECT * FROM   books   WHERE  user_email = ? and bookcase NOT LIKE 'heap'  order by bookcase";
                  pool.query(sql, [username], function(err, data) {
                    console.log('db query:profile  filling bookdetails:select');
                  if (err) throw err;
                  if(data.length==0)
                  {
                  res.write('No rows found');
                  }
                  else{  a='',b='',c='', d='',e='',f='',g='',i=0,n=data.length;
                  while (i<n){
                  a= data[i].bookcase;
                  b= data[i].shelf_id;
                  c= data[i].title;
                  d= data[i].author;
                  e= data[i].gener;
                  f= data[i].isbn;
                  g= data[i].price;

                  res.write(' <tr onmouseover=\"this.style.backgroundColor=\'#ffff66\';\" onmouseout=\"this.style.backgroundColor=\'#d4e3e5\';\"> \
                  <td>'+a+'</td>\
                  <td>'+b+'</td>\
                  <td>'+c+'</td>\
                  <td>'+d+'</td>\
                  <td>'+e+'</td>\
                  <td>'+f+'</td>\
                  <td>'+g+'</td></tr>\
                  ');
                  i++;
                  }

                  }
                  res.write(`</table></div></section>
                    <!-- Heap -->
                  <section id="friends" class="hidden"> <div class="title_box" >
                  <div id="title"><b>Heap<b></div> <div id="content">
                  <!-- Table for Heap --> <table class="hovertable">
                  <tr><th> Title</th> <th>Author    </th> <th> Gener    </th>
                  <th>ISBN   </th> <th> Price  </th></tr>`);

                  //filling data into the table Books
                  sql = "SELECT * FROM   books   WHERE  user_email = ? AND bookcase='heap' ";
                  pool.query(sql, [username], function(err, data) {
                  if (err) throw err;
                  console.log('db query:profile  filling table book :select');
                  if(data.length==0)
                  {
                  res.write('No rows found');

                  }
                  else{  a='',b='',c='', d='',e='',f='',g='',i=0,n=data.length;
                  while (i<n){

                  c= data[i].title;
                  d= data[i].author;
                  e= data[i].gener;
                  f= data[i].isbn;
                  g= data[i].price;

                  res.write( `<tr onmouseover=\"this.style.backgroundColor='#ffff66';\" onmouseout=\"this.style.backgroundColor='#d4e3e5';\">
                  <td>`+c+`</td>
                  <td>`+d+`</td>
                  <td>`+e+`</td>
                  <td>`+f+`</td>
                  <td>`+g+`</td>
                  </tr>`);
                  i++;
                  }

                  }


                  res.write(`</table></div></section><!-- About Me -->
                  <section id="settings" class="hidden">
                  <p>Your Details</p>`);

                  var count1=0,count2=0,count3=0;
                  sql =  "SELECT * FROM books  WHERE user_email=?  and  bookcase not like \"heap\" ";
                  pool.query(sql, [username], function(err, data) {
                  if (err) throw err;
                  console.log('db query:count1 :select');
                  count1=data.length;
                  sql = "SELECT * FROM books  WHERE user_email=?  and  bookcase like  \"heap\" " ;
                  pool.query(sql, [username], function(err, data) {
                  if (err) throw err;
                  console.log('db query:count1 :select');
                  count2=data.length;
                  sql = "SELECT * FROM books  WHERE user_email=?  " ;
                  pool.query(sql, [username], function(err, data) {
                  if (err) throw err;
                  console.log('db query:count1 :select');
                  count3=data.length;
                  res.write(`  <p class='setting'><span>E-mail Address </span>`+ username+`</p>
                               <p class='setting'><span>Number of Books in BookCase  </span> `+count1 +`</p>
                               <p class='setting'><span>Number of Books in Heap  </span> `+count2 +`</p>
                               <p class='setting'><span>Total Number of Books  </span> `+count3 +`</p>
                               </section>
                  </div><!-- @end #content -->
                  </div><!-- @end #w -->
                  <script type='text/javascript'>
                  $(function(){
                  $('#profiletabs ul li a').on('click', function(e){
                  e.preventDefault();
                  var newcontent = $(this).attr('href');

                  $('#profiletabs ul li a').removeClass('sel');
                  $(this).addClass('sel');

                  $('#content section').each(function(){
                  if(!$(this).hasClass('hidden')) { $(this).addClass('hidden'); }
                  });

                  $(newcontent).removeClass('hidden');
                  });
                  });
                  </script></body></html>`);
                  console.log('profile ended!');
                  res.end();

                               });
                             });
                            });
                          });
                        });
                      });

                                                        });
                                                      }
                                                    }
