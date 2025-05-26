<?php
include_once 'classes/User.php';
include_once 'classes/Db_handler.php';
session_start();
try {
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $raw_data = file_get_contents("php://input");
        $data = json_decode($raw_data, true);
        if ($data == null) {
            throw new Exception("Invalid JSON");
        }

        if(!isset($data["tableName"])){
            throw new Exception("Table name is required");
        }

        $table_name = $data['tableName'];
        $db_handler = new Db_handler('localhost', 'serwisIT');
        $user = $_SESSION['user'];
        $role = $user->get_role();
        $db_handler->connect($user);
        $table_view = $db_handler->get_table_view($role, $table_name);
        if(!is_array($table_view)) {

        }
        echo json_encode(['success' => true, 'data' => $table_view]);
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}