<?php
include './connection.php';
openConn();
$type=$_GET["type"];
$requestData = $_REQUEST;
$rowsReq = (isset($_GET['length'])) ? intval($_GET['length']) : 10;
$start = (isset($_GET['start'])) ? intval($_GET['start']) : 0;
$orderString = "";
$rowsCount = mysqli_fetch_assoc(mysqli_query(openConn(), "SELECT COUNT(IID) as exp FROM item"))['exp'];
if (count($_GET['order'])) {
    $orderBy = $_GET['columns'][$_GET['order'][0]['column']]['data'];
    if($orderBy=='ID')
        $orderBy='IID';
    $orderDir = $_GET['order'][0]['dir'];
    $orderString = " ORDER BY " . $orderBy . " " . $orderDir;
}
if (isset($_GET["search"]["value"]) && !empty($_GET["search"]["value"])) {
    $search = $_GET["search"]["value"];
    $getAllFactureQuery = "SELECT * FROM item where type='".$type."' and ( name like '%" . $search . "%' OR card_company like '%" . $search . "%' ) ". $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;
} else {
    $getAllFactureQuery = " SELECT * FROM item where type='".$type."' " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;
}
$getAllFactureQuerySQL = mysqli_query(openConn(), $getAllFactureQuery);
$rowsCountFilter = mysqli_num_rows($getAllFactureQuerySQL);
$jsonData = "";
if ($getAllFactureQuerySQL) {
    while ($row = mysqli_fetch_assoc($getAllFactureQuerySQL)) {
        if ($row != null && $type !="creditTransfer") {
            if ($jsonData != "") {
                $jsonData = $jsonData . ",";
            }
            $jsonData = $jsonData . '{"ID":"' . $row['IID'] . '",';
            $jsonData = $jsonData . '"type":"' . $row['type'] . '",';
            $jsonData = $jsonData . '"name":"' . $row['name'] . '",';
            $jsonData = $jsonData . '"quantity":"' . $row['quantity'] . '",';
            $jsonData = $jsonData . '"price":"' . $row['price'] . '",';
            $jsonData = $jsonData . '"bar_code":"' . $row['bar_code'] . '",';
            $jsonData = $jsonData . '"card_company":"' . $row['card_company'] . '",';
            $jsonData = $jsonData . '"is_offers":"' . $row['is_offers'] . '"}';
        } 
        if($row != null && $type =="creditTransfer"){
            if ($jsonData != "") {
                $jsonData = $jsonData . ",";
            }
            $jsonData = $jsonData . '{"ID":"' . $row['IID'] . '",';
            // $jsonData = $jsonData . '"type":"' . $row['type'] . '",';
            // $jsonData = $jsonData . '"name":"' . $row['name'] . '",';
            $jsonData = $jsonData . '"quantity":"' . $row['quantity'] . '",';
            // $jsonData = $jsonData . '"price":"' . $row['price'] . '",';
            $jsonData = $jsonData . '"bar_code":"' . $row['bar_code'] . '",';
            $jsonData = $jsonData . '"card_company":"' . $row['card_company'] . '"}';
            // $jsonData = $jsonData . '"isOffers":"' . $row['is_offers'] . '"}';
        }
    }
}
$jsonData = '[' . $jsonData . ']';
$jsonData2 = '{"draw":' . intval($requestData['draw']) . ',"recordsTotal":' . $rowsCount . ', "recordsFiltered":' . $rowsCount . ', "data":' . $jsonData . '}';
echo ($jsonData2);
closeConn();
