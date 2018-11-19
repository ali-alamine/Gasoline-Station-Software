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
    public function delete($id){
        $this->db->where('IID', $id);
        if ($this->db->delete('item')) {
            return true;
        } else {
            return false;
        }
    }
    public function calculate_avg_cost_item($itemID,$newQuan,$newCost){
        $this->db->select("quantity,cost");
        $this->db->from('item-service');
        $this->db->where("itemID",$itemID);
        $query = $this->db->get(); 
        $strQuery=$this->db->last_query();
        // $rowcount = $query->num_rows();
        $res=$query->result_array();
        $oldQuan=$res[0]['quantity'];
        $oldCost=$res[0]['cost'];
        if($oldCost > 0){
            $avgCost=( (($oldQuan*$oldCost) + ($newCost*$newQuan) ) / ($oldQuan + $newQuan));
            return $avgCost;
        }else{
            return $newCost;
        }
    }
    public function calculate_avg_cost($containerID,$newQuan,$newCost){
        $this->db->select("current_quan_liter,cost_liter");
        $this->db->from("container");
        $this->db->where("contID",$containerID);
        $query = $this->db->get(); 
        $strQuery=$this->db->last_query();
        // $rowcount = $query->num_rows();
        $res=$query->result_array();
        $oldQuan=$res[0]['current_quan_liter'];
        $oldCost=$res[0]['cost_liter'];
        $avgCost=( (($oldQuan*$oldCost) + ($newCost*$newQuan) ) / ($oldQuan + $newQuan));
        return $avgCost;
    }
    public function update_fuelContainer($id, $quantity,$avgCost){
        $this->db->set('current_quan_liter', 'current_quan_liter + '.$quantity, false);
        $this->db->set('cost_liter', $avgCost, false);
        $this->db->where('contID', $id, false);
        if ($this->db->update('container')) {
            $str = $this->db->last_query();
            return true;
        }else {
            $str = $this->db->last_query();
            return false;
        }
    }
}
