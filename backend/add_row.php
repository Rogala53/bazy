<?php
include("classes/Db_handler.php");
include("classes/User.php");
session_start();
try {
    if (!isset($_SESSION['user'])) {
        header("Location: index.html#login");
    }
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $user = $_SESSION["user"];
        $role = $user->get_role();
        $raw_data = file_get_contents("php://input");
        $data = json_decode($raw_data, true);
        $table_name = $data['table_name'];
        $data_to_insert = $data['data_to_insert'];
        $db_handler = new Db_handler('localhost', 'serwisIT');
        $db_handler->connect($user);
        $success = $db_handler->add_record($table_name, $data_to_insert, $role);
        if (!$success) {
            echo json_encode(['success' => false, 'message' => pg_last_error()]);
            return;
        }
        echo json_encode(['success' => true]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}