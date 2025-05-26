<?php

class Session
{
    public static function clear() {
        if(session_status() == PHP_SESSION_NONE) {
            session_start();
        }
        $_SESSION = array();
        session_destroy();
    }
}