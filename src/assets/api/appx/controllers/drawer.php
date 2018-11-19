<?php
require APPPATH . '/libraries/REST_Controller.php';
class drawer extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('drawer_model');
    }

    public function getTotalDarwer_get()
    {
        $shiftID = $this->get('shiftID');
        date_default_timezone_set("Asia/Beirut");
        $date=date("Y-m-d");
        $result = $this->drawer_model->getTotalDarwer($date,$shiftID);
        if ($result) {
            $this->response($result, 200);
            exit;
        }
    }
    
}
