<?php
class invoice_model extends CI_Model{

    public function __construct(){
        $this->load->database();
    }

    /* Get All Invoice filter by type */
    public function selectAll_byType(){
        $this->db->select("*");
        $this->db->from("item-service");
        $this->db->where("item_type","lub");
        $this->db->order_by("itemID", "DESC");
        $query = $this->db->get();
        $st=$this->db->last_query();
        return $query->result();
    }
}
