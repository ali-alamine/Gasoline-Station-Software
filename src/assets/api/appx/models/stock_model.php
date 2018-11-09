<?php
class stock_model extends CI_Model{

    public function __construct(){
        $this->load->database();
    }

    /* Get Lubricants - offset , limit  */
    public function select_item($limit,$offset,$type){
        $this->db->select("*");
        $this->db->from("item-service");
        $this->db->where("item_type",$type);
        $this->db->order_by("itemID", "ASC");
        $this->db->limit($offset, $limit);
        $query = $this->db->get();
        $st=$this->db->last_query();
        return $query->result();
    }
    /* Get All Lubricants */
    public function selectAll_lub(){
        $this->db->select("*");
        $this->db->from("item-service");
        $this->db->where("item_type","lub");
        $this->db->order_by("itemID", "DESC");
        $query = $this->db->get();
        $st=$this->db->last_query();
        return $query->result();
    }
    /* Get the total items in the stock filter by type */
    public function countStockItems($item_type){
        $this->db->select("count(itemID) as total");
        $this->db->from("item-service");
        $this->db->where("item_type",$item_type);
        $this->db->order_by("itemID", "DESC");
        $query = $this->db->get();
        $st=$this->db->last_query();
        return $query->result();
    }
    /* Get All Accessories */
    public function selectAll_access(){
        $this->db->select("*");
        $this->db->from("`item-service`");
        $this->db->where("item_type","access");
        $this->db->order_by("itemID", "DESC");
        $query = $this->db->get(); 
        return $query->result();
    }

    /* Get All Fuel containers */
    public function selectAll_fuelContainers(){
        $this->db->select("*");
        $this->db->from("container");
        $query = $this->db->get(); 
        return $query->result();
    }
    /* add new item */
    public function add($data){
        if ($this->db->insert('item-service', $data)) {
            return true;
        } else {
            return false;
        }
    }

    /* update item data */
    public function update ($id, $data){
        $this->db->where('itemID', $id);
        if ($this->db->update('`item-service`', $data)) {
            return true;
        } else {
            return false;
        }
    }
    /* delete new item */
    // public function delete($id){
    //     $this->db->where('IID', $id);
    //     if ($this->db->delete('item')) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
    public function deleteStock($itemID)
    {
        $flag = $this->checkStockInInvoices($itemID);
        if ( $flag == 0) {
            if ($this->db->delete('`item-service`', array('itemID' => $itemID))) {
                        return true;
                    } 
                    else {
                        return false;
                    }
        
        } else {
            return false;
        }
    }
    public function checkStockInInvoices($itemID)
    {
        $this->db->select('inv_ordID');
        $this->db->from('inv_order');       
        $this->db->where('itemID', $itemID);
        $query = $this->db->get();
        return $query->num_rows();       

    }
}
