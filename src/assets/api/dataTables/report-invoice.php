<?php
include './connection.php';
openConn();

$requestData = $_REQUEST;
$rowsReq = (isset($_GET['length'])) ? intval($_GET['length']) : 10;
$start = (isset($_GET['start'])) ? intval($_GET['start']) : 0;
$orderString = "";

$condition = "WHERE 1 ";
if (isset($_GET['invoiceType']) && $_GET['invoiceType'] != "-1") {
    $invoiceType = $_GET['invoiceType'];
    $condition = $condition . " AND inv_type IN( " . $invoiceType.") ";
}

if (isset($_GET['clientID']) && $_GET['clientID'] != "-1" && $_GET['clientID'] != "") {
    $clientID = $_GET['clientID'];
    $condition = $condition . " AND inv_perID IN( " . $clientID.") ";
}

if (isset($_GET['fromDate']) && isset($_GET['toDate']) && $_GET['fromDate'] != "") {
    $fromDate = $_GET['fromDate'];
    $toDate = $_GET['toDate'];
    $condition = $condition . " AND ( inv_date_req between '" . $fromDate . "' AND '" . $toDate . "' ) ";
}

if (isset($_GET['fromCode']) && isset($_GET['toCode']) && $_GET['fromCode'] != "" && $_GET['toCode'] != "") {
    $fromCode = $_GET['fromCode'];
    $toCode = $_GET['toCode'];
    $condition = $condition . " AND cast(SUBSTRING(inv_code,3) AS UNSIGNED ) between ".$fromCode." and ".$toCode;
}

if (count($_GET['order'])) {
    $orderBy = $_GET['columns'][$_GET['order'][0]['column']]['data'];
    $orderDir = $_GET['order'][0]['dir'];
    $orderString = " ORDER BY " . $orderBy . " " . $orderDir;
}
if (isset($_GET["search"]["value"]) && !empty($_GET["search"]["value"])) {
    $search = $_GET["search"]["value"];

    // $getAllFactureQuery = "select * invoice  where name like '%" . $search . "%' OR phone like '%" . $search . "%' OR address like '%" . $search . "%' OR subscriber_detail.profile like '%" . $search . "%' OR exp_date like '%" . $search . "%' " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

} else {

    $getAllFactureQuery = " select *,DATE_FORMAT(inv_date_req,'%d-%m-%Y') AS inv_date_req from invoice inner join person on invoice.inv_perID = person.perID " . $condition . " " . $orderString . " LIMIT " . $rowsReq . " OFFSET " . $start;

}

$rowsCount = mysqli_fetch_assoc(mysqli_query(openConn(), "select COUNT(*) as exp from invoice " . $condition))['exp'];

$getAllFactureQuerySQL = mysqli_query(openConn(), $getAllFactureQuery);
$rowsCountFilter = mysqli_num_rows($getAllFactureQuerySQL);
$jsonData = "";
if ($getAllFactureQuerySQL) {
    while ($row = mysqli_fetch_assoc($getAllFactureQuerySQL)) {
        if ($row != null) {
            if ($jsonData != "") {
                $jsonData = $jsonData . ",";
            }
            $jsonData = $jsonData . '{"invID":"' . $row['invID'] . '",';
            $jsonData = $jsonData . '"inv_code":"' . $row['inv_code'] . '",';
            $jsonData = $jsonData . '"per_name":"' . $row['per_name'] . '",';
            $jsonData = $jsonData . '"inv_type":"' . $row['inv_type'] . '",';
            $jsonData = $jsonData . '"inv_date_req":"' . $row['inv_date_req'] . '"}';
        }
    }
}
$jsonData = '[' . $jsonData . ']';
$jsonData2 = '{"draw":' . intval($requestData['draw']) . ',"recordsTotal":' . $rowsCount . ', "recordsFiltered":' . $rowsCount . ', "data":' . $jsonData . '}';
echo ($jsonData2);
closeConn();
