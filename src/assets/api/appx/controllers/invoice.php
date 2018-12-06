<?php
require APPPATH . '/libraries/REST_Controller.php';

class invoice extends REST_Controller{

    public function __construct(){
        parent::__construct();
        $this->load->model('invoice_model');
    }
    /* Get All Lubricants */
    public function getSoldLubricants_get(){
        $result = $this->invoice_model->selectAll_byType($invoice_type);
        if ($result === 0) {
            $this->response("Client information could not be saved. Try again.", 404);
        } else {
            $this->response($result, 200);
        }
    }  
    
    public function getDetailInvoice_post(){

        $type = $this->post('type');
        // $isDebit = $this->post('isDebit');
        $shiftIDs = $this->post('shiftIDs');

        // $this->db->trans_begin();
        $result = $this->invoice_model->getDetailInvoice($type,$shiftIDs);
        // if ($this->db->trans_status() === false) {
        //     $this->db->trans_rollback();
        //     $this->response("Invoice information could not be saved. Try again.", 404);
        // } else {
        //     $this->db->trans_commit();
            $this->response($result, 200);
        // }
    }
    public function getShiftDetails_post(){
        // $type = $this->post('type');
        $fromExpDate = $this->post('fromExpDate');
        $toExpDate = $this->post('toExpDate');
        $empIDs = $this->post('empIDs');
        $empID = array();
        foreach ($empIDs as $id)
        {
            $empID[] = $id;
        }
        $result = $this->invoice_model->getShiftDetails($empID,$fromExpDate,$toExpDate);
        $totalCount = $this->invoice_model->countShiftDetails($empIDs,$fromExpDate,$toExpDate);
        $jsonData=[$result,$totalCount];
        if ($result == 0) {
            $this->response("shift information could not exist. Try again.", 404);
        } else {
            $this->response($jsonData, 200);
        }
    }  
    public function getShiftTypeDetails_post(){
        $type = $this->post('type');
        $shiftID = $this->post('shiftID');
        $result = $this->invoice_model->getShiftTypeDetails($type,$shiftID);
        $this->response($result, 200);
    }
    public function deleteInvoice_post(){

        $invID = $this->post('invID');
        $type = $this->post('type');
        $isSupply = $this->post('isSupply');
        $rest = $this->post('rest');
        $amount = $this->post('amount');
        $PID = $this->post('PID');
        $note = $this->post('note');
        $fuel_liters = $this->post('fuel_liters');
        $shiftID = $this->post('shiftID');
        $newShiftID = $this->post('newShiftID');

        $this->db->trans_begin();

        if($type == 'lub' || $type == 'access'){
            $orderDetails = $this->invoice_model->getOrderDetails($invID);
            if ($orderDetails != null) {
                foreach ($orderDetails as $row) {
                    $itemID = $row['itemID'];
                    $quantityOrder = $row['quantityOrder'];
                    if($isSupply == 0){
                        $this->invoice_model->updateQuantityStock($itemID,$quantityOrder);
                    }else{
                        $newCost = $row['newCost'];
                        $quantityStock = $row['quantityStock'];
                        $AVGCost = $row['AVGCost'];
                        $oldQuan = $quantityStock - $quantityOrder;
                        $oldCost = ( ($AVGCost * ($quantityOrder + $oldQuan) ) - ($quantityOrder * $newCost) ) / $oldQuan;
                        $this->invoice_model->updateStock($itemID,array('quantity' => $oldQuan,'cost' => $oldCost));
                    }
                    $this->invoice_model->deleteOrderInvoice($invID);
                }
            }
            if($rest > 0)
                $this->invoice_model->updatePersonDebit($PID, -$rest);
            if($newShiftID != $shiftID)
                $this->invoice_model->updateAmountDrawer($shiftID,-($amount-$rest));
            $this->invoice_model->deleteInvoice($invID);

        }else if($type == 'payC'){
            if($newShiftID != $shiftID)
                $this->invoice_model->updateAmountDrawer($shiftID,$amount);
            $this->invoice_model->deleteInvoice($invID);
        }else if($type == 'return'){
            $this->invoice_model->updateAmountDrawer($shiftID,-$amount);
            $this->invoice_model->updatePersonDebit($PID, +$amount);
            $this->invoice_model->deleteInvoice($invID);

        }else if($type == 'wash' || $type == '98_d' || $type == '95_d' || $type == 'dieselG_d' || $type == 'dieselR_d'){
            if($rest > 0){
                $this->invoice_model->updatePersonDebit($PID, -$rest);   
            }
            if($newShiftID != $shiftID)
                $this->invoice_model->updateAmountDrawer($shiftID,-($amount-$rest));
            $this->invoice_model->deleteInvoice($invID);
        }else if($type == 'Diesel G' || $type == 'Diesel R' || $type == '95' || $type == '98'){
            //sell
            if($isSupply == 0){
                $noteExplode = explode('-',$note);
                $counter=$noteExplode[0];
                $counterID=$noteExplode[1];
                    $result = $this->invoice_model->updateQuantityCounter($counterID,array($counter.'_quan'=>0,$counter=>0));
                
                $indexExplode = explode('_',$counter);
                $index=$indexExplode[1];
                $outPutContID = 'outputContID_'.$index;
                $dispID = $this->invoice_model->getDispID($counterID);
                $contID = $this->invoice_model->getContainerID($dispID,$outPutContID);
                $result = $this->invoice_model->updateDispanser($dispID,$counter,$fuel_liters);
                $result = $this->invoice_model->updateQuantityContainer($contID,$fuel_liters);
                if($newShiftID != $shiftID)
                    $this->invoice_model->updateAmountDrawer($shiftID,-($amount-$rest)); 
                $this->invoice_model->deleteInvoice($invID);
            }else if($isSupply != 0){
                //supply
                $contID = $note;
                $containerDetails = $this->invoice_model->getContainerDetails($contID);
                if ($containerDetails != null) {
                    foreach ($containerDetails as $row) {
                        $quantityStock = $row['quantityStock'];
                        $AVGCost = $row['AVGCost'];
                        $oldQuan = $quantityStock - $fuel_liters;
                        $newCost = $amount / $fuel_liters;
                        $oldCost = ( ($AVGCost * ($fuel_liters + $oldQuan) ) - ($fuel_liters * $newCost) ) / $oldQuan;
                        $this->invoice_model->updateContainer($contID,array('current_quan_liter' => $oldQuan,'cost_liter' => $oldCost));
                    }
                }
                $this->invoice_model->deleteInvoice($invID);
            }
        }

        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response("success", 200);
        }
    }
    
}
