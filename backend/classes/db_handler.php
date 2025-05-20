<?php

class db_handler
{
    private $server_name;
    private $username;
    private $password;
    private $db_name;
    private $conn;
    public function __construct($server_name, $username, $password, $db_name) {
        $this->server_name = $server_name;
        $this->username = $username;
        $this->password = $password;
        $this->db_name = $db_name;
    }

    public function connect() {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Max-Age: 3600");
        header("Content-type: application/json; charset=UTF-8");
        $this->conn = pg_connect("host='$this->server_name' dbname='$this->db_name' user='$this->username' password='$this->password'");
    }
    public function get_connection() {
        return $this->conn;
    }

    public function get_tables_names($role) {
        if($role == 'admin') {
            $query = "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'";
        }
        else if($role == 'pracownik') {
            $query = "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE 'konta'";
        }
        else {
            throw new Exception("Invalid role.");
        }

        $result = pg_query($this->conn, $query);
        if(!$result) {
            throw new Exception("Could not execute query.");
        }
        $tables = array();
        $row = pg_fetch_row($result);
        while($row != NULL) {
            $tables[] = $row[0];
            $row = pg_fetch_row($result);
        }
        $tables = $this->fix_tables_order($tables);
        return $tables;
    }
    private function fix_tables_order($tables) {
        for($i = 0; $i < count($tables); $i++) {
            if($tables[$i] === 'konta') {
                $tmp = $tables[$i];
                unset($tables[$i]);
                $tables[] = $tmp;
                $tables = array_values($tables);
                break;
            }
        }
        return $tables;
    }
    public function get_table_view($table_name) {
        $table_view = $table_name."_widok";
        $query = "SELECT * FROM $table_view";
        $result = pg_query($this->conn, $query);
        if($result == null) {
            return array();
        }
        $data = array();
        while($row = pg_fetch_assoc($result)) {
            $data[] = $row;
        }
        return $data;
    }
//    private function format_keys_names($keys_names) {
//        foreach($keys_names as $key) {
//            str_replace("_", " ", $key);
//        }
//        return $keys_names;
//    }
}