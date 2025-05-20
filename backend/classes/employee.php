<?php

class  Employee
{
    private $id;
    private $first_name;
    private $last_name;
    private $username;
    private $password;
    private $role;
    private $team_id;


    function __construct($first_name, $last_name, $username, $password, $role, $team_id = null) {
        $this->first_name = $first_name;
        $this->last_name = $last_name;
        $this->username = $username;
        $this->password =$password;
        $this->role = $role;
        $this->team_id = $team_id;
    }
    function get_id() {
        return $this->id;
    }
    function set_id($id) {
        $this->id = $id;
    }
    function get_first_name() {
        return $this->first_name;
    }
    function set_first_name($first_name) {
        $this->first_name = $first_name;
    }
    function get_last_name() {
        return $this->last_name;
    }
    function set_last_name($last_name) {
        $this->last_name = $last_name;
    }
    function get_username() {
        return $this->username;
    }
    function set_username($username) {
        $this->username = $username;
    }
    function get_password() {
        return $this->password;
    }
    function set_password($password) {
        $this->password = $password;
    }
    function get_role() {
        return $this->role;
    }
    function set_role($role) {
        $this->role = $role;
    }
    function get_team_id() {
        return $this->team_id;
    }
    function set_team_id($team_id) {
        $this->team_id = $team_id;
    }
}