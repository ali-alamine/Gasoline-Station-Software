<?php
require APPPATH . '/libraries/REST_Controller.php';
class operation extends REST_Controller{
    public function __construct(){
        parent::__construct();
        $this->load->model('operation_model');
    }
    /* Sell -  sell on debit  */
    public function addInvoice_post(){
        
        /*START - Get Current Date Time */
        $currentFullDate=getdate();
        $d=$currentFullDate['mday'];
        $m=$currentFullDate['mon'];
        $y=$currentFullDate['year'];
        $time=date("h:i");
        $today_date=$y."-".$m."-".$d."-".$time;
        /*END - Get Current Date Time */

        $personID = $this->post('personID');
        if($personID == null){
            $personID = 1 ;  /* refer to client debit sell */
        }
        $items = $this->post('items');
        $shiftID = $this->post('shiftID');
        $type = $this->post('type');
        $comment=$this->post('comment');
        $invoiceType = $this->post('invoiceType');
        $rest = $this->post('amountRest');
        $paid = $this->post('amountPaid');
        $amount = $rest + $paid;
        $totalProfit = $this->post('totalProfit');
        if($rest == null){
            $rest = 0; /* refer to sell on cash */
        } 
        /* start execut querys */ 
        $this->db->trans_begin();
        
        /* add debit persone */
        if($rest > 0){
            $this->operation_model->add_debit_person($personID,$rest);
        }
        /* check Type invoice */
        if($invoiceType == "supply"){
            $isSupply = 1;
        }else{
            $isSupply = 0;
        }
        /* insert into invoice  */
        $this->operation_model->add_inv(array("amount"=>$amount,
        "type" => $type,'dateTime'=>$today_date,'rest'=>$rest,'totalProfit'=>$totalProfit,"shiftID"=>$shiftID,
        "personID"=>$personID,"note"=>$comment,'isSupply'=>$isSupply));

        /* Get last inserted invoice ID */
        $invID = $this->db->insert_id(); 

        /* insert into inv_order */
        foreach($items as $row){
            $itemID=$row['itemID'];
            $itemName = $row['name'];
            $quantity = $row['quantity'];
            $price = $row['price'];

            /* update stock */
            if($invoiceType == "supply"){
                $cost=$price;
                $price = 0 ;
                $avgCost=$this->operation_model->calculate_avg_cost_item($itemID,$quantity,$cost);
                $this->operation_model->update_stock($itemID,$quantity);
                $this->operation_model->updateCost_stock($itemID,$avgCost);
            }
            else if($invoiceType != "supply"){
                $cost=0;
                $this->operation_model->update_stock($itemID,-$quantity);
            }

            /* add inv Order*/ 
            $this->operation_model->add_inv_order(array("invID"=>$invID,
            "itemID" => $itemID,'quantity'=>$quantity,'cost'=>$cost,'price'=>$price));
        }


        /* End execut querys */ 
        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response("success", 200);
        }        
    }
    /* sell wash service on debit */
    public function sellWashServiceOnDebit_post(){
         /*START - Get Current Date Time */
         $currentFullDate=getdate();
         $d=$currentFullDate['mday'];
         $m=$currentFullDate['mon'];
         $y=$currentFullDate['year'];
         $time=date("h:i");
         $today_date=$y."-".$m."-".$d."-".$time;
         /*END - Get Current Date Time */

        $shiftID=$this->post('shiftID');
        $personID=$this->post('personID');
        $amount = $this->post('totalPrice');
        $rest=$this->post('amountRest');
        $totalProfit = $this->post('totalPrice');
        $type = $this->post('type');
        //  $type = 'wash';
        $name='غسيل : '.$this->post('nameCar');
        $comment=$this->post('comment');
        if($comment != '')
        $name = $name. '. ملاحظة : '.$comment;
        /* insert into invoice  */
        $result = $this->operation_model->add_inv(array("amount"=>$amount,
        "type" => $type,'dateTime'=>$today_date,'rest'=>$rest,"totalProfit"=>$totalProfit,
        "shiftID"=>$shiftID,"personID"=>$personID,"note"=>$name));
        $str=$this->db->last_query();

        /* add debit persone */
        if($rest > 0){
            $this->operation_model->add_debit_person($personID,$rest);
        }
        
        if ($result === 0) {
            $this->response("Item information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }
    /* sell wash service on (cash) */
    public function sellWashService_post(){
         /*START - Get Current Date Time */
         $currentFullDate=getdate();
         $d=$currentFullDate['mday'];
         $m=$currentFullDate['mon'];
         $y=$currentFullDate['year'];
         $time=date("h:i");
         $today_date=$y."-".$m."-".$d."-".$time;
         /*END - Get Current Date Time */


        $shiftID=$this->post('shiftID');
        $personID=1; /* no registered client */
        $amount =$this->post('totalPrice');
        $totalProfit =$this->post('totalPrice');
        $rest=0;
        $type = $this->post('type');
        $name=$this->post('nameCar');

         
        /* insert into invoice  */
        $result = $this->operation_model->add_inv(array("amount"=>$amount,
        "type" => $type,'dateTime'=>$today_date,'rest'=>$rest,
        "totalProfit"=>$totalProfit,"shiftID"=>$shiftID,"personID"=>$personID,"note"=>'غسيل : '.$name));
        $str=$this->db->last_query();
        if ($result === 0) {
            $this->response("Item information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }
    /* payment Cost  */
    public function addPaymentCostInvoice_post(){
            
        /*START - Get Current Date Time */
        $currentFullDate=getdate();
        $d=$currentFullDate['mday'];
        $m=$currentFullDate['mon'];
        $y=$currentFullDate['year'];
        $time=date("h:i");
        $today_date=$y."-".$m."-".$d."-".$time;
        /*END - Get Current Date Time */
        
        $shiftID=$this->post('shiftID');
        $comment=$this->post('comment');
        $amount = $this->post('amount');
    
        /* start execut querys */ 
        $this->db->trans_begin();

        
        /* insert into invoice  */
        $this->operation_model->add_inv(array("amount"=>$amount,
        "type" => 'payC','dateTime'=>$today_date,'rest'=>0,"shiftID"=>$shiftID,
        "note"=>$comment,'isSupply'=>0));

        /* End execut querys */ 
        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response("success", 200);
        }
        
    }
    /* Return Debits  */
    public function addReturnInvoice_post(){
        /*START - Get Current Date Time */
        $currentFullDate=getdate();
        $d=$currentFullDate['mday'];
        $m=$currentFullDate['mon'];
        $y=$currentFullDate['year'];
        $time=date("h:i");
        $today_date=$y."-".$m."-".$d."-".$time;
        /*END - Get Current Date Time */
        
        $shiftID=$this->post('shiftID');
        $personID=$this->post('personID');
        $comment=$this->post('comment');
        $paidDebit = $this->post('paidDebit');
    
        /* start execut querys */ 
        $this->db->trans_begin();

        
        /* insert into invoice  */
        $this->operation_model->add_inv(array("amount"=>$paidDebit,
        "type" => 'return','dateTime'=>$today_date,'rest'=>0,"shiftID"=>$shiftID,
        "personID"=>$personID,"note"=>$comment,'isSupply'=>0));
        $this->operation_model->add_debit_person($personID,-$paidDebit);

        /* End execut querys */ 
        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response("success", 200);
        }
            
    }
    /* supply fuel */
    public function supplyFuel_post(){
        /*START - Get Current Date Time */
        $currentFullDate=getdate();
        $d=$currentFullDate['mday'];
        $m=$currentFullDate['mon'];
        $y=$currentFullDate['year'];
        $time=date("h:i");
        $today_date=$y."-".$m."-".$d."-".$time;
        /*END - Get Current Date Time */
        
        $shiftID=$this->post('shiftID');
        $supplierID=$this->post('supplierID');
        $amount = $this->post('totalPrice');
        $cost_liter = $this->post('cost_liter');
        $totalQuantityPerLiter = $this->post('quantityPerLiter');
        $containerID = $this->post('containerID');
        $fuel_type = $this->post('fuel_type');

        /* start execut querys */ 
        $this->db->trans_begin();

        /* insert into invoice  */
        $this->operation_model->add_inv(array("amount"=>$amount,
                                               "type" => $fuel_type,
                                               'dateTime'=>$today_date,
                                               'rest'=>0,
                                               'note'=>$containerID,
                                               "shiftID"=>$shiftID,
                                               "personID"=>$supplierID,
                                               'isSupply'=>1,
                                               'fuel_liters' => $totalQuantityPerLiter));


       /* START- Get fuel quantity and cost to calculate average cost */
       $avgCost=$this->operation_model->calculate_avg_cost($containerID,$totalQuantityPerLiter,$cost_liter);
       /* END- Get fuel quantity and cost to calculate average cost */



       /* update stock - fuel container */
       $this->operation_model->update_fuelContainer($containerID,$totalQuantityPerLiter,$avgCost);
        /* End execut querys */
        if ($this->db->trans_status() === false) {
            $this->db->trans_rollback();
            $this->response("Invoice information could not be saved. Try again.", 404);
        } else {
            $this->db->trans_commit();
            $this->response("success", 200);
        }
   }
   /* sell fuel on debit */
   public function sellFuelOnDebit_post(){
    /*START - Get Current Date Time */
    $currentFullDate=getdate();
    $d=$currentFullDate['mday'];
    $m=$currentFullDate['mon'];
    $y=$currentFullDate['year'];
    $time=date("h:i");
    $today_date=$y."-".$m."-".$d."-".$time;
    /*END - Get Current Date Time */

    $shiftID=$this->post('shiftID');
    $personID=$this->post('personID');
    $amount = $this->post('totalPrice');
    $rest=$this->post('amountRest');
    $type = $this->post('type');
    $comment=$this->post('comment');

    /* insert into invoice  */
    $result = $this->operation_model->add_inv(array("amount"=>$amount,
    "type" => $type,'dateTime'=>$today_date,'rest'=>$rest,
    "shiftID"=>$shiftID,"personID"=>$personID,"note"=>$comment));
    $str=$this->db->last_query();

    /* add debit persone */
    if($rest > 0){
        $this->operation_model->add_debit_person($personID,$rest);
    }
    
    if ($result === 0) {
        $this->response("Item information could not be saved. Try again.", 404);
    } else {
        $this->response("success", 200);
    }
    }
}

