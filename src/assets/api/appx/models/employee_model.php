<?php
class employee_model extends CI_Model{
    public function __construct(){
        $this->load->database();
    }
    /* check login */
    public function checkLogInAuth($user,$pass){
        // $loginInfo=json_decode($data,true);
        $this->db->select("*");
        $this->db->from("employee");
        // $this->db->join('shift', 'shift.empID=employee.empID', 'inner');
        $this->db->where("user_name='".$user."' AND passkey ='".$pass."'");
        $query = $this->db->get(); 
        if ($query->num_rows() > 0) {
            return $query->result();
        }
        else{
            return 0;
        }

        /*----------------------------------------OR-------------------------*/
       // $query = $this->db->query('SELECT * FROM client WHERE name like "%'.$data['keysValue'].'%" LIMIT 10');
       // return $query->result();
    }

    /* Get All Employee */
    public function selectAll(){
        $this->db->select("*");
        $this->db->from("employee");
        $this->db->order_by("empID", "DESC");
        $query = $this->db->get(); 
        return $query->result();
    }

     /* Add new employee or shift */
     public function add($table,$data){
        if ($this->db->insert($table, $data)) {
            return true;
        } else {
            return false;
        }
    }
    /* check login in shift ToDay */
    public function check_open_shift($empID,$shift_date,$isAdmin){
        // if($isAdmin == 0){
            $this->db->select("*");
            $this->db->from("shift");
            $this->db->where("shift_date='".$shift_date."' AND timeOut = '0000-00-00 00:00:00' ");
            $query = $this->db->get();
            if ($query->num_rows() > 0) {
                $check=$this->check_emp_shift($empID,$shift_date);
                return $check;
            }  else{
                $open = $this->open_shift($empID,$shift_date);
                return $open;
            }
        // } else{
        //     $this->db->select("*");
        //     $this->db->from("shift");
        //     $this->db->join('employee', 'shift.empID=employee.empID', 'inner');
        //     $this->db->where("shift.shift_date='".$shift_date."' AND shift.timeOut = '0000-00-00 00:00:00' and employee.user_type = '".$isAdmin."' ");
        //     $query = $this->db->get();
        //     if ($query->num_rows() > 0) {
        //         $check=$this->check_emp_shift($empID,$shift_date);
        //         return $check;
        //         // return 1;
        //     }  else{
        //         $open = $this->open_shift($empID,$shift_date);
        //         return $open;
        //     }
        // }
    }
    /* check login in shift ToDay */
    public function check_emp_shift($empID,$shift_date){
        // $loginInfo=json_decode($data,true);
        $this->db->select("*");
        $this->db->from("shift");
        $this->db->where("shift_date='".$shift_date."' AND empID = '".$empID."' AND timeOut = '0000-00-00 00:00:00' ");

        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            // $this->check_emp_shift($empID,$shift_date);
            return 1;
        }  else{
            // $this->open_shift($empID,$shift_date);
            return 0;
        }
    }
    public function open_shift($empID,$shift_date){
        date_default_timezone_set("Asia/Beirut");
        $timeIn=date("Y-m-d H:i:s");
        $addShift = $this->add('shift',array("empID"=>$empID,"shift_date" => $shift_date,'timeIn'=>$timeIn));
        return 1;
    }
    /* Get All Employee in open shift today*/
    public function getTodayEmp(){
        date_default_timezone_set("Asia/Beirut");
        $date=date("Y-m-d");
        $this->db->select("*");
        $this->db->from("employee");
        $this->db->join('shift', 'shift.empID=employee.empID', 'inner');
        $this->db->where("shift.shift_date = '".$date."' ");
        // $this->db->order_by("employee.empID", "DESC");
        $query = $this->db->get(); 
        return $query->result();
    }
    //delete employee
    public function deleteEmployee($empID)
    {
        $flag = $this->checkEmployeeInShift($empID);
        if ( $flag == 0) {
            $this->db->where('empID', $empID);
            $this->db->delete('employee');
            return true;
        } else {
            return false;
        }
    }
    public function checkEmployeeInShift($empID)
    {
        $this->db->select('empID');
        $this->db->from('shift');       
        $this->db->where('empID', $empID);
        $query = $this->db->get();
        return $query->num_rows();       

    }
    //edit employee
    public function update($id, $data)
    { 
        $this->db->where('empID', $id);
        if ($this->db->update('employee', $data)) {
            return true;
        } else {
            return false;
        }

    }
}
