<?php
    include_once 'classes/accounts_handler.php';
    try {
        if($_SERVER["REQUEST_METHOD"] == "POST") {
            accounts_handler::logout();
        }
    } catch(Exception $e) {
        echo $e->getMessage();
    }