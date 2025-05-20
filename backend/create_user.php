<?php
//include "employee.php";
//error_reporting(E_ALL);
//ini_set('display_errors', 1);
//header('Content-Type: application/json');
//try {
//    if($_SERVER['REQUEST_METHOD'] == 'POST') {
//        $raw_data = file_get_contents('php://input');
//        $data = json_decode($raw_data, true);
//        if ($data === null) {
//            throw new Exception("Invalid JSON received: " . $raw_data);
//        }
//        $first_name = $data['first_name'];
//        $last_name = $data['last_name'];
//        $username = $data['username'];
//        $password = $data['password'];
//        $role = $data['role'];
//        if ($data[''])
//
//        $employee = new Employee();
//    } else {
//        throw new Exception("Method not allowed");
//    }
//} catch (Exception $e) {
//    http_response_code(400);
//    echo json_encode([
//        "error" => true,
//        "message" => $e->getMessage()
//    ]);
//}
//pg_close($db);
