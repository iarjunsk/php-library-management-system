
<html>
<head>

</head>
<body>
  <form method="post" action="">
       Host<input type="text" name="host">
       Username<input type="text" name="username">
       Password <input type="password" name="password">
       <input type="submit" value="Go">
  </form>
</body>
</html>






<?php

//Removes the error reporting
error_reporting(E_ERROR);

if( isset($_POST["host"]) && isset($_POST["username"])  )
{
	  if(!empty($_POST["host"]) &&  !empty($_POST["username"])    )
	  {
		  

		  
		$host=$_POST["host"];
		$username=$_POST["username"];
		$password=$_POST["password"];
		
		
		$conn = mysqli_connect("$host", "$username", "$password") ; 

		if (!$conn) {
				echo "Something Went Wrong! Try Again. ";
				die();
		}
		
		$query = "CREATE DATABASE IF NOT EXISTS library";
			
			if(mysqli_query($conn, $query)){
				
				// change the mysql password to ""
				$query2="SET PASSWORD FOR 'root'@'localhost' = PASSWORD('') ";
				mysqli_query($conn, $query2);
				mysqli_close($conn);
				
				$conn = mysqli_connect("localhost", "root", "","library") ;
				
				
				
				// sq1 to create table bookcase
				$sql = "CREATE TABLE IF NOT EXISTS `bookcases` (
						  `user_email` varchar(50) NOT NULL,
						  `bookcase` varchar(50) NOT NULL,
						  `shelf_count` int(5) NOT NULL,
						  `shelf_cap` int(5) NOT NULL
						) ENGINE=InnoDB DEFAULT CHARSET=latin1;";

				mysqli_query($conn, $sql);
				
					
				// sq2 to create table books
				$sq2 = "CREATE TABLE IF NOT EXISTS `books` (
					  `user_email` varchar(20) NOT NULL,
					  `bookcase` varchar(20) NOT NULL,
					  `shelf_id` int(5) NOT NULL,
					  `title` varchar(20) NOT NULL,
					  `author` varchar(20) NOT NULL,
					  `gener` varchar(20) NOT NULL,
					  `isbn` varchar(20) NOT NULL,
					  `price` int(5) NOT NULL
					) ENGINE=InnoDB DEFAULT CHARSET=latin1;";

				mysqli_query($conn, $sq2);
				
				
				// sq3 to create table users
				$sq3 = "CREATE TABLE IF NOT EXISTS `users` (
					  `user_id` int(3) unsigned zerofill NOT NULL AUTO_INCREMENT,
					  `user_email` varchar(20) DEFAULT NULL,
					  `user_pass` varchar(50) DEFAULT NULL,
					  PRIMARY KEY (`user_id`)
					) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;";

				mysqli_query($conn, $sq3);
				
				echo "<script>window.open('index.php','_self')</script>";
		
				
			} 
			else{
				die("Connection failed: " . mysqli_connect_error());
			}

	}
}

?>