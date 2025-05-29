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
    public function get_table_data($role, $table_name) {
        try {
            if(!$this->has_grant($role, $table_name)) {
                throw new Exception("You do not have permission to this table");
            }
            $func_name = "pobierz_$table_name()";
            $order = "ORDER BY id DESC";
            $query = "SELECT * FROM $func_name $order";
            $result = pg_query($this->db, $query);
            if(!$result) {
                throw new Exception("Could not execute query.");
            }
            $data = pg_fetch_all($result);
            return $data;
        } catch(Exception $e) {
            return $e->getMessage();
        }
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
                return true;
            }
        } catch(Exception $e) {
            return false;
        }
    }
    public function edit_record($table_name, $data, $role) {
        try {
            $has_grant = $this->has_grant($role, $table_name);
            if(!$has_grant) {
                throw new Exception("You do not have permission to this table");
            }
            switch($table_name) {
                case 'klienci':
                    return $this->edit_client_record($data);
                case 'sprzety':
                    return $this->edit_equipment_record($data);
                case 'zgloszenia':
                    return $this->edit_reports_record($data);
                case 'dzialania':
                    return $this->edit_actions_record($data);
                case 'pracownicy':
                    return $this->edit_employees_record($data);
                case 'zespoly':
                    return $this->edit_team_record($data);
            }

        } catch(Exception $e) {
            return false;
        }
    }
    private function edit_client_record($data) {
        $id = $data['id'];
        $first_name = $data['imie'];
        $last_name = $data['nazwisko'];
        $phone = $data['telefon'];
        $query = "CALL modyfikuj_klienci($id, '$first_name', '$last_name', '$phone')";
        $result = pg_query($this->db, $query);
        if(!$result) {
            throw new Exception("Could not execute query.");
        }
        return true;
    }
    private function edit_equipment_record($data) {
        $id = $data['id'];
        $client_id = $data['id_klienta'];
        $desc = $data['opis'];
        $collect = $data['odbior'];
        $query = "CALL modyfikuj_sprzety($id, $client_id, '$desc', '$collect')";
        $result = pg_query($this->db, $query);
        if(!$result) {
            throw new Exception("Could not execute query.");
        }
        return true;
    }
    private function edit_reports_record($data) {
        $id = $data['id'];
        $equipment_id = $data['id_sprzetu'];
        $status = $data['status'];
        $arrival_date = $data['data_przyjecia'];
        $completion_date = $data['data_zakonczenia'];
        $fault = $data['usterka'];
        $query = "CALL modyfikuj_zgloszenia($id, $equipment_id, '$status', '$arrival_date', '$completion_date', '$fault')";
        $result = pg_query($this->db, $query);
        if(!$result) {
            throw new Exception("Could not execute query.");
        }
        return true;
    }
    private function edit_actions_record($data) {
        $id = $data['id'];
        $report_id = $data['id_zgloszenia'];
        $employee_id = $data['id_pracownika'];
        $date = $data['data'];
        $desc = $data['opis'];
        $query = "CALL modyfikuj_dzialania($id, $report_id, $employee_id, '$date', '$desc')";
        $result = pg_query($this->db, $query);
        if(!$result) {
            throw new Exception("Could not execute query.");
        }
        return true;
    }
    private function edit_employees_record($data) {
        $id = $data['id'];
        $first_name = $data['imie'];
        $last_name = $data['nazwisko'];
        $team_id = $data['id_zespolu'];
        $query = "CALL modyfikuj_pracownicy($id, '$first_name', '$last_name', $team_id)";
        $result = pg_query($this->db, $query);
        if(!$result) {
            throw new Exception("Could not execute query.");
        }
        return true;
    }

    private function edit_team_record($data) {
        $id = $data['id'];
        $specialization  = $data['specjalizacja'];
        $query = "CALL modyfikuj_zespoly($id, '$specialization')";
        $result = pg_query($this->db, $query);
        if(!$result) {
            throw new Exception("Could not execute query.");
        }
        return true;
    }
    public function delete_record($table_name, $id, $role) {
        try {
            $has_grant = $this->has_grant($role, $table_name);
            if(!$has_grant) {
                return "You do not have permission to delete record.";
            }
            $procedure = "usun_$table_name($id)";
            $query = "CALL $procedure";
            $result = pg_query($this->db, $query);
            if(!$result) {
                throw new Exception("Could not execute query.");
            }
            return true;
        } catch(Exception $e) {
            return false;
        }
    }

    public function create_account($username, $password, $role) {
        $password = hash('sha256', $password);
        $group = $role === 'admin' ? 'admins' : 'pracownicy';
        try {
            $set_role_query = "SET ROLE admins";
            $set_role = pg_query($this->db, $set_role_query);
            if(!$set_role) {
                throw new Exception("Nie udało się ustawić roli.");
            }
            $query = "CALL dodaj_konto('$username', '$password', '$group')";
            $result = pg_query($this->db, $query);
            if(!$result) {
                throw new Exception(pg_last_error());
            }
            $unset_role_query = "RESET ROLE";
            $unset_role = pg_query($this->db, $unset_role_query);
            if(!$unset_role) {
                throw new Exception("Nie udało się zresetować roli.");
            } 
            return true;
            
        } catch(Exception $e) {
            return false;
        }
    }
}