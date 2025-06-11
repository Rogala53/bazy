<?php
include("classes/Db_handler.php");
include("classes/User.php");
session_start();
try {
    if(!isset($_SESSION["user"])){
        header("Location: index.html#login");
    }
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $raw_data = file_get_contents("php://input");
        $data = json_decode($raw_data,true);
        $table_name = $data['tableName'];
        $data_to_save = $data['dataToSave'];
        $user = $_SESSION["user"];
        $role = $user->get_role();
        $db_handler = new Db_handler('localhost', 'serwisIT');
        $db_handler->connect($user);

        $success = $db_handler->edit_record($table_name, $data_to_save, $role);
        if($success){
            echo json_encode(['success' => true, 'message' => "Record successfully modified"]);
        } else {
            echo json_encode(['success' => false, 'message' => pg_last_error($db_handler->get_connection())]);
        }
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}