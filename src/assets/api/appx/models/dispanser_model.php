<?php
class dispanser_model extends CI_Model
{
    public function __construct()
    {
        $this->load->database();
    }
    
    public function getAllCounters(){
        
        $this->db->select("*");
        $this->db->from("dispanser");
        // $this->db->where('MATCH (name) LIKE ("'.$data.'")');
        // $this->db->like('name',$data,'both');
        // $this->db->limit(10, 0);
        $query = $this->db->get(); 
        return $query->result();

        // OR
        // $query = $this->db->query('SELECT * FROM client WHERE name like "%'.$data.'%" LIMIT 10');
        // return $query->result();
    }
/* ************************************************************************************************ */
    // public function add($data)
    // {
    //     if ($this->db->insert('person', $data)) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    // public function update($id, $data)
    // {
    //     $this->db->where('PID', $id);
    //     if ($this->db->update('person', $data)) {
    //         return true;
    //     } else {
    //         return false;
    //     }

    // }

    // public function updateDebit($id, $amount)
    // {
    //     $this->db->set('debit', 'debit -'. $amount, FALSE);
    //     $this->db->where('PID', $id);
    //     if ($this->db->update('person')) {
    //         return true;
    //     } else {
    //         return false;
    //     }

    // }
    
    // public function autoSubscription()
    // {
    //     $query = $this->db->query('select subscriber.SBID,subscriber.profile from subscriber inner join subscriber_detail on subscriber.SBID = subscriber_detail.SBID where subscriber_detail.exp_date=CURDATE() AND subscriber.is_activated=1');

    //     foreach ($query->result() as $row) {


    //         $data = array("SBID" => $row->SBID, "profile" => $row->profile);

    //         $this->db->set('sub_date', 'CURDATE() ', FALSE);
    //         $this->db->set('exp_date', 'CURDATE()+INTERVAL 1 MONTH', FALSE);

    //         $this->db->insert('subscriber_detail', $data);
    //     }

    //     return true;
    // }

    
        
    // public function toggleActivation ($id)
    // {

    //     $this->db->set('is_activated', '!is_activated', FALSE);
    //     $this->db->where('SBID', $id);        
    //     if ($this->db->update('subscriber')) {
    //         return true;
    //     } else {
    //         return false;
    //     }

    // }

    // public function togglePayment($id)
    // {

    //     $this->db->set('is_paid', '!is_paid', FALSE);
    //     $this->db->where('SBDID', $id);        
    //     if ($this->db->update('subscriber_detail')) {
    //         return true;
    //     } else {
    //         return false;
    //     }

    // }

    // public function addSubscription($data)
    // {
    //     if ($this->db->insert('subscriber_detail', $data)) {
    //         $this->db->last_query();
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    // public function deleteSubscription($id){
    //     $this->db->where('SBDID', $id);
    //     if ($this->db->delete('subscriber_detail')) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }


}
