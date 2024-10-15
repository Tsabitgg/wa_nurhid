<?php 


if (!isset($_SESSION['logged_in'])) {
    header('Location: login.php');
    exit();
}


$userData = $_SESSION['user_data'];
$username = $userData['username'];

$conn = getDbConnection($userData['host'], $userData['userdb'], $userData['passdb'], $userData['dbname']);
$mainConn = getDbConnection('localhost', 'root', 'Smartpay1ct', 'sendwa');