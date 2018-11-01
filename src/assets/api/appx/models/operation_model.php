<?php
class operation_model extends CI_Model{

    public function __construct(){
        $this->load->database();
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

    public function update_stock($id, $quantity){
        $this->db->set('quantity', 'quantity + '.$quantity, false);
        $this->db->where('itemID', $id);
        if ($this->db->update('item-service')) {
            $str = $this->db->last_query();
            return true;
        }else {
            $str = $this->db->last_query();
            return false;
        }
    }
    public function updateCost_stock($id, $cost){
        $this->db->set('cost', $cost, false);
        $this->db->where('itemID', $id);
        if ($this->db->update('item-service')) {
            $str = $this->db->last_query();
            return true;
        }else {
            $str = $this->db->last_query();
            return false;
        }
    }
    public function add_debit_person($id, $rest){
        $this->db->set('debitAmount', 'debitAmount + '.$rest, false);
        $this->db->where('PID', $id);
        if ($this->db->update('person')) {
            $str = $this->db->last_query();
            return true;
        }else {
            $str = $this->db->last_query();
            return false;
        }
    }
    // public function update_stock($id,$quantity){
       // OR
        // $query = $this->db->query("UPDATE `item-service` SET quantity = quantity - ".$quantity." WHERE itemID = ".$id."");
        // // $str = $this->db->last_query();
        // return $query->result();

    //     $this->db->update("item-service");
    //     $this->db->set('quantity', 'quantity+1', FALSE);
    //     $this->db->where('itemID', '6');
    //     return $query->result();
    // }

    public function delete($id){
        $this->db->where('IID', $id);
        if ($this->db->delete('item')) {
            return true;
        } else {
            return false;
        }
    }
}
