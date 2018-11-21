<?php
require APPPATH . '/libraries/REST_Controller.php';
class dispanser extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('dispanser_model');
    }

    // function bookByIsbn_get(){
    //     $isbn  = $this->get('isbn');
    //     if(!$isbn){
    //         $this->response("No ISBN specified", 400);
    //         exit;
    //     }

    //     $result = $this->book_model->getbookbyisbn( $isbn );
    //     if($result){
    //         $this->response($result, 200);
    //         exit;
    //     }
    //     else{
    //         $this->response("Invalid ISBN", 404);
    //         exit;
    //     }
    // }

    public function getDispanserCounters_get(){
        // $searchInput = $this->get('searchInput');
        $result = $this->dispanser_model->getAllCounters();
        if ($result === 0) {
            $this->response("Client information could not be saved. Try again.", 404);
        } else {
            $this->response($result, 200);
        }
    }

    public function submit_counters_post(){
        $counter_form_1=$this->post('counterForm_1');
        $counter_form_2=$this->post('counterForm_2');

        $dispID=$counter_form_1['dispID'];

        $counter_1=$counter_form_1['counter_1'];
        $counter_2=$counter_form_2['counter_2'];

        $fuel_type_1=$counter_form_1['fuel_type'];
        $fuel_type_2=$counter_form_2['fuel_type'];
        
        $shiftID=$counter_form_1['shiftID'];

        $contID_1=$counter_form_1['containerID'];
        $contID_2=$counter_form_2['containerID'];

        $liters_sold_1=$counter_form_1['liters_sold'];
        $liters_sold_2=$counter_form_2['liters_sold'];

        $price_liter_1=$counter_form_1['price_liter'];
        $price_liter_2=$counter_form_2['price_liter'];

        $cost_liter_1=$counter_form_1['cost_liter'];
        $cost_liter_2=$counter_form_2['cost_liter'];

        $totalProfit_1=($price_liter_1 - $cost_liter_1) * $liters_sold_1;
        $totalProfit_2=($price_liter_2 - $cost_liter_2) * $liters_sold_2;

        $totalPrice_1=$price_liter_1 * $liters_sold_1;
        $totalPrice_2=$price_liter_2 * $liters_sold_2;
        /* start execut querys */ 
        $this->db->trans_begin();
        
        $result = $this->dispanser_model->submit_dispnser_counters(array("dispID" => $dispID,
                                                                                        "counter_1" => $counter_1,
                                                                                        "counter_2" => $counter_2,
                                                                                        "counter_1_quan"=>$liters_sold_1,
                                                                                        "counter_2_quan"=>$liters_sold_2,
                                                                                        "shiftID" => $shiftID)
                                                                                    );

        $result_updateDispanser_counters= $this->dispanser_model->updateDispanserCounters($counter_1,$counter_2,$dispID);
        $result_updateFuel_containers_1= $this->dispanser_model->updateFuel_container($contID_1,$liters_sold_1);
        $result_updateFuel_containers_2= $this->dispanser_model->updateFuel_container($contID_2,$liters_sold_2);


        $result_add_inv= $this->dispanser_model->add_inv(array("type" => $fuel_type_1,
                                                                "amount" => $totalPrice_1,
                                                                "note" => "test Note",
                                                                "totalProfit" => $totalProfit_1,
                                                                "shiftID" => $shiftID,
                                                                "fuel_liters" => $liters_sold_1)
                                                            );
        $result_add_inv= $this->dispanser_model->add_inv(array("type" => $fuel_type_2,
                                                                "amount" => $totalPrice_2,
                                                                "note" => "test Note",
                                                                "totalProfit" => $totalProfit_2,
                                                                "shiftID" => $shiftID,
                                                                "fuel_liters" => $liters_sold_2)
                                                            );

        /* End execut querys */
        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response("success", 200);
        }
    }
    

    
    // public function client_post() // used in I-print

    // {
    //     $name = $this->post('name');
    //     $phone = $this->post('phone');
    //     $address = $this->post('address');
    //     $result = $this->client_model->add(array("name" => $name, "phone" => $phone, "address" => $address));

    //     if ($result === 0) {
    //         $this->response("Client information could not be saved. Try again.", 404);
    //     } else {
    //         $this->response("success", 200);
    //     }

    // }

    // public function client_put() // used in I-print

    // {
    //     $client_name = $this->put('name');
    //     $client_phone = $this->put('phone');
    //     $client_address = $this->put('address');
    //     $clientID = $this->put('id');

    //     $result = $this->client_model->update($clientID, array("name" => $client_name, "phone" => $client_phone, "address" => $client_address));
    //     if ($result === 0) {
    //         $this->response("Client information could not be saved. Try again.", 404);
    //     } else {
    //         $this->response("success", 200);
    //     }
    // }

    // public function deleteClient_put()
    // {
    //     $id = $this->put('ID');

    //     if (!$id) {
    //         $this->response("Parameter missing", 404);
    //     }
    //     if ($this->client_model->delete($id)) {
    //         $this->response("Success", 200);
    //     } else {

    //         $this->response("Cannot Delete this client, try to delete its plates, jobs and payments", 400);
    //     }

    // }

    // public function clientUsers_get(){

    //     $clientID = $this->get('clientID');
    //     $result = $this->client_model->getClientUsers($clientID);
    //     if ($result) {
    //         $this->response($result, 200);
    //     } else {
    //         $this->response("No record found", 404);
    //     }
    // }

    // public function updateClientPermission_put()
    // {
    //     $clientIDArray = $this->put('params');
    //     $users = $this->put('users');
    //     $clientID = $clientIDArray["clientID"];

    //     foreach ($users as $key => $value) {
    //         if ($value["selected"] == 1) {
    //             $this->client_model->addPermission($clientID, $value["UID"]);
    //         } else {
    //             $this->client_model->deletePermission($clientID, $value["UID"]);
    //         }

    //     }

    // }

    // public function loginTest_post()
    // { //test
    //     // call login function
    //     $arraydata = array(
    //         'username' => 'ahmad123',
    //         'role' => 'admin',
    //         'userID' => '1',
    //     );
    //     $this->session->set_userdata($arraydata);

    //     $this->response('result', 200);
    // }

}
