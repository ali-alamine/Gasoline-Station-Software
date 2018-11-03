<?php
require APPPATH . '/libraries/REST_Controller.php';

class invoice extends REST_Controller{

    public function __construct(){
        parent::__construct();
        $this->load->model('invoice_model');
    }

    /* Get All Lubricants */
    public function getSoldLubricants_get(){
        $result = $this->invoice_model->selectAll_byType($invoice_type);
        if ($result === 0) {
            $this->response("Client information could not be saved. Try again.", 404);
        } else {
            $this->response($result, 200);
        }
    }  
    
    public function getTypeDetails_post()
    {
        $type = $this->post('type');
        // $isDebit = $this->post('isDebit');
        $empID = $this->post('empID');

        date_default_timezone_set("Asia/Beirut");
        $date=date("Y-m-d");

        $this->db->trans_begin();

        // for($i = 0 ; $i < $size ; $i ++){
            $result = $this->invoice_model->getDetailInvoice($type,$empID,$date);

        // }
        // foreach ($empID as $empID) {
        //     $result = $result + $this->invoice_model->getDetailInvoice($type,$empID,$date,$isDebit);
        // }

        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response($result, 200);
        }
    }
}
