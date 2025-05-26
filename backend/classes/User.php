<?php

class User
{
    private $username;
    private $password;

    private $role;

    function __construct($username, $password) {
        $this->username = $username;
        $this->password = $password;
    }

    public function get_username()
    {
        return $this->username;
    }
    public function get_password() {
        return $this->password;
    }

    public function get_role() {
        return $this->role;
    }

    public function set_role($role) {
        $this->role = $role;
    }

}