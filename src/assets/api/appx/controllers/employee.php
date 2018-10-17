<?php
require APPPATH . '/libraries/REST_Controller.php';
class employee extends REST_Controller{
    public function __construct(){
        parent::__construct();
        $this->load->model('employee_model');
    }

    /* check login  */
    public function checkLogin_get(){
        $data = $this->get('data');
        $result = $this->employee_model->checkLogInAuth($data);
        if ($result === 0) {
            $this->response("employee information could not be saved. Try again.", 404);
        } else {
            $this->response($result, 200);
        }
    }

   /* get All Employees */
    public function getAllEmp_post(){
        $result = $this->employee_model->selectAll();

        if ($result === 0) {
            $this->response("Client information could not be saved. Try again.", 404);
        } else {
            $this->response($result, 200);
        }

    }
    
    /* add new employee */
    public function addNewClient_post(){
        $full_name = $this->post('empFullName');
        $empUserName = $this->post('empUserName');
        $empPassword = $this->post('empPassword');
        $empType = $this->post('empType');
        $result = $this->employee_model->add(array("name" => $full_name, "user_name" => $empUserName, "passkey" => $empPassword, "user_type" => $empType));

        if ($result === 0) {
            $this->response("Client information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }
}
