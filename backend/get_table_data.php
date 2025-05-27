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
        if(array_key_exists('edit', $data)) {
            $from_exact_table = $data['edit'] === 'edit';
        } else {
            $from_exact_table = false;
        }
        $db_handler = new Db_handler('localhost', 'serwisIT');
        $user = $_SESSION['user'];
        $role = $user->get_role();
        $db_handler->connect($user);
        if($from_exact_table){
            $data = $db_handler->get_table_data($role, $table_name);
        } else {
            $data = $db_handler->get_table_view($role, $table_name);
        }
        echo json_encode(['success' => true, 'data' => $data]);
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}