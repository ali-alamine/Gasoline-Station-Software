<?php
include './connection.php';
openConn();

$requestData = $_REQUEST;
$rowsReq = (isset($_GET['length'])) ? intval($_GET['length']) : 10;
$start = (isset($_GET['start'])) ? intval($_GET['start']) : 0;
$orderString = "";

$rowsCount = mysqli_fetch_assoc(mysqli_query(openConn(), "SELECT COUNT(PID) as exp FROM payment"))['exp'];

if (count($_GET['order'])) {
    $orderBy = $_GET['columns'][$_GET['order'][0]['column']]['data'];
    $orderDir = $_GET['order'][0]['dir'];
    $orderString = " ORDER BY " . $orderBy . " " . $orderDir;
}
if (isset($_GET["search"]["value"]) && !empty($_GET["search"]["value"])) {
    $search = $_GET["search"]["value"];
    $getPaymentsQuery = "SELECT * FROM payment where name like '%" . $search . "%' OR phone like '%" . $search . "%' OR address like '%" . $search . "%' OR rest like '%" . $search . "%' OR total like '%" . $search . "%'  " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;
} else {
    $getPaymentsQuery = " SELECT * FROM payment " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;
}

$getPaymentsQuerySQL = mysqli_query(openConn(), $getPaymentsQuery);
$rowsCountFilter = mysqli_num_rows($getPaymentsQuerySQL);
$jsonData = "";
if ($getPaymentsQuerySQL) {
    while ($row = mysqli_fetch_assoc($getPaymentsQuerySQL)) {
        if ($row != null) {
            if ($jsonData != "") {
                $jsonData = $jsonData . ",";
            }
            $jsonData = $jsonData . '{"ID":"' . $row['PID'] . '",';
            $jsonData = $jsonData . '"CID":"' . $row['CID'] . '",';
            $jsonData = $jsonData . '"type":"' . $row['type'] . '",';
            $jsonData = $jsonData . '"name":"' . $row['name'] . '",';
            $jsonData = $jsonData . '"date_d":"' . $row['payment_date'] . '",';
            $jsonData = $jsonData . '"amount":"' . $row['amount'] . '"}';
        }
    }
}
$jsonData = '[' . $jsonData . ']';
$jsonData2 = '{"draw":' . intval($requestData['draw']) . ',"recordsTotal":' . $rowsCount . ', "recordsFiltered":' . $rowsCount . ', "data":' . $jsonData . '}';
echo ($jsonData2);

closeConn();