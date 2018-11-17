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
    
    public function getDetailInvoice_post()
    {

        $type = $this->post('type');
        // $isDebit = $this->post('isDebit');
        $shiftIDs = $this->post('shiftIDs');
        $shiftID = array();
        foreach ($shiftIDs as $id)
        {
            $shiftID[] = $id;
        }
        // date_default_timezone_set("Asia/Beirut");
        // $date=date("Y-m-d");

        // $this->db->trans_begin();
        $result = $this->invoice_model->getDetailInvoice($type,$shiftIDs);
        // if ($this->db->trans_status() === false) {
        //     $this->db->trans_rollback();
        //     $this->response("Invoice information could not be saved. Try again.", 404);
        // } else {
        //     $this->db->trans_commit();
            $this->response($result, 200);
        // }
    }
    public function getShiftDetails_post()
    {
        // $type = $this->post('type');
        $fromExpDate = $this->post('fromExpDate');
        $toExpDate = $this->post('toExpDate');
        $empIDs = $this->post('empIDs');
        $empID = array();
        foreach ($empIDs as $id)
        {
            $empID[] = $id;
        }
        $result = $this->invoice_model->getShiftDetails($empID,$fromExpDate,$toExpDate);
        $totalCount = $this->invoice_model->countShiftDetails($empIDs,$fromExpDate,$toExpDate);
        $jsonData=[$result,$totalCount];
        if ($result == 0) {
            $this->response("shift information could not exist. Try again.", 404);
        } else {
            $this->response($jsonData, 200);
        }
    }
    
    public function getShiftTypeDetails_post()
    {
        $type = $this->post('type');
        $shiftID = $this->post('shiftID');
        $result = $this->invoice_model->getShiftTypeDetails($type,$shiftID);
        $this->response($result, 200);
    }
}
