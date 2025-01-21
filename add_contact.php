<?php
require 'db.php'; 

$data = json_decode(file_get_contents("php://input"), true);

// This step is to check all the inputs
if (!isset($data['firstname'], $data['lastname'], $data['phone'], $data['email'], $data['userid'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing required fields"
    ]);
    exit;
}

// This step is extracting data from JSON
$firstname = $data['firstname'];
$lastname = $data['lastname'];
$phone = $data['phone'];
$email = $data['email'];
$userid = $data['userid'];

// This step is to check if the data is empty
if (empty($firstname) || empty($lastname) || empty($phone) || empty($email) || empty($userid)) {
    echo json_encode([
        "status" => "error",
        "message" => "All fields are required"
    ]);
    exit;
}

// This step is to check the email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid email format"
    ]);
    exit;
}

// This step is to add the contact into the database
$stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (:firstname, :lastname, :phone, :email, :userid)");
$stmt->bindParam(':firstname', $firstname);
$stmt->bindParam(':lastname', $lastname);
$stmt->bindParam(':phone', $phone);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':userid', $userid);

if ($stmt->execute()) {
    echo json_encode([
        "status" => "success",
        "message" => "Contact added successfully"
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Failed to add contact"
    ]);
}
?>
