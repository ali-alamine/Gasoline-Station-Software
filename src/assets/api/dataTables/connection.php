<?php
header("Access-Control-Allow-Origin: *");
// open connection
function openConn(){
	$servername = "localhost";
	$username = "root";
	$password = "mysql";
	$db = "gasoline_station";
	$conn = mysqli_connect($servername, $username, $password, $db);
	mysqli_set_charset($conn,'utf8');
	mysqli_query($conn,"SET collation_connection=utf8_general_ci");
	print "connection is openned" ;
	return $conn;
	
}
// close connection
function closeConn(){
	$closConnection = mysqli_close(openConn());
	print "connection is closed" ;
	return $closConnection;
}
 ?>