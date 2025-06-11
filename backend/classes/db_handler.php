<?php

class Db_handler
{
    private $server_name;
    private $db_name;
    private $db;

    public function __construct($server_name, $db_name) {
        
        if(!defined('DEBUG_MODE')) {
            ini_set('display_errors', 0);
            error_reporting(0);
        }

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
    public function get_connection() {
        return $this->db;
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
        if($role == 'pracownik') {
            $tables = $this->delete_employees_table_from_array($tables);
        }
        return $tables;
    }

    private function delete_employees_table_from_array(array $array) {
        $key = array_search('pracownicy', $array);
        if($key !== false) {
            unset($array[$key]);
            $array = array_values($array);
        }
        return $array;
    }
    public function get_table_data($role, $table_name) {
        try {
            if(!$this->has_grant($role, $table_name)) {
                throw new Exception("You do not have permission to this table");
            }
            $func_name = "pobierz_$table_name()";
            $query = "SELECT * FROM $func_name";
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
        if($role != 'admin' && ($table_name == 'pracownicy' || $table_name == 'zespoly')) return false;
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
    public function add_record($table_name, $data_to_insert, $role)
    {
        try {
            $has_grant = $this->has_grant($role, $table_name);
            if(!$has_grant) {
                throw new Exception("You do not have permission to this table");
            }
            switch($table_name) {
                case 'klienci':
                    return $this->add_client_record($data_to_insert);
                case 'sprzety':
                    return $this->add_equipment_record($data_to_insert);
                case 'zgloszenia':
                    return $this->add_reports_record($data_to_insert);
                case 'dzialania':
                    return $this->add_actions_record($data_to_insert);
                case 'pracownicy':
                    return $this->add_employees_record($data_to_insert);
                case 'zespoly':
                    return $this->add_team_record($data_to_insert);
            }
        } catch(Exception $e) {
            return false;
        }
    }
    private function add_client_record($data)
    {
        $first_name = $data['imie'];
        $last_name = $data['nazwisko'];
        $phone = $data['telefon'];
        $query = "CALL dodaj_klienci('$first_name', '$last_name', '$phone')";
        $result = pg_query($this->db, $query);
        if(!$result) {
            throw new Exception("Could not execute query.");
        }
        return true;
    }
    private function add_equipment_record($data)
    {
        $client_id = $data['id_klienta'];
        $desc = $data['opis'];
        if($data['odbior'] != null) {
            $collect = $data['odbior'];
            $query = "CALL dodaj_sprzety($1, $2, $3)";
            $result = pg_query_params($this->db, $query, array($client_id, $desc, $collect));
        } else {
            $query = "CALL dodaj_sprzety($1, $2)";
            $result = pg_query_params($this->db, $query, array($client_id, $desc));
        }
        if(!$result) {
            throw new Exception("Could not execute query.");
        }
        return true;
    }
    private function add_reports_record($data)
    {
        $equipment_id = $data['id_sprzetu'];
        $status = $data['status'];
        if($data['data_przyjecia'] != null && $data['usterka'] != null) {
            $arrival_date = $data['data_przyjecia'];
            $fault = $data['usterka'];
            $query = "CALL dodaj_zgloszenia($equipment_id, '$fault', '$status', '$arrival_date')";
        } else {
            $query = "CALL dodaj_zgloszenia($equipment_id, '$status')";
        }
        $result = pg_query($this->db, $query);
        if(!$result) {
            throw new Exception("Could not execute query.");
        }
        return true;
    }
    private function add_actions_record($data)
    {
        $report_id = $data['id_zgloszenia'];
        $employee_id = $data['id_pracownika'];
        $desc = $data['opis'];
        if($data['data'] != null) {
            $date = $data['data'];
            $query = "CALL dodaj_dzialania($report_id, $employee_id, '$desc', '$date')";
        } else {
            $query = "CALL dodaj_dzialania($report_id, $employee_id, '$desc')";
        }
        
        
        
        $result = pg_query($this->db, $query);
        if(!$result) {
            throw new Exception("Could not execute query.");
        }
        return true;
    }
    private function add_employees_record($data)
    {
        $first_name = $data['imie'];
        $last_name = $data['nazwisko'];
        $team_id = $data['id_zespolu'];
        $query = "CALL dodaj_pracownicy('$first_name', '$last_name', $team_id)";
        $result = pg_query($this->db, $query);
        if(!$result) {
            throw new Exception("Could not execute query.");
        }
        return true;
    }
    private function add_team_record($data)
    {
        $specialization  = $data['specjalizacja'];
        $query = "CALL dodaj_zespoly('$specialization')";
        $result = pg_query($this->db, $query);
        if(!$result) {
            throw new Exception("Could not execute query.");
        }
        return true;
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
            throw new Exception(pg_last_error($this->db));
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
            throw new Exception(pg_last_error($this->db));
        }
        return true;
    }
    private function edit_reports_record($data) {
        $id = $data['id'];
        $equipment_id = $data['id_sprzetu'];
        $status = $data['status'];
        if($data['data_przyjecia'] == null || $data['data_przyjecia'] == '') {
            throw new Exception("Data przyjecia nie moze byc pusta.");  
        }
        if($data['data_zakonczenia'] == null || $data['data_zakonczenia'] == '') {
            $arrival_date = null;
        } else {
            $arrival_date = $data['data_przyjecia'];
        }
        $completion_date = $data['data_zakonczenia'];
        $fault = $data['usterka'];
        $query = "CALL modyfikuj_zgloszenia($id, $equipment_id, '$status', '$arrival_date', '$completion_date', '$fault')";
        $result = pg_query($this->db, $query);
        if(!$result) {
            throw new Exception(pg_last_error($this->db));
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
            throw new Exception(pg_last_error($this->db));
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
            throw new Exception(pg_last_error($this->db));
        }
        return true;
    }

    private function edit_team_record($data) {
        $id = $data['id'];
        $specialization  = $data['specjalizacja'];
        $query = "CALL modyfikuj_zespoly($id, '$specialization')";
        $result = pg_query($this->db, $query);
        if(!$result) {
            throw new Exception(pg_last_error($this->db));
        }
        return true;
    }
    public function delete_record($table_name, $id, $role) {
        try {
            $has_grant = $this->has_grant($role, $table_name);
            if(!$has_grant) {
                throw new Exception("You do not have permission to delete record.");
            }
            $procedure = "usun_$table_name($id)";
            $query = "CALL $procedure";
            $result = pg_query($this->db, $query);
            if(!$result) {
                throw new Exception(pg_last_error($this->db));
            }
            return true;
        } catch(Exception $e) {
            return false;
        }
    }

    public function create_account($username, $password, $role)
    {
        $password = hash('sha256', $password);
        $group = $role === 'admin' ? 'admins' : 'pracownicy';
        try {
            $set_role_query = "SET ROLE admins";
            $set_role = pg_query($this->db, $set_role_query);
            if (!$set_role) {
                throw new Exception("Nie udało się ustawić roli.");
            }
            $query = "CALL dodaj_konto('$username', '$password', '$group')";
            $result = pg_query($this->db, $query);
            if (!$result) {
                throw new Exception(pg_last_error());
            }
            $unset_role_query = "RESET ROLE";
            $unset_role = pg_query($this->db, $unset_role_query);
            if (!$unset_role) {
                throw new Exception("Nie udało się zresetować roli.");
            }
            return true;

        } catch (Exception $e) {
            return false;
        }
    }
}