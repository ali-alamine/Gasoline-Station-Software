<?php
class container_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }
    
    public function getAllContainer(){
        
        // $this->db->select("*");
        // $this->db->from("dispanser");
        // // $this->db->where('MATCH (name) LIKE ("'.$data.'")');
        // // $this->db->like('name',$data,'both');
        // // $this->db->limit(10, 0);
        // $query = $this->db->get(); 
        // return $query->result();

        // OR
        $query = $this->db->query("SELECT * FROM container");
        // $query = $this->db->query("SELECT * FROM dispanser");
        return $query->result();
    }
    public function getFuelPrices(){
        
        // $this->db->select("*");
        // $this->db->from("dispanser");
        // // $this->db->where('MATCH (name) LIKE ("'.$data.'")');
        // // $this->db->like('name',$data,'both');
        // // $this->db->limit(10, 0);
        // $query = $this->db->get(); 
        // return $query->result();

        // OR
        $query = $this->db->query("SELECT price_liter,cost_liter,type from container group by type");
        // $query = $this->db->query("SELECT * FROM dispanser");
        return $query->result();
    }




    /* ************************************************************************************************ */
}
