<?php
    include 'connect.php';
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
        $table_data = $db_handler->get_table_view($table_name);
        echo json_encode(['success' => true, 'data' => $table_data]);
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}