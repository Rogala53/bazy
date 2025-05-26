<?php
include_once 'classes/User.php';
include_once 'classes/Db_handler.php';
session_start();
try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $raw_data = file_get_contents("php://input");
        $data = json_decode($raw_data, true);

        if (!$data || !isset($data["username"]) || !isset($data["password"])) {
            throw new Exception("Nieprawidłowe dane wejściowe");
        }

        $username = $data['username'];
        $password = $data['password'];
        if(!isset($_SESSION['user'])) {
            $_SESSION['user'] = new User($username, $password);

        }
        $db_handler = new Db_handler('localhost', 'serwisIT');
        $user = $_SESSION['user'];
        $success = $db_handler->connect($user);
        if($success) {
            $user->set_role($db_handler->get_role($user));
            $username = $user->get_username();
            $_SESSION['user'] = $user;
            echo json_encode(['success' => true, 'username' => $username]);
        } else {
            unset($_SESSION['user']);
            unset($_SESSION['role']);
            echo json_encode(['success' => false]);
        }
    }
} catch (Exception $e) {
    header("Content-type: application/json");
    echo json_encode(['success' => false, 'message' => pg_last_error()]);
}