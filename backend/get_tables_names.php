<?php
    include_once 'connect.php';
    try {
        if($_SERVER["REQUEST_METHOD"] == "GET"){
            $tables = $db_handler->get_tables_names('admin');
            if($tables == null){
                echo json_encode(['success', false, 'tables' => null]);
            }
            echo json_encode(['success' => true, 'tables' => $tables]);
        }
    } catch (exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }