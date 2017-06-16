<?php
	$conn = new mysqli('localhost','root','root','kiosk');
	if($conn -> connect_error){
		die("Connection error: ". $conn -> connect_error);
	}
	$result = $conn -> query("SELECT * FROM notices WHERE endDate >= CURDATE()");
	if($result -> num_rows > 0){
		while($row = $result -> fetch_assoc()){
			echo $row['date'].'<br>';
			echo $row['content'].'<br><br>';
		}
	}
?>