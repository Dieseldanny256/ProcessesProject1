<?php
require 'db.php';

// This step is to extract JSON data from client
$data = json_decode(file_get_contents("php://input"), true);

// Kiểm tra đầu vào
if (!isset($data['userid'], $data['keyword'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing required fields (userid or keyword)"
    ]);
    exit;
}

$userid = $data['userid'];
$keyword = $data['keyword'];

// This is to check if the data is empty
if (empty($userid) || empty($keyword)) {
    echo json_encode([
        "status" => "error",
        "message" => "UserID and keyword cannot be empty"
    ]);
    exit;
}

// This is to search for the contact in the database
$stmt = $conn->prepare("
    SELECT * FROM Contacts 
    WHERE UserID = :userid 
    AND (FirstName LIKE :keyword OR LastName LIKE :keyword OR Phone LIKE :keyword OR Email LIKE :keyword)
");
$searchKeyword = "%" . $keyword . "%";
$stmt->bindParam(':userid', $userid);
$stmt->bindParam(':keyword', $searchKeyword);

$stmt->execute();

// This step is returning the result
if ($stmt->rowCount() > 0) {
    $contacts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode([
        "status" => "success",
        "contacts" => $contacts
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "No contacts found"
    ]);
}
?>
