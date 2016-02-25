<?php
include 'config.php';

	// establishing the MySQLi connection
	if (mysqli_connect_errno()){
		echo "MySQLi Connection was not established: " . mysqli_connect_error();
	}

	// checking the user
	if(isset($_POST['login'])){
	$email = mysqli_real_escape_string($conn,$_POST['email']);
	$pass = mysqli_real_escape_string($conn,$_POST['pass']);
	$MD5pass=  md5($pass);
	$sel_user = "select * from users where user_email='$email' AND user_pass='$MD5pass'";
	$run_user = mysqli_query($conn, $sel_user);
	$check_user = mysqli_num_rows($run_user);
	if($check_user>0){
		setcookie("loggedin", 1, time()+3600);  /* expire in 1 hour */
		setcookie("username", $email, time()+3600);  /* expire in 1 hour */
		echo "<script>window.open('profile.php','_self')</script>";
	}
	else {
		echo "<script>alert('Email or password is not correct, try again!')</script>";
		echo "<script>window.open('index.php','_self')</script>";
	}
}
?>