<?php
include 'config.php';

//redirects to login page if user is not yet logged in
if (!isset($_COOKIE['loggedin']) && $_COOKIE['loggedin'] == false) {
    echo "<script>window.open('index.php','_self')</script>";
	exit;
} 

	//COOKIE username is global here
	$username=$_COOKIE['username'];
	
?>



<?php
//For Adding Bookcases

if (isSet($_POST['ADDBCASE']) && 
	isSet($_POST['BOOKCASE']) && isSet($_POST['SHELFCOUNT'])  && isSet($_POST['SHELFCAP'])
	&& $_POST['BOOKCASE'] != ''  && $_POST['SHELFCOUNT'] != ''   && $_POST['SHELFCAP'] != '') {

	$username=$_COOKIE['username'];
	$bookcase=$_POST['BOOKCASE'];
	$shelf_count=$_POST['SHELFCOUNT'];
	$shelf_cap=$_POST['SHELFCAP'];

	$sql = "INSERT INTO bookcases  (user_email, bookcase, shelf_count,shelf_cap)VALUES ('$username', '$bookcase', '$shelf_count','$shelf_cap')";

	if (mysqli_query($conn, $sql)) {echo "New record created successfully";} 
	else {echo "Error: " . $sql . "<br>" . mysqli_error($conn);}
 }
?>



<?php
//for adding books

if (isSet($_POST['ADDBOOK']) && isSet($_POST['D1']) && isSet($_POST['D2']) && isSet($_POST['D3']) && isSet($_POST['D4']) && isSet($_POST['D5'])  && isSet($_POST['D6']) )
{ 
	
	if( $_POST['D2'] != ''   && $_POST['D3'] != '' && $_POST['D4'] != ''  && $_POST['D5'] != ''   && $_POST['D6'] != ''  &&
		$_POST['D2'] != 'Title'  && $_POST['D3'] != 'Author'   && $_POST['D4'] != 'Genre' && $_POST['D5'] != 'ISBN'  && $_POST['D6'] != 0  ) {

		list($bookcase, $shelf_id) = explode("-", $_POST['D1'], 2);
		$title=$_POST['D2'];
		$author=$_POST['D3'];
		$gener=$_POST['D4'];
		$isbn=$_POST['D5'];
		$price=$_POST['D6'];
					
			
	
			//For checking if the shelf is full or not
			$q1 = mysqli_query($conn, "SELECT * FROM books  WHERE user_email=\"$username\" and bookcase=\"$bookcase\" and shelf_id=\"$shelf_id\"  "  ) ;
    		$count=mysqli_num_rows($q1) ;

			
			$q2 = mysqli_query($conn,  "SELECT shelf_cap FROM   bookcases  WHERE  user_email=\"$username\" and bookcase=\"$bookcase\" "  );
			$row = mysqli_fetch_assoc($q2) ;
			$limit=$row['shelf_cap'];
			
			if($count>=$limit){
				echo '<script language="javascript">';
				echo 'alert("This Shelf is full! Try other Shelfs.")';
				echo '</script>';
			}  //end of checking if the shelf is full
			else{

					$sql2 = "INSERT INTO books  (user_email,bookcase, shelf_id, title,author,gener,isbn,price)VALUES ('$username','$bookcase', '$shelf_id', '$title','$author','$gener', '$isbn', '$price') ";

					if (mysqli_query($conn, $sql2)) {echo "New record created successfully";} 
					else {echo "Error: " . $sql2 . "<br>" . mysqli_error($conn);}
			
			}
	}else{//echo 'POST';}
}else {//echo 'ISSET';}
?>


<?php
//for deleting bookcase
if (isSet($_POST['DELBOOKCASE']) && isSet($_POST['del'])&& $_POST['del'] != '' ) {


		$bookcase=trim($_POST['del']);
		
		$username=$_COOKIE['username'];
		
		$sql3 = "UPDATE  books SET bookcase=\"heap\" where  user_email=\"$username\" AND bookcase=\"$bookcase\" ";
		if (mysqli_query($conn, $sql3)) {} 
		else {echo "Error: " . $sql3 . "<br>" . mysqli_error($conn);}
		
		$sql4="DELETE FROM bookcases WHERE user_email=\"$username\" AND bookcase=\"$bookcase\" ";
		echo $sql4;
		if (mysqli_query($conn, $sql4)) {} 
		else {echo "Error: " . $sql4 . "<br>" . mysqli_error($conn);}		
 }
?>






<html lang="en-US">
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Type" content="text/html">
  <title>User Profile</title>
  <link rel="stylesheet" type="text/css" media="all" href="css/styles_profile.css">
  <script type="text/javascript" src="js/jquery-1.10.2.min.js"></script>
</head>

<body>
  <div id="topbar">
  <a  href="logout.php"  style="float: right;margin-right:30px;">Log Out</a>
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
						  <form method="post"  action="">
						  <tr>
							<td><input type="text" class="txtbox" value="" name="BOOKCASE" /></td>
							<td><input type="text" class="txtbox" value="" name="SHELFCOUNT" /></td>
							<td><input type="text" class="txtbox" value="" name="SHELFCAP"/></td>
							<td><input type="submit" value="Add" name="ADDBCASE" /></td>
						  </tr>
						  </form>	
						</table>
						  

							  

						<!-- Table for Bookcase -->
						<form method="post"  action="">	  
						<table class="hovertable">
							<tr>
								<th>Bookcase Name</th><th>Shelf Count</th><th>Shelf Capacity</th><th>   </th>
							</tr>

						<?php
						//Dynamically filling Data into the Table Bookcase
						$result = mysqli_query($conn,  "SELECT * FROM   bookcases  WHERE  user_email = '$username' " );
						if (!$result) {
							echo "Could not successfully run query ($sql) from DB: " . mysql_error();
							exit;
						}
						if (!mysqli_num_rows($result)) {
							echo "No rows found";
						}
						else{
							while ($row = mysqli_fetch_assoc($result)) {
							$a= $row["bookcase"];
							$b= $row["shelf_count"];
							$c= $row["shelf_cap"];
							
							echo " <tr onmouseover=\"this.style.backgroundColor='#ffff66';\" onmouseout=\"this.style.backgroundColor='#d4e3e5';\"> ";
							echo "<td>$a</td>";
							echo "<td>$b</td>";
							echo "<td>$c</td>";
							echo "<td><input name='del' type=\"radio\" value=\" $a \"></td>";
							echo "</tr>";
							}
						}
						?>
						</table>
						<input type="submit" value="Delete BookCase" name="DELBOOKCASE" />
						</form>
</div>


<!-- Form for Adding Books  -->
<div class="title_box" >
<div id="title"><b>Add Books to Your BookCase<b></div>
<div id="content">

									<form method="post"  action="">
									<table width="70%" border="1" cellpadding="1" cellspacing="1" class="test">
									  <tr>
										<td>Select Book Case</td>
									  </tr>
									  
									  <tr>
										<td>
										 <select  name="D1" style="width: 142px"  >
										 <?php
											//Dynamically filling the combo box  with Bookcases
											$result = mysqli_query($conn,  "SELECT * FROM   bookcases  WHERE  user_email = '$username' " );
											if ($result  && mysqli_num_rows($result) ) {
												while ($row = mysqli_fetch_assoc($result)) {
													$b= $row["bookcase"];
													$c= $row["shelf_count"];
													for($i=1;$i<=$c;$i++){
														echo " <option value=\"$b-$i\">$b , Shelf $i </option> ";
													}
												}
										}
										?>
										</select> 
										</td>
										
										<td><input name="D2" value="Title" onfocus="if (this.value == 'Title') this.value=''"/></td>
										<td><input name="D3" value="Author" onfocus="if (this.value == 'Author') this.value=''"/></td>
									  </tr>

									  <tr>
										<td><input name="D4" value="Genre" onfocus="if (this.value == 'Genre') this.value=''"/></td>
										<td><input name="D5" value="ISBN" onfocus="if (this.value == 'ISBN') this.value=''"/></td>
										<td><input name="D6" value="Last Price" onfocus="if (this.value == 'Last Price') this.value=''"/></td>
									  </tr>
									  <tr>
									  <td><input type="submit" value="Add" style="width:142px; margin-top: 10px;margin-bottom: 10px;  " name="ADDBOOK" /></td>
									  </tr>
									  
									</table>
									</form>






									<!-- Table For the Books -->
									<table class="hovertable"    style="width:570px;">
									<tr><th>Bookcase</th><th>Shelf_ID</th><th> Title  </th><th>Author   </th><th> Gener  </th><th>ISBN   </th><th> Price  </th></tr>

									<?php
									//filling data into the table Books
									$result = mysqli_query($conn,  "SELECT * FROM   books   WHERE  user_email = '$username' and bookcase NOT LIKE 'heap'  order by bookcase " );

									if (!$result) {
										echo "Could not successfully run query ($sql) from DB: " . mysql_error();
										exit;
									}
									if (!mysqli_num_rows($result)) {
										echo "No rows found.";

									}
									else{
										while ($row = mysqli_fetch_assoc($result)) {
											
										$a= $row["bookcase"];
										$b= $row["shelf_id"];
										$c= $row["title"];
										$d= $row["author"];
										$e= $row["gener"];
										$f= $row["isbn"];
										$g= $row["price"];
											
										echo " <tr onmouseover=\"this.style.backgroundColor='#ffff66';\" onmouseout=\"this.style.backgroundColor='#d4e3e5';\"> ";
										echo "<td>$a</td>";
										echo "<td>$b</td>";
										echo "<td>$c</td>";
										echo "<td>$d</td>";
										echo "<td>$e</td>";
										echo "<td>$f</td>";
										echo "<td>$g</td>";	
										echo "</tr>";

										}
									}
									?>
									</table>

</div>



	  </section>
 



 <!-- Heap -->
 <section id="friends" class="hidden">


	  
<div class="title_box" >
    <div id="title"><b>Heap<b></div>
    <div id="content">
	
						 <!-- Table for Heap -->
						<table class="hovertable">
						<tr><th> Title  </th><th>Author   </th><th> Gener  </th><th>ISBN   </th><th> Price  </th></tr>

						<?php
						//fill data in table heap dynamically
						$result = mysqli_query($conn,  "SELECT * FROM   books   WHERE  user_email = '$username' AND bookcase='heap' " );

						if (!$result) {
							echo "Could not successfully run query ($sql) from DB: " . mysql_error();
							exit;
						}
						if (!mysqli_num_rows($result)) {
							echo "No rows found";

						}
						else{
							while ($row = mysqli_fetch_assoc($result)) {
							$c= $row["title"];
							$d= $row["author"];
							$e= $row["gener"];
							$f= $row["isbn"];
							$g= $row["price"];
								
							echo " <tr onmouseover=\"this.style.backgroundColor='#ffff66';\" onmouseout=\"this.style.backgroundColor='#d4e3e5';\"> ";
							echo "<td>$c</td>";
							echo "<td>$d</td>";
							echo "<td>$e</td>";
							echo "<td>$f</td>";
							echo "<td>$g</td>";	
							echo "</tr>";

							}
						}
						?>
						</table>
			</div>
      </section>
      

       <!-- About Me -->
      <section id="settings" class="hidden">
        <p>Your Details</p>
        <?php
		
			$q1 = mysqli_query($conn, "SELECT * FROM books  WHERE user_email=\"$username\"  and  bookcase not like \"heap\" "  ) ;
    		$count1=mysqli_num_rows($q1) ;
			
			$q1 = mysqli_query($conn, "SELECT * FROM books  WHERE user_email=\"$username\"  and  bookcase like  \"heap\" "  ) ;
    		$count2=mysqli_num_rows($q1) ;
			
			$q1 = mysqli_query($conn, "SELECT * FROM books  WHERE user_email=\"$username\"  "  ) ;
    		$count3=mysqli_num_rows($q1) ;

		?>
		
		
        <p class="setting"><span>E-mail Address </span><?php echo $username; ?></p>
        
        <p class="setting"><span>Number of Books in BookCase  </span> <?php echo $count1 ?></p>
        
        <p class="setting"><span>Number of Books in Heap  </span> <?php echo $count2 ?></p>
		
        <p class="setting"><span>Total Number of Books  </span> <?php echo $count3 ?></p>		
        
      </section>
    </div><!-- @end #content -->
  </div><!-- @end #w -->
  
  
<script type="text/javascript">
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
</script>


</body>
</html>