<?php  
	//Checks if the Database is Configured or Not
	//Removes the error reporting
	error_reporting(E_ERROR);
	$conn = mysqli_connect('localhost', 'root', '', 'library'); 
	if (!$conn) {	
		echo "Your Database is not Configures Yet.  Click Here to ";
		echo "<a href='setup.php'>Configure</a>";
		die();
	}
?>