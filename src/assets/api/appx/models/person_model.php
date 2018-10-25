<?php
class person_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
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

    public function update($id, $data)
    { // used in I-print
        $this->db->where('PID', $id);
        if ($this->db->update('person', $data)) {
            return true;
        } else {
            return false;
        }

    }

}
