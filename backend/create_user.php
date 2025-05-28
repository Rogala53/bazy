<?php
include_once 'classes/Db_handler.php';
include_once 'classes/User.php';
session_start();
if($_SERVER['REQUEST_METHOD'] == 'POST') {
    try {
        $raw_data = file_get_contents("php://input");
        $data = json_decode($raw_data, true);
        if (!$data || !isset($data["username"]) || !isset($data["password"]) || !isset($data["role"])) {
            throw new Exception("Nieprawidłowe dane wejściowe");
        }
        $username = $data['username'];
        $password = $data['password'];
        $role = $data['role'];
        $user = $_SESSION['user'];
        $db_handler = new Db_handler('localhost', 'serwisIT');
        $db_handler->connect($user);
        $success = $db_handler->create_account($username, $password, $role);
        if(!$success) {
            throw new Exception("Nie udało się utworzyć konta.");
        }
        echo json_encode(['success' => true]);
    } catch(Exception $e) {
        echo json_encode(['success' => false, 'message' => pg_last_error()]);
    }
}
    