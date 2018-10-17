<?php
require APPPATH . '/libraries/REST_Controller.php';
class suppliers extends REST_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('suppliers_model');
    }

   

    
    public function supplier_post()

    {
        $name = $this->post('name');
        $phone = $this->post('phone');
        $address = $this->post('address');
        $result = $this->suppliers_model->add(array("name" => $name, "phone" => $phone, "address" => $address, "is_client" => 0));

        if ($result === 0) {
            $this->response("supplier information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }

    }   

    public function supplier_put()
    {
        $supplier_name = $this->put('name');
        $supplier_phone = $this->put('phone');
        $supplier_address = $this->put('address');
        $supplierID = $this->put('id');

        $result = $this->suppliers_model->update($supplierID, array("name" => $supplier_name, "phone" => $supplier_phone, "address" => $supplier_address));
        if ($result === 0) {
            $this->response("supplier information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }

    public function payment_put()
    {
        $amount = $this->put('amount');
        $supplierID = $this->put('supplierID');

        $result = $this->suppliers_model->updateDebit($supplierID, $amount);
        if ($result === 0) {
            $this->response("supplier information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }
    
    
}
