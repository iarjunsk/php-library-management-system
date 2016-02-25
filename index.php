
<?php 
include 'config.php';


		if (isset($_COOKIE['loggedin']) && $_COOKIE['loggedin'] == true) {
			echo "<script>window.open('profile.php','_self')</script>";
		}
		
    	if (isSet($_POST['reg']) && isSet($_POST['user']) && isSet($_POST['pass']) && $_POST['user'] != '' && $_POST['pass'] != '') {
    		$pass = $_POST['pass'];
    		$passMD5 = md5($pass);
    		$user = $_POST['user'];
    		$q = mysqli_query($conn, "SELECT * FROM users WHERE user_email='$user'"  ) ;
    		if (mysqli_num_rows($q) ){
    			echo '<script language="javascript">';
				echo 'alert("User Id Already Taken!")';
				echo '</script>';
				
    		}else{
    			$qq = mysqli_query($conn, "INSERT INTO users VALUES ('', '$user', '$passMD5')");
    			if ($qq) {
    				echo '<script language="javascript">';
					echo 'alert("Successfully Registered!")';
					echo '</script>';
    			}else{
    				echo '<script language="javascript">';
					echo 'alert("Something Went Wrong!")';
					echo '</script>';
				}			
    	}
	}
    ?>
	
	


<html >
  <head>
    <meta charset="UTF-8">
    <title>Login/Sign-In</title>
    <link rel="stylesheet" href="css/normalize.css">
    <link rel='stylesheet prefetch' href='http://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css'>
    <link rel="stylesheet" href="css/style.css">
  </head>

  
  
  
  <body>

    <div class="logmod">
  <div class="logmod__wrapper">

    <div class="logmod__container">
      <ul class="logmod__tabs">
        <li data-tabtar="lgm-2"><a href="#">Login</a></li>
        <li data-tabtar="lgm-1"><a href="#">Sign Up</a></li>
      </ul>
      <div class="logmod__tab-wrapper">
      <div class="logmod__tab lgm-1">
        <div class="logmod__heading">
          <span class="logmod__heading-subtitle">Enter your personal details <strong>to create an acount</strong></span>
        </div>
        <div class="logmod__form">
		
		
		
          <form method="post" accept-charset="utf-8" class="simform" action="">
            <div class="sminputs">
              <div class="input full">
                <label class="string optional" for="user-name">Email*</label>
                <input name="user" class="string optional" maxlength="255" id="user-email" placeholder="Email" type="email" size="50" />
              </div>
            </div>
            <div class="sminputs">
              <div class="input string optional">
                <label class="string optional" for="user-pw">Password *</label>
                <input name="pass" class="string optional" maxlength="255" id="user-pw" placeholder="Password" type="text" size="50" />
              </div>
              <div class="input string optional">
                <label class="string optional" for="user-pw-repeat">Repeat password *</label>
                <input name="RepeatPass" class="string optional" maxlength="255" id="user-pw-repeat" placeholder="Repeat password" type="text" size="50" />
              </div>
            </div>
            <div class="simform__actions">
              <input class="sumbit" name="reg" type="submit" value="Create Account" />
             </div> 
			 
			 <span class="simform__actions-sidetext"> <a class="special" href="#" target="_blank" role="link">
			 </a></span>  	 
          </form>
		  
		  
		  
		  
		  
		  
        </div> 
      </div>
      <div class="logmod__tab lgm-2">
        <div class="logmod__heading">
          <span class="logmod__heading-subtitle">Enter your email and password <strong>to sign in</strong></span>
        </div> 
        <div class="logmod__form">
		
		
		
		
          <form accept-charset="utf-8"  class="simform" method="post" action="login_script.php"  >
            <div class="sminputs">
              <div class="input full">
                <label class="string optional" for="user-name">Email*</label>
                <input name="email" class="string optional" maxlength="255" id="user-email" placeholder="Email" type="email" size="50" />
              </div>
            </div>
            <div class="sminputs">
              <div class="input full">
                <label class="string optional" for="user-pw">Password *</label>
                <input name="pass" class="string optional" maxlength="255" id="user-pw" placeholder="Password" type="password" size="50" />
                						<span class="hide-password">Show</span>
              </div>
            </div>
            <div class="simform__actions">
              <input name="login" class="sumbit" name="commit" type="submit" value="Log In" />
              <span class="simform__actions-sidetext"></span>
            </div> 
          </form>
		  


		  
		  
        </div> 
            </div>
      </div>
    </div>
  </div>
</div>
    <script src='http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>

        <script src="js/index.js"></script>

    
    
    
  </body>
</html>






