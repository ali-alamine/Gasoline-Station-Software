<?php
require APPPATH . '/libraries/REST_Controller.php';
class person extends REST_Controller{

    public function __construct(){
        parent::__construct();
        $this->load->model('person_model');
    }
    /* add new client */
    public function addPerson_post(){
        $full_name = $this->post('name');
        $phone = $this->post('phone');
        $initDebitAmount = $this->post('initDebitAmount');
        if($initDebitAmount == null) $initDebitAmount=0;
        $isClient = $this->post('isClient');
        $result = $this->person_model->add(array("full_name" => $full_name, "phone_number" => $phone, "debitAmount" => $initDebitAmount,"person_type"=>$isClient));
        $PID = $this->db->insert_id(); 

        if ($result === 0) {
            $this->response("Person information could not be saved. Try again.", 404);
        } else {
            $this->response($PID, 200);
        }
    }
    /* get All Clients */
    public function getAllClients_post(){
        $isClient = $this->post('isClient');
        $result = $this->person_model->selectAllClient($isClient);

        if ($result === 0) {
            $this->response("Client information could not be saved. Try again.", 404);
        } else {
            $this->response($result, 200);
        }

    }
}
