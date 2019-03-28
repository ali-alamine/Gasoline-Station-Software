<?php
header("Access-Control-Allow-Origin: *");
// open connection
function openConn(){
	$servername = "localhost";
	$username = "root";
	$password = "root_ess";
	$db = "gasoline_station";
	$conn = mysqli_connect($servername, $username, $password, $db);
	mysqli_set_charset($conn,'utf8');
	mysqli_query($conn,"SET collation_connection=utf8_general_ci");
	return $conn;
}
// close connection
function closeConn(){
	$closConnection = mysqli_close(openConn());
	return $closConnection;
}
 ?>