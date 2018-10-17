<?php
require APPPATH . '/libraries/REST_Controller.php';
class person extends REST_Controller{

    public function __construct(){
        parent::__construct();
        $this->load->model('person_model');
    }
    /* add new client */
    public function addClient_post(){
        $full_name = $this->post('clientFullName');
        $phone = $this->post('clientPhoneNumber');
        $initDebitAmount = $this->post('initDebitAmount');
        $type=1;
        $result = $this->person_model->add(array("full_name" => $full_name, "phone_number" => $phone, "debitAmount" => $initDebitAmount,"person_type"=>$type));

        if ($result === 0) {
            $this->response("Client information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }
    /* get All Clients */
    public function getAllClients_post(){
        $result = $this->person_model->selectAllClient();

        if ($result === 0) {
            $this->response("Client information could not be saved. Try again.", 404);
        } else {
            $this->response($result, 200);
        }

    }
}
