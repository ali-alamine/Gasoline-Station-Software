<?php
require APPPATH . '/libraries/REST_Controller.php';
class operation extends REST_Controller{
    public function __construct(){
        parent::__construct();
        $this->load->model('operation_model');
    }
    /* Sell */
    public function sell_post(){
        
        /*START - Get Current Date Time */
        $currentFullDate=getdate();
        $d=$currentFullDate['mday'];
        $m=$currentFullDate['mon'];
        $y=$currentFullDate['year'];
        $time=date("h:i");
        $today_date=$y."-".$m."-".$d."-".$time;
        /*END - Get Current Date Time */

        $rest = $this->post('amountRest');
        if($rest==null){
            $rest = 0; /* refer to sell on cash */
        }
        $itemID=$this->post('itemID');
        
        $comment=$this->post('comment');
        if($comment==null){
            $comment="cash";
        }
        $empID=$this->post('empID');
        $clientID=$this->post('clientID');
        if($clientID != null){
            $personID=$clientID ;  /* refer to client debit sell */
        }else{
            $personID=0; /* refer to client cash sell*/
        }
       
        $itemName = $this->post('name');
        $amount = $this->post('totalPrice');
        $type = $this->post('type');
        $price=$this->post('price');
        $quantity=$this->post('quantity');
        $cost=0;

        /* insert into invoice  */
        $result = $this->operation_model->add_inv(array("amount"=>$amount,
        "type" => $type,'dateTime'=>$today_date,'rest'=>$rest,"empID"=>$empID,"personID"=>$personID,"note"=>$comment));

        /* Get last inserted invoice ID */
        $invID = $this->db->insert_id(); 

        /* insert into inv_order */
        $result = $this->operation_model->add_inv_order(array("invID"=>$invID,
        "itemID" => $itemID,'quantity'=>$quantity,'cost'=>$cost,'price'=>$price));

        /* update stock */
        $result = $this->operation_model->update_stock($itemID,$quantity);

        if ($result === 0) {
            $this->response("Item information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
        
    }

    public function sellWashService_post(){
         /*START - Get Current Date Time */
         $currentFullDate=getdate();
         $d=$currentFullDate['mday'];
         $m=$currentFullDate['mon'];
         $y=$currentFullDate['year'];
         $time=date("h:i");
         $today_date=$y."-".$m."-".$d."-".$time;
         /*END - Get Current Date Time */

         $rest=0; /* rest set to 0 means that price is payed cash */
         $itemID='1';
         $empID=$this->post('empID');
         $personID="0"; /* refer to client */
         $name = $this->post('machineName');
         $amount = $this->post('price');
         $type = 'wash';
         $quantity=1;
         $cost=0;

        /* insert into invoice  */
        $result = $this->operation_model->add_inv(array("amount"=>$amount,
        "type" => $type,'dateTime'=>$today_date,'rest'=>$rest,"empID"=>$empID));
        $str=$this->db->last_query();
        if ($result === 0) {
            $this->response("Item information could not be saved. Try again.", 404);
        } else {
            $this->response("success", 200);
        }
    }
}
