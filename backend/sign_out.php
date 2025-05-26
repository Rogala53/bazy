<?php
    include_once 'classes/db_handler.php';
    try {
        if($_SERVER["REQUEST_METHOD"] == "POST") {
            db_handler::logout();
        }
    } catch(Exception $e) {
        echo $e->getMessage();
    }