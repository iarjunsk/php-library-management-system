<?php

if (isset($_COOKIE['loggedin'])) {
    unset($_COOKIE['username']);
    unset($_COOKIE['loggedin']);
	setcookie('loggedin', '', time()-300); 
	setcookie('username', '', time()-300); 	
} 
echo "<script>window.open('index.php','_self')</script>";
?>