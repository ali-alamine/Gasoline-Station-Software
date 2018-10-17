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
        return $query->result();

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

     /* Add new employee */
     public function add($data){
        if ($this->db->insert('employee', $data)) {
            return true;
        } else {
            return false;
        }
    }
}
