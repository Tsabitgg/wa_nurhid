<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
require 'db.php';


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    if (empty($username) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Username and password are required']);
        exit;
    }

    // $conn = getDbConnection('localhost', 'root', '', 'apiwa');
    $conn = getDbConnection('localhost', 'root', 'Smartpay1ct', 'sendwa');

    $stmt = $conn->prepare("SELECT * FROM master_setting WHERE username = ? AND password = ?");
    if ($stmt === false) {
        error_log("Failed to prepare statement: " . $conn->error);
        echo json_encode(['success' => false, 'message' => 'Database error']);
        exit;
    }

    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $userData = $result->fetch_assoc();
        
        if ($userData['roles'] === 'Client') {
            session_regenerate_id(true); // Menghindari session fixation
            $_SESSION['logged_in'] = true;
            $_SESSION['user_data'] = $userData;
            echo json_encode(['success' => true]);
        } else {
            error_log("User role is not 'Client': $username");
            echo json_encode(['success' => false, 'message' => 'Access denied']);
        }
    } else {
        error_log("Invalid username or password: $username");
        echo json_encode(['success' => false, 'message' => 'Invalid username or password']);
    }

    $stmt->close();
    $conn->close();
} else {
    header('Location: login.php');
    exit;
}
?>
