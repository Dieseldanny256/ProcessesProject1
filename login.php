<?php
require 'db.php';

// Receiving JSON data from clients
$data = json_decode(file_get_contents("php://input"), true);

// This step is to check the input
if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing username or password"
    ]);
    exit;
}

$username = $data['username'];
$password = $data['password'];

// This step is to check the input is empty
if (empty($username) || empty($password)) {
    echo json_encode([
        "status" => "error",
        "message" => "Username and password cannot be empty"
    ]);
    exit;
}

// This step is to use database to check password and username
$stmt = $conn->prepare("SELECT * FROM Users WHERE Login = :username AND Password = :password");
$stmt->bindParam(':username', $username);
$stmt->bindParam(':password', $password);
$stmt->execute();

// This step is to handle the result
if ($stmt->rowCount() > 0) {
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode([
        "status" => "success",
        "user" => $user
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid credentials"
    ]);
}
?>
