<?php
require APPPATH . '/libraries/REST_Controller.php';
class container extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('container_model');
    }


    public function getFuelContainer_get(){

        // $searchInput = $this->get('searchInput');
        $result = $this->container_model->getAllContainer();
        if ($result === 0) {
            $this->response("Client information could not be saved. Try again.", 404);
        } else {
            $this->response($result, 200);
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
