<?php
require APPPATH . '/libraries/REST_Controller.php';
class employee extends REST_Controller{
    public function __construct(){
        parent::__construct();
        $this->load->model('employee_model');
    }

    /* check login  */
    public function checkLogin_post(){
        $username = $this->post('username');
        $password = $this->post('password');
        // $shift_date = $this->post('shift_date');
        date_default_timezone_set("Asia/Beirut");
        $shift_date=date("Y-m-d");
        $result = $this->employee_model->checkLogInAuth($username,$password);
        if($result === 0){
            $this->response("Error user or pass. Try again.", 404);
        } 
        else{
            foreach ($result as $row) {
                $isAdmin = $row->user_type;
                $empID = $row->empID;
            } 
            // if($isAdmin == 0){
                $result2 = $this->employee_model->check_open_shift($empID,$shift_date,$isAdmin);
                // $response = array();
                // $response[0] = $result;
                // $response[1] = '';
                if($result2 == 0 &&  $isAdmin == 0){
                    // $response[1] = 'Old shift no closed!';
                    $this->response('Old shift no closed!', 200);
                // }else if($result2 == 0 &&  $isAdmin == 1){
                //     // $response[1] = 'newShiftAdmin';
                //     $this->response($response, 200);
                }else{
                    $this->response($result, 200);
                    // exit;

                }
            // } else{
            //     $result2 = $this->employee_model->check_emp_shift($empID,$shift_date);
            //     $this->response($result, 200);
            // }
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
    public function addNewEmployee_post(){
        $full_name = $this->post('empFullName');
        $empUserName = $this->post('empUserName');
        $empPassword = $this->post('empPassword');
        $empType = $this->post('empType');
        $result = $this->employee_model->add('employee',array("name" => $full_name, "user_name" => $empUserName, "passkey" => $empPassword, "user_type" => $empType));

        if ($result === 0) {
            $this->response("Client information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }
    /* get All Employees */
    public function getTodayEmp_post(){
        $today = $this->post('today');
        $result = $this->employee_model->getTodayEmp();

        if ($result === 0) {
            $this->response("emp information could not be saved. Try again.", 404);
        } else {
            $this->response($result, 200);
        }

    } /* deleted employee  */
    public function deleteEmployee_post(){
        $empID = $this->post('empID');
        $result = $this->employee_model->deletePerson($empID);

        if ($result === false) {
            $this->response("you can not", 404);
        } else {
            $this->response("success", 200);
        }

    }
    // edits Employee
    public function editEmployee_put()
    {
        $empFullName = $this->put('empFullName');
        $empUserName = $this->put('empUserName');
        $empPassword = $this->put('empPassword');
        $empID = $this->put('empID');

        $result = $this->employee_model->update($empID, array("name" => $empFullName, 
        "user_name" => $empUserName, "passkey" => $empPassword));
        if ($result === 0) {
            $this->response("employee information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }
}
