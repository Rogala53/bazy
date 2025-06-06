<?php
include_once 'classes/User.php';
include_once 'classes/Db_handler.php';
session_start();

    try {
        if($_SERVER["REQUEST_METHOD"] == "GET"){
            $db_handler = new Db_handler('localhost', 'serwisIT');
            $user = $_SESSION['user'];
            $db_handler->connect($user);

            $role = $user->get_role();
            $tables = $db_handler->get_tables_names($role);
            if ($tables == null) {
                echo json_encode(['success', false, 'tables' => null]);
                return;
            }
            echo json_encode(['success' => true, 'tables' => $tables]);
        }
    } catch (exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }