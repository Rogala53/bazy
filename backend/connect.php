<?php
    include_once 'classes/db_handler.php';
    $db_handler = new db_handler('localhost', 'postgres', 'postgres', 'serwisIT');
    try {
        $db_handler->connect();
    } catch(Exception $e) {
        echo $e->getMessage();
    }