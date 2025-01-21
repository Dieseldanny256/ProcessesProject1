<?php

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    // This is a security note: Only POST requests are allowed to ensure safe handling of data.
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode([
            "error" => "Invalid request method. Please use POST.",
            "instructions" => "Send a POST request with JSON body containing id, newFirstName, newLastName, phone, and email."
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
    $id = $inData["id"] ?? null;
    $newFirst = $inData["newFirstName"] ?? null;
    $newLast = $inData["newLastName"] ?? null;
    $phone = $inData["phone"] ?? null;
    $email = $inData["email"] ?? null;

    // This step is to check if there's anything missing
    if (empty($id) || empty($newFirst) || empty($newLast) || empty($phone) || empty($email)) {
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

    // This step is to update the contact
    $stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE ID = ?");
    $stmt->bind_param("ssssi", $newFirst, $newLast, $phone, $email, $id);

    if ($stmt->execute()) {
        returnWithSuccess("Contact updated successfully");
    } else {
        error_log("Failed to execute query: " . $stmt->error);
        returnWithError("Failed to update contact");
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

    // This step is to returing the result in JSON
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
    function returnWithSuccess($message)
    {
        $retValue = '{"message":"' . $message . '","error":""}';
        sendResultInfoAsJson($retValue);
    }

?>
