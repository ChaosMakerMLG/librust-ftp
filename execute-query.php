<?php

header('Content-Type: application/json');

require 'vendor/autoload.php';

/* ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL); */

// Check if required GET parameters exist
if (isset($_GET['client_ip'], $_GET['token'])) {
    $client_ip = $_GET['client_ip'];
    $token = $_GET['token'];
    $email = $_GET['email'];
    $table_name = "credentials_" . $token;

    // Database connection
    $conn = mysqli_connect('localhost', 'admin1', 'zaq1@WSX', 'student_system');

    // Check for connection error
    if (!$conn) {
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . mysqli_connect_error()]);
        exit;
    }

    // Use dynamic table name carefully
    $query = "SELECT login, passwd FROM `" . mysqli_real_escape_string($conn, $table_name) . "` WHERE host = ?";
    $stmt = $conn->prepare($query);

    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Query preparation failed: ' . $conn->error]);
        $conn->close();
        exit;
    }

    // Bind parameters and execute query
    $stmt->bind_param('s', $client_ip);
    $stmt->execute();
    $result = $stmt->get_result();

    // Fetch the result
    if ($result && $row = $result->fetch_assoc()) {
        $response = [
            'status' => 'success',
            'login' => $row['login'],
            'passwd' => $row['passwd']
        ];
    } else {
        $response = ['status' => 'no_results', 'message' => 'No credentials found for the given host.'];
    }

    // Clean up
    $stmt->close();
    $conn->close();

    // Send the JSON response
    echo json_encode($response);
} else {
    // Missing required parameters
    echo json_encode(['status' => 'error', 'message' => 'Missing required parameters (client_ip, token)']);
}
