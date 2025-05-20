<?php
include_once 'connect.php';
include_once 'classes/accounts_handler.php';

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $raw_data = file_get_contents("php://input");
        $data = json_decode($raw_data, true);

        if (!$data || !isset($data["username"]) || !isset($data["password"])) {
            throw new Exception("Nieprawidłowe dane wejściowe");
        }

        $username = $data['username'];
        $password = $data['password'];

        $accounts_handler = new accounts_handler($db_handler->get_connection());
        $result = $accounts_handler->login($username, $password);
        if($result["success"]) {
            session_start();
            $_SESSION['username'] = $username;
            $_SESSION['role'] = $result["role"];
            echo json_encode(['success' => true, 'username' => $username]);
        } else {
            echo json_encode(['success' => false]);
        }
    }
} catch (Exception $e) {
    header("Content-type: application/json");
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}