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
            $this->response("Error. Try again.", 404);
        }else {
            $checkShift = $this->employee_model->isShiftOpen();
            // $this->response($result, 200);
            if ($checkShift === 0) {
                $this->response("Error. Try again.", 404);
            }else {
                $checkShift = $this->employee_model->isShiftOpen();
                $resp=[$result,$checkShift];
                $this->response($resp, 200);
            }
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
     /* check if shifts not closed  */
     public function isShiftOpened_get(){
        $result = $this->employee_model->isShiftOpen();
        if ($result === 0) {
            $this->response("Error. Try again.", 404);
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
    public function deleteEmployee_get(){
        $empID = $this->get('empID');
        $result = $this->employee_model->deleteEmployee($empID);

        if ($result === false) {
            $this->response("you can not", 404);
        } else {
            $this->response("success", 200);
        }

    }
    // edits Employee
    public function editEmployee_post()
    {
        $empFullName = $this->post('empFullName');
        $empUserName = $this->post('empUserName');
        $empPassword = $this->post('empPassword');
        $empType = $this->post('empType');
        $empID = $this->post('empID');

        $result = $this->employee_model->update($empID, array("name" => $empFullName, 
        "user_name" => $empUserName, "passkey" => $empPassword,'user_type'=>$empType));
        if ($result === 0) {
            $this->response("employee information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }
    /* add new employee */
    public function addNewShift_post(){
        $empID = $this->post('empID');
        $drawerAmount = $this->post('drawerAmount');
        $shiftDate = $this->post('shiftDate');
        $timeIn = $this->post('timeIn');
        $newShiftResult = $this->employee_model->recordNewShift(array("empID" => $empID, "shift_date" => $shiftDate, "timeIn" => $timeIn,'isOpen'=>1,'initDrawer'=>$drawerAmount));


        if ($newShiftResult === 0) {
            $this->response("Client information could not be saved. Try again.", 404);
        } else {
            $lastShiftID=$this->employee_model->getLastShiftID();
            $this->response($lastShiftID, 200);
        }
    }


    /* logout */
    public function logout_post(){
        /*START - Get Current Date Time */
        $currentFullDate=getdate();
        $d=$currentFullDate['mday'];
        $m=$currentFullDate['mon'];
        $y=$currentFullDate['year'];
        $time=date("h:i");
        $today_date=$y."-".$m."-".$d;
        /*END - Get Current Date Time */
        $shiftID=$this->post('shiftID');
        $totalDrawer=$this->post('totalDrawer');
        $logout=$this->employee_model->logout($shiftID,$time);
        $add=$this->employee_model->insertDrawer(array('shiftID'=> $shiftID , 'date' => $today_date, 'amount'=>$totalDrawer));

        if ($logout === 0) {
            $this->response("error, Try again.", 404);
        } else {
            $this->response('success', 200);
        }
    }
}
