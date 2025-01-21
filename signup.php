<?php
require 'db.php'; 

$data = json_decode(file_get_contents("php://input"), true);

// This step is to help me debig the received data
if (!$data) {
    error_log("Debug: No data received or invalid JSON format.");
    echo json_encode([
        "status" => "error",
        "message" => "No data received or invalid JSON format"
    ]);
    exit;
}

// Checking all the neccessities
if (!isset($data['firstname']) || !isset($data['lastname']) || !isset($data['username']) || !isset($data['password'])) {
    error_log("Debug: Missing fields - " . print_r($data, true));
    echo json_encode([
        "status" => "error",
        "message" => "Missing required fields"
    ]);
    exit;
}

// This step is to collect data from JSON
$firstname = $data['firstname'];
$lastname = $data['lastname'];
$username = $data['username'];
$password = $data['password'];

// This step is to debug, again
error_log("Debug: Received data - Firstname: $firstname, Lastname: $lastname, Username: $username");

// This step is to take information from database
$stmt = $conn->prepare("SELECT * FROM Users WHERE Login = :username");
$stmt->bindParam(':username', $username);
$stmt->execute();

// This step is to check if the username exists
if ($stmt->rowCount() > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Username already exists"
    ]);
    exit;
}

// This step is to add a new user
$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (:firstname, :lastname, :username, :password)");
$stmt->bindParam(':firstname', $firstname);
$stmt->bindParam(':lastname', $lastname);
$stmt->bindParam(':username', $username);
$stmt->bindParam(':password', $password);
$stmt->execute();

echo json_encode([
    "status" => "success",
    "message" => "User registered successfully"
]);
?>
