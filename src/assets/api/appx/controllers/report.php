<?php
require APPPATH . '/libraries/REST_Controller.php';
class report extends REST_Controller{
    
    public function __construct(){
        parent::__construct();
        $this->load->model('report_model');
    }

    /* General Report */
    public function getReportResult_post(){

        $data = $this->post('data');
  
        $result = $this->report_model->getReportResult($data);

        if ($result === 0) {
            $this->response("Client information could not be saved. Try again.", 404);
        } else {
            $this->response($result, 200);
        }
    }


    /* Payment Report  */
    public function getPaymentReportResult_post(){

        $data = $this->post('data');
  
        $result = $this->report_model->getPaymentReportResult($data);

        if ($result === 0) {
            $this->response("Client information could not be saved. Try again.", 404);
        } else {
            $this->response($result, 200);
        }
    }

    

}
