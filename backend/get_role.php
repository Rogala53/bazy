<?php
include_once 'classes/User.php';
session_start();
    try {
        if($_SERVER['REQUEST_METHOD'] == 'GET') {
            $user = $_SESSION['user'];
            $role = $user->get_role();
            echo json_encode(['role' => $role]);
        } else {
            throw new Exception("Request method not allowed");
        }
    } catch(Exception $e) {
        http_response_code(404);
        echo json_encode(['error' => $e->getMessage()]);
    }