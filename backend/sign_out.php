<?php
    include_once 'classes/Session.php';
    try {
        if($_SERVER["REQUEST_METHOD"] == "POST") {
            Session::clear();
        }
    } catch(Exception $e) {
        echo $e->getMessage();
    }