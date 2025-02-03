<?php

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    // This is a security note: Only POST requests are allowed to ensure safe handling of data.
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode([
            "error" => "Invalid request method. Please use POST.",
            "instructions" => "Send a POST request with JSON body containing firstName, lastName, phone, email, and userId."
        ]);
        exit();
    }

    $inData = getRequestInfo();

    // This step is to check if the JSON or data is valid
    if ($inData === null) {
        error_log("Raw input received: " . file_get_contents('php://input'));
        returnWithError("Invalid JSON format or no data received");
        exit();
    }

    // This is to plug the data from JSON
    $firstName = $inData["firstName"] ?? null;
    $lastName = $inData["lastName"] ?? null;
    $phone = $inData["phone"] ?? null;
    $email = $inData["email"] ?? null;
    $userId = $inData["userId"] ?? null;

    // This step is to check if there's anything missing
    if (empty($firstName) || empty($lastName) || empty($phone) || empty($email) || empty($userId)) {
        returnWithError("All fields are required");
        exit();
    }

    // This step is to connect with the database
    $conn = new mysqli("localhost", "root", "COP4331password", "COP4331");
    if ($conn->connect_error) {
        error_log("Connection failed: " . $conn->connect_error);
        returnWithError("Connection failed: " . $conn->connect_error);
        exit();
    }

    // This step is to add the contact
    $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssi", $firstName, $lastName, $phone, $email, $userId);

    if ($stmt->execute()) {
        // Retrieve the ID of the newly inserted contact
        $newContactId = $conn->insert_id;
        returnWithSuccess("Contact added successfully", $newContactId);
    } else {
        error_log("Failed to execute query: " . $stmt->error);
        returnWithError("Failed to add contact");
    }

    $stmt->close();
    $conn->close();

    // This step is extracting JSON data from request
    function getRequestInfo()
    {
        $rawData = file_get_contents('php://input');
        error_log("Raw input received: " . $rawData);
        return json_decode($rawData, true);
    }

    // This step is to returning the result in JSON
    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    // This is error function
    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    // This step means success
    function returnWithSuccess($message, $contactId)
    {
        $retValue = '{"message":"' . $message . '","contactId":' . $contactId . ',"error":""}';
        sendResultInfoAsJson($retValue);
    }

?>
