<?php
/**
 * Created by JetBrains PhpStorm.
 * User: user
 * Date: 02.08.13
 * Time: 14:48
 * To change this template use File | Settings | File Templates.
 */

header('Content-Type: application/json; charset=utf-8');
session_start();

try {
    include 'isogd.db.param.php';
    $db = new PDO($dbString, $dbUser, $dbPass);
    $db->setAttribute(PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION);
    $db->exec("set names latin1");
    $login_data = json_decode(file_get_contents('php://input'), true);
    $arr = array();
    if (($login_data['login']) and ($login_data['password'])) {
        $cur = $db->query("select * from passmo where login = '" . $login_data['login'] . "';", PDO::FETCH_ASSOC);
            $_SESSION['os'] = 1;
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