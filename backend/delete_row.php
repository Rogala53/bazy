<?php
    include("classes/Db_handler.php");
    include("classes/User.php");
    session_start();
    try {
        if (!isset($_SESSION["user"])) {
            header('Location: index.html#login');
            throw new Exception("You are not logged in!");

        }
        if($_SERVER["REQUEST_METHOD"] == "POST") {
            $raw_data = file_get_contents("php://input");
            $data = json_decode($raw_data);
            $id = $data->id;
            $table_name = $data->tableName;
            $user = $_SESSION["user"];
            $role = $user->get_role();
            $db_handler = new Db_handler('localhost', 'serwisIT');
            $db_handler->connect($user);

            $success = $db_handler->delete_record($table_name, $id, $role);
            if($success) {
                echo json_encode(['success' => true, 'message' => "Record successfully deleted"]);
            } else {
                echo json_encode(['success' => false, 'message' => "Failed to delete record"]);
            }
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }