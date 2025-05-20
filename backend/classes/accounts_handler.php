<?php

class accounts_handler
{
    private $conn;
    function __construct($conn) {
        $this->conn = $conn;
    }

    function login($username, $password) {

            $escaped_username = pg_escape_string($this->conn, $username);
            $escaped_password = pg_escape_string($this->conn, $password);

            $query = "SELECT * FROM logowanie('$escaped_username', '$escaped_password')";
            $result = pg_query($this->conn, $query);
            if(pg_num_rows($result) > 0) {
                $row = pg_fetch_assoc($result);
                $role = $row['rola'];
                return ["success" => true, "role" => $role, "username" => $username];
            } else {
                return ["success" => false, 'message' => $result["message"]];
            }
    }
    static function logout() {
        if(session_status() == PHP_SESSION_ACTIVE) {
            session_destroy();
        }
    }
//    function add_employee(Employee $employee) {
//        $escaped_first_name = pg_escape_string($employee->get_first_name());
//        $escaped_last_name = pg_escape_string($employee->get_last_name());
//        $team_id = $employee->get_team_id();
//        $query = "CALL dodaj_pracownika('$escaped_first_name', '$escaped_last_name', $team_id)";
//
//        $result = pg_query($this->conn, $query);
//        if(!$result) {
//            throw new Exception(pg_last_error($this->conn));
//            echo json_encode(['success' => false, 'message' => pg_last_error($this->conn)]);
//        }
//        else {
//            echo json_encode(['success' => true, 'message' => "Pracownik $escaped_first_name $escaped_last_name został dodany"]);
//        }
//    }
//    function add_account(Employee $employee) {
//        $id = $employee->get_id();
//        $escaped_username = pg_escape_string($conn, $employee->get_username());
//        $escaped_password = pg_escape_string($conn, $employee->get_password());
//        $escaped_role = pg_escape_string($conn, $employee->get_role());
//        $query = "CALL dodaj_konto($id, '$escaped_username', '$escaped_password', '$escaped_role')";
//        $result = db_handler::query($query);
//        if(!$result) {
//            throw new Exception(pg_last_error($this->conn));
//        } else {
//            echo json_encode(['success' => true, 'message'=> 'Konto zostało utworzone.']);
//        }
//    }
//    function delete_employee($id) {
//        $escaped_id = pg_escape_string($id);
//        $query = "CALL usun_pracownika($escaped_id)";
//        $result = pg_query($this->conn, $query);
//        if(!$result) {
//            throw new Exception(pg_last_error($this->conn));
//        }
//        else {
//            echo json_encode(['success' => true, 'message' => "Pracownik o id $id został usunięty"]);
//        }
//    }
//    function delete_account($username) {
//        $escaped_username = pg_escape_string($username);
//        $query = "CALL usun_konto($escaped_username)";
//        $result = pg_query($this->conn, $query);
//        if(!$result) {
//            throw new Exception(pg_last_error($this->conn));
//        }
//        else {
//            echo json_encode(['success' => true, 'message' => "Konto o nazwie $username zostało usunięte"]);
//        }
//    }
//    function set_employee_id(Employee $employee) {
//        $escaped_first_name = pg_escape_string($conn, $employee->get_first_name());
//        $escaped_last_name = pg_escape_string($conn, $employee->get_last_name());
//        $query = "SELECT * FROM znajdz_id_pracownika('$escaped_first_name', '$escaped_last_name')";
//        $result = pg_query($this->conn, $query);
//        if(!$result) {
//            throw new Exception(pg_last_error($this->conn));
//        }
//        else {
//            $id = pg_fetch_row($result, 0, 0);
//            $employee->set_id($id);
//        }
//    }
}