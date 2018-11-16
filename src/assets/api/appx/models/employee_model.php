<?php
class employee_model extends CI_Model{
    public function __construct(){
        $this->load->database();
    }
    /* check login */
    public function checkLogInAuth($data){
        $loginInfo=json_decode($data,true);
        $this->db->select("*");
        $this->db->from("employee");
        $this->db->where("user_name='".$loginInfo['username']."' AND passkey ='".$loginInfo['password']."' ");
        $query = $this->db->get();
        $rowcount = $query->num_rows();
        return $query->result();
        /*----------------------------------------OR-------------------------*/

       // $query = $this->db->query('SELECT * FROM client WHERE name like "%'.$data['keysValue'].'%" LIMIT 10');
       // return $query->result();
    }
    public function isShiftOpen(){
        $this->db->select("*");
        $this->db->from("shift");
        $this->db->where("isOpen=1");
        $query = $this->db->get(); 
        // $strQuery=$this->db->last_query();
        // $rowcount = $query->num_rows();
        return $query->result();
    }
    /* Get All Employee */
    public function selectAll(){
        $this->db->select("*");
        $this->db->from("employee");
        $this->db->order_by("empID", "DESC");
        $query = $this->db->get(); 
        return $query->result();
    }

     /* Add new employee */
    public function add($data){
        if ($this->db->insert('employee', $data)) {
            return true;
        } else {
            return false;
        }
    }
    /* insert new shift */
    public function recordNewShift($data){
        if ($this->db->insert('shift', $data)) {
            return true;
        } else {
            return false;
        }
    }
    public function getLastShiftID(){
        if ($this->db->insert_id()) {
            return $this->db->insert_id();
        } else {
            return false;
        }
    }
    /* Get last shift ID */

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

    public function logout($shiftID,$today_date){
        $this->db->where('shiftID', $shiftID);
        $this->db->set('isOpen', 0);
        $this->db->set('timeOut', $today_date);
        if ($this->db->update('shift')) {
            return true;
        } else {
            return false;
        }
    }
}
