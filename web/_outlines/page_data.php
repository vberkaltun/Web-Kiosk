<?php
	$conn = new mysqli('localhost','root','root','kiosk');
	if($conn -> connect_error){
		die("Connection error: ". $conn -> connect_error);
	}

	$result = $conn -> query("SELECT * FROM notices WHERE endDate >= CURDATE()");
	if($result -> num_rows > 0){
		while($row = $result -> fetch_assoc()){
            echo "<tr><td>";
			echo $row['content'];
            echo "</td><td><span class='status_outside status_other'><span class='status_inside'>";
            echo $row['endDate'];
            echo "</span></span></td></tr>";
		}
	}
?>
