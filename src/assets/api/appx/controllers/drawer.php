<?php
require APPPATH . '/libraries/REST_Controller.php';
class drawer extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('drawer_model');
    }

    public function getTotalDarwer_get(){
        $shiftID = $this->get('shiftID');
        date_default_timezone_set("Asia/Beirut");
        $date=date("Y-m-d");
        $totalDrawer = $this->drawer_model->getTotalDarwer($date,$shiftID);
        // $initDrawer = $this->drawer_model->getStartDrawer($shiftID);
        // $result=[$totalDrawer,$initDrawer];
        if ($totalDrawer) {
            $this->response($totalDrawer, 200);
            exit;
        }
    }

    public function getDrawerDetails_get(){
        $shiftID = $this->get('shiftID');
        date_default_timezone_set("Asia/Beirut");
        $date=date("Y-m-d");
        $this->db->trans_begin();
        $drawerDetails = $this->drawer_model->getDrawerDetails($shiftID);
        // $totalDebits = $this->drawer_model->getTotalDebits($shiftID);
        // $result=[$drawerDetails,$totalDebits];

       
            /* End execut querys */ 
        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            if ($drawerDetails) {
                $this->response($drawerDetails, 200);
                exit;
            }
        }
    }
    
}
