<?php
class person_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }
    /* Get All Person */
    public function selectAllPerson($isClient){
        
        $this->db->select("*");
        $this->db->from("person");
        $this->db->where("person_type = '".$isClient."' and PID != 1 " );
        $this->db->order_by("PID", "DESC");
        $query = $this->db->get(); 
        $lastQuery=$this->db->last_query();  
          
        return $query->result();

        // OR
        // $query = $this->db->query('SELECT * FROM client WHERE name like "%'.$data.'%" LIMIT 10');
        // return $query->result();
    }
    public function deletePerson($PID)
    {
        $flag = $this->checkPersonInInvoices($PID);
        if ( $flag == 0) {
            $this->db->delete('person', array('PID' => $PID));
            return true;
        } else {
            return false;
        }
    }
    public function checkPersonInInvoices($PID)
    {
        $this->db->select('personID');
        $this->db->from('invoice');       
        $this->db->where('personID', $PID);
        $query = $this->db->get();
        return $query->num_rows();       

    }



    public function delete($id){ // used in I-print
        $this->db->where('PID', $id);
        if ($this->db->delete('person')) {
            return true;
        } else {
            return false;
        }

    }
    /* add new client */
    public function add($data){
        
        if ($this->db->insert('person', $data)) {
            return true;
        } else {
            return false;
        }
    }

    public function update($PID, $data)
    { // used in I-print
        $this->db->where('PID', $PID);
        if ($this->db->update('person', $data)) {
            return true;
        } else {
            return false;
        }

    }
    /* Get All Clients */
    public function selectAllClient($isClient){
        
        $this->db->select("*");
        $this->db->from("person");
        $this->db->where("person_type",$isClient);
        $this->db->where("PID != 1");
        $this->db->order_by("PID", "DESC");
        $query = $this->db->get(); 
        $lastQuery=$this->db->last_query();  
          
        return $query->result();

        // OR
        // $query = $this->db->query('SELECT * FROM client WHERE name like "%'.$data.'%" LIMIT 10');
        // return $query->result();
    }

    /* search for a specific client - auto complete */
    public function searchForClient($name){
        $this->db->select('*');
        $this->db->from('person');
        $this->db->like('full_name', $name, 'both');
        $this->db->where('person_type', 1);
        // $this->db->where('per_isActivated', 1);
        $this->db->limit(20);
        $query = $this->db->get();
        if ($query->num_rows() > 0) {
            return $query->result_array();
        } else {
            return 0;
        }
    }

}
