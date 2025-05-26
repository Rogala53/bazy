<?php

class Db_handler
{
    private $server_name;
    private $db_name;
    private $db;

    public function __construct($server_name, $db_name) {
        $this->server_name = $server_name;
        $this->db_name = $db_name;
    }

    public function connect(User $user) {
        try {
            header("Access-Control-Allow-Origin: *");
            header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
            header("Access-Control-Allow-Headers: Content-Type, Authorization");
            header("Access-Control-Allow-Credentials: true");
            header("Access-Control-Max-Age: 3600");
            header("Content-type: application/json; charset=UTF-8");
            $username = $user->get_username();
            $password = $user->get_password();
            $this->db = pg_connect("host='$this->server_name' dbname='$this->db_name' user='$username' password='$password'");
            return true;
        } catch(Exception $e) {
            return false;
        }
    }

    public function get_role(User $user) {
        $username = $user->get_username();
        $query = "SELECT * FROM znajdz_grupe('$username')";
        $result = pg_query($this->db, $query);
        $role = pg_fetch_row($result);
        if ($role) {
            return $role[0];
        }
        return null;
    }

    public function get_tables_names($role) {
        if($role == 'admin') {
            $query = "SELECT * FROM znajdz_tabele_dostepne_dla_adminow()";
        }
        else if($role == 'pracownik') {
            $query = "SELECT * FROM znajdz_tabele_dostepne_dla_pracownikow()";
        }
        else {
            throw new Exception("Invalid role.");
        }

        $result = pg_query($this->db, $query);
        if(!$result) {
            throw new Exception("Could not execute query.");
        }
        $tables = array();
        $row = pg_fetch_row($result);
        while($row != NULL) {
            $tables[] = $row[0];
            $row = pg_fetch_row($result);
        }
        return $tables;
    }
    public function get_table_view($role, $table_name) {
        if(!$this->has_grant($role, $table_name)) {
            return "Nie masz dostepu do tej tabeli.";
        }
        $table_view = $table_name . "_widok";
        $query = "SELECT * FROM $table_view";
        $result = pg_query($this->db, $query);
        
        if($result == null) {
            return array();
        }
        $data = array();
        while($row = pg_fetch_assoc($result)) {
            $data[] = $row;

        }

        return $data;
    }
    private function has_grant($role, $table_name) {
        $query = "SELECT * FROM sprawdz_dostep('$role', '$table_name')";
        try {
            $result = pg_query($this->db, $query);
            if($result == null) {
                throw new Exception(pg_last_error());
            }
            else {
                $row = pg_fetch_row($result);
                if($row == null) {
                    throw new Exception(pg_last_error());
                }
                return $row[0];
            }
            
        } catch(Exception $e) {
            echo json_encode(["success" => false, "message" => $e->getMessage()]);
        }
    }
}