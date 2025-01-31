<?php

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    // This is a security note: Only POST requests are allowed to ensure safe handling of data.
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode([
            "error" => "Invalid request method. Please use POST.",
            "instructions" => "Send a POST request with JSON body containing contactId and userId."
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
    $contactId = $inData["contactId"] ?? null;
    $userId = $inData["userId"] ?? null;

    // This step is to check if there's anything missing
    if (empty($contactId) || empty($userId)) {
        returnWithError("Both contactId and userId are required");
        exit();
    }

    // This step is to connect with the database
    $conn = new mysqli("localhost", "root", "COP4331password", "COP4331");
    if ($conn->connect_error) {
        error_log("Connection failed: " . $conn->connect_error);
        returnWithError("Connection failed: " . $conn->connect_error);
        exit();
    }

    // This is the deleting contact step
    $stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ? AND UserID = ?");
    $stmt->bind_param("ii", $contactId, $userId);

    if ($stmt->execute() && $stmt->affected_rows > 0) {
        returnWithSuccess("Contact deleted successfully");
    } else {
        returnWithError("No matching contact found or failed to delete");
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
    function returnWithSuccess($message)
    {
        $retValue = '{"message":"' . $message . '","error":""}';
        sendResultInfoAsJson($retValue);
    }

?>
