<?php
require APPPATH . '/libraries/REST_Controller.php';

class stock extends REST_Controller{

    public function __construct(){
        parent::__construct();
        $this->load->model('stock_model');
    }

    /* Add new lubricants with initial quantity */
    public function addNewLub_post(){
        $name = $this->post('name');
        $quantity = $this->post('quantity');
        $selling = $this->post('selling');
        $cost = $this->post('cost');
        $item_type = 'lub';

        $result = $this->stock_model->add(array("name" => $name, "selling_price" => $selling,
        "item_type" => $item_type,"quantity"=>$quantity,'cost'=>$cost));
        if ($result === 0) {
            $this->response("Item information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }
    /* update the quantity of container */
    public function updateContainerQuantity_post(){
        $contID=$this->post('contID');
        $newQuan_liter=$this->post('newQuan');
        $result = $this->stock_model->updateContainerQuantity($contID,$newQuan_liter);
       if ($result === 0) {
           $this->response("person information could not be saved. Try again.", 404);
       } else {
           $this->response("success", 200);
       }
    }
    /* Add new accessorie with initial quantity */
    public function addNewAccess_post(){
        $name = $this->post('name');
        $quantity = $this->post('quantity');
        $selling = $this->post('selling');
        $cost = $this->post('cost');
        $item_type = 'access';

        $result = $this->stock_model->add(array("name" => $name, "selling_price" => $selling,
        "item_type" => $item_type,"quantity"=>$quantity,'cost'=>$cost));
        if ($result === 0) {
            $this->response("Item information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }

    /* Get Lubricants - offset , limit  */
    public function getLubricant_post(){
        $limit=$this->post('limit');
        $offset=$this->post('offset');
        $result = $this->stock_model->select_item($offset,$limit,'lub');
        $totalCount = $this->stock_model->countStockItems('lub');
        $jsonData=[$result,$totalCount];
        if ($result === 0) {
            $this->response("Lubricant information could not be saved. Try again.", 404);
        } else {
            $this->response($jsonData, 200);
        }
    }   
    /* Get All Lubricants */
    public function getAllLubricants_get(){
        $result = $this->stock_model->selectAll_lub();
        if ($result === 0) {
            $this->response("Client information could not be saved. Try again.", 404);
        } else {
            $this->response($result, 200);
        }
    }

    /* Get All Accessories */
    public function getAllFuelContainers_get(){
        $result = $this->stock_model->selectAll_fuelContainers();

        if ($result === 0) {
            $this->response("Client information could not be saved. Try again.", 404);
        } else {
            $this->response($result, 200);
        }
    }   
    /* Get All Accessories */
    public function getAllAccess_get(){
        $result = $this->stock_model->selectAll_access();

        if ($result === 0) {
            $this->response("Client information could not be saved. Try again.", 404);
        } else {
            $this->response($result, 200);
        }
    }   

    /* Get Accessories - offset , limit  */
    public function getAccessories_post(){
        $limit=$this->post('limit');
        $offset=$this->post('offset');
        $result = $this->stock_model->select_item($offset,$limit,'access');
        $totalCount = $this->stock_model->countStockItems('access');
        $jsonData=[$result,$totalCount];
        if ($result === 0) {
            $this->response("Accessories information could not be saved. Try again.", 404);
        } else {
            $this->response($jsonData, 200);
        }
    } 
    /* deleted stock  */
    public function deleteStock_get(){
        $itemID = $this->get('itemID');
        $result = $this->stock_model->deleteStock($itemID);

        if ($result == false) {
            $this->response("you can not", 404);
        } else {
            $this->response("success", 200);
        }

    }
    // edits stock
    public function editStock_post()
    {
        $name = $this->post('name');
        $quantity = $this->post('quantity');
        $selling = $this->post('selling');
        $cost = $this->post('cost');
        $itemID = $this->post('itemID');

        $result = $this->stock_model->update($itemID, array("name" => $name, "quantity" => $quantity,
         "selling_price" => $selling,'cost'=>$cost));
        if ($result === 0) {
            $this->response("person information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }
}
