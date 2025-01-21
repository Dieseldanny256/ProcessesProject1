<?php
$host = "localhost"; // localhost MySQL address
$dbname = "COP4331";
$username = "root"; // Our MySQL username
$password = "COP4331password"; // This is for our MySQL password

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}
?>
