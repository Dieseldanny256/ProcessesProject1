<?php

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    // This is a security note: Only POST requests are allowed to ensure safe handling of data.
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode([
            "error" => "Invalid request method. Please use POST.",
            "instructions" => "Send a POST request with JSON body containing firstName, lastName, login, and password."
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
    $login = $inData["login"] ?? null;
    $password = $inData["password"] ?? null;

    // This step is to check if there's anything missing
    if (empty($firstName) || empty($lastName) || empty($login) || empty($password)) {
        error_log("Missing fields: " . json_encode($inData));
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

    // This step is to check if the username has existed
    $stmt = $conn->prepare("SELECT * FROM Users WHERE Login=?");
    $stmt->bind_param("s", $login);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        returnWithError("Username taken");
    } else {
        // This step is to HASH passwords and add user
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES(?,?,?,?)");
        $stmt->bind_param("ssss", $firstName, $lastName, $login, $hashedPassword);

        if ($stmt->execute()) {
            $id = $conn->insert_id;
            $searchResults = '{"id": "' . $id . '"}';
            returnWithInfo($searchResults);
        } else {
            error_log("Failed to execute query: " . $stmt->error);
            returnWithError("Failed to register user");
        }
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
    function returnWithInfo($searchResults)
    {
        $retValue = '{"results":[' . $searchResults . '],"error":""}';
        sendResultInfoAsJson($retValue);
    }

?>
