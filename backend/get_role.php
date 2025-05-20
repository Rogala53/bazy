<?php
    try {
        if($_SERVER['REQUEST_METHOD'] == 'GET') {
            session_start();
            $role = $_SESSION['role'];
            echo json_encode(['role' => $role]);
        } else {
            throw new Exception("Request method not allowed");
        }
    } catch(Exception $e) {
        http_response_code(404);
        echo json_encode(['error' => $e->getMessage()]);
    }

