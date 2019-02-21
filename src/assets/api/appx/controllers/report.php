<?php
require APPPATH . '/libraries/REST_Controller.php';
class report extends REST_Controller{
    
    public function __construct(){
        parent::__construct();
        $this->load->model('report_model');
    }

    /* check login  */
    public function getReportResult_post(){

        $data = $this->post('data');
  
        $result = $this->report_model->getReportResult($data);

        if ($result === 0) {
            $this->response("Error. Try again.", 404);
        }else {
            $checkShift = $this->report_model->isShiftOpen();
            // $this->response($result, 200);
            if ($checkShift === 0) {
                $this->response("Error. Try again.", 404);
            }else {
                $checkShift = $this->report_model->isShiftOpen();
                $resp=[$result,$checkShift];
                $this->response($resp, 200);
            }
        }
    }

}
