<?php 
session_start();
header('Content-Type: application/json');
require 'db.php';


// Query untuk mendapatkan status log pesan
$query = "SELECT id, status FROM log_pesan";
$result = $conn->query($query);

$statusData = array();

while ($row = $result->fetch_assoc()) {
    $statusData[] = $row;
}

echo json_encode($statusData);

?>
