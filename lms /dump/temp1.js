if (typeof req.cookie.loggedin !== 'undefined' && req.cookie.loggedin == true) {

      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write('<script language="javascript">');
      res.write('window.open(\'profile.php\',\'_self\')');

      res.end(</script>);
		}

    if (
         typeof req.body.reg !== 'undefined'  &&

      )
//db connect
      var con = mysql.createConnection(db.dbconn());
      con.connect(function(err) {
        if (err) throw err;
        console.log("db lms Connected!");

        var sql = "SELECT * FROM users WHERE user_email=?";
        con.query(sql, [email, MD5pass], function(err, data) {
          if (err) throw err;

        });
      });

      -------------------------------------------------------------------------------
