<?php
/**
 * Created by JetBrains PhpStorm.
 * User: user
 * Date: 02.08.13
 * Time: 14:48
 * To change this template use File | Settings | File Templates.
 */
session_start();
//$_SESSION['start'] = time(); // taking now logged in time $_SESSION['expire'] = $_SESSION['start'] + (30 * 60) ; // ending a session in 30     minutes from the starting time

//$x = odbc_connect("DSN=isogd;", "", "");
//$values = file_get_contents("php://input");
//$login_data = json_decode(file_get_contents('php://input'), true);
//
//
//if (($login_data['login']) and ($login_data['password'])) {
//    $sql = "select * from PassMO where login = '" . $login_data['login'] . "'";
//    $res = odbc_exec($x, $sql);
//    $result = odbc_fetch_array($res);
//
//    if (($result['Login'] == $login_data['login']) and ($result['Password'] == $login_data['password'])) {
//        $session_id = $result['ID'];
//        $_SESSION['session_id'] = $result['ID'];
//
//        echo json_encode($result);
//    } else {
//        echo "Invalid login or password";
//    }
//} else {
//    echo "Invalid data";
//}

try {
    include 'isogd.db.param.php';
//    $db = new PDO('sqlite:db/isogd.db');
    $db = new PDO($dbString, $dbUser, $dbPass);
    $db->setAttribute(PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION);
    $db->exec("set names latin1");

    $login_data = json_decode(file_get_contents('php://input'), true);
    $arr = array();
    if (($login_data['login']) and ($login_data['password'])) {
        $cur = $db->query("select * from passmo where login = '" . $login_data['login'] . "';", PDO::FETCH_ASSOC);

        //$os = php_uname("s");
       // if (strpos($os, 'Windows') !== false) {
            $_SESSION['os'] = 1;
       // } else {
        //    $_SESSION['os'] = 0;
       // }

        foreach ($cur as $result) {
            if ($result['Password'] == $login_data['password']) {
                $session_id = $result['ID'];
                $_SESSION['session_id'] = $result['ID'];
                $session_adm = $result['manager'];
                $_SESSION['session_adm'] = $result['manager'];
                $arr['ID'] = $result['ID'];
                $arr['NameMO'] = $result['NameMO'];
                $arr['manager'] = $result['manager'];
                echo json_encode($arr);
            } else {
                echo "Invalid login or password";
            }

        }
    }

} catch (Exception $e) {
    echo 'Выброшено исключение: ', $e->getMessage(), "\n";
}