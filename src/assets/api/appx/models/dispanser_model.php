<?php
class dispanser_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }
    
    public function getAllCounters(){
        
        // $this->db->select("*");
        // $this->db->from("dispanser");
        // // $this->db->where('MATCH (name) LIKE ("'.$data.'")');
        // // $this->db->like('name',$data,'both');
        // // $this->db->limit(10, 0);
        // $query = $this->db->get(); 
        // return $query->result();

        // OR
        $query = $this->db->query("select * from container inner join dispanser on container.contID in (dispanser.outputContID_1,dispanser.outputContID_2)");
        // $query = $this->db->query("SELECT * FROM dispanser");
        return $query->result();
    }
    public function submit_dispnser_counters($data){
        
        if ($this->db->insert('counter', $data)) {
            return true;
        } else {
            return false;
        }

        // OR
        // $query = $this->db->query("select * from container inner join dispanser on container.contID in (dispanser.outputContID_1,dispanser.outputContID_2)");
        // $query = $this->db->query("SELECT * FROM dispanser");
        // return $query->result();
    }

    public function updateDispanserCounters($counter_1,$counter_2,$dispID){
        $this->db->set('counter_1',$counter_1, false);
        $this->db->set('counter_2',$counter_2, false);
        $this->db->where('dispID',$dispID, false);
        if ($this->db->update('dispanser')) {
            return true;
        } else {
            return false;
        }
    }

    public function updateFuel_container($contID,$liters_sold){
        $this->db->set('current_quan_liter', 'current_quan_liter - '.$liters_sold, false);
        // $this->db->set('current_quan_liter', 'current_quan_liter - '.$liters_sold_2, false);
        $this->db->where('contID', $contID, false);
        if ($this->db->update('container')) {
            $str = $this->db->last_query();
            return true;
        }else {
            $str = $this->db->last_query();
            return false;
        }
    }

    public function add_inv($data){
        if ($this->db->insert('invoice', $data)) {
            return true;
        } else {
            return false;
        }
    }
    public function add_inv_order($data){
        if ($this->db->insert('inv_order', $data)) {
            return true;
        } else {
            return false;
        }
    }

/* ************************************************************************************************ */
}
