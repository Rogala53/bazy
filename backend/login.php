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
        $password = hash('sha256', $password);
        $user = new User($username, $password);
        $db_handler = new Db_handler('localhost', 'serwisIT');
        $success = $db_handler->connect($user);
        if($success) {
            $user->set_role($db_handler->get_role($user));
            $username = $user->get_username();
            $_SESSION['user'] = $user;
            echo json_encode(['success' => true, 'username' => $username]);
        } else {
            echo json_encode(['success' => false, 'message' => "Nie udało się zalogować"]);
        }
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => "Wystąpił błąd, spróbuj ponownie"]);
}