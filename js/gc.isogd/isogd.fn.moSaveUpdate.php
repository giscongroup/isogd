<?php
/**
 * Created by JetBrains PhpStorm.
 * User: julia
 * Date: 12.08.13
 * Time: 9:25
 * To change this template use File | Settings | File Templates.
 */
session_start();

if (isset($_SESSION['session_id'])) {
    try {
        $post_data = json_decode(file_get_contents('php://input'), true);
//        $db = new PDO('sqlite:db/isogd.db');
        include 'isogd.db.param.php';
        $db = new PDO($dbString, $dbUser, $dbPass);
        $db->setAttribute(PDO::ATTR_ERRMODE,
            PDO::ERRMODE_EXCEPTION);
        $db->exec("set names latin1");

        /////////////////////////////////UPDATE table General_Information//////////////////////////////////////////////////////
        $cur = $db->query("SELECT * FROM General_Information WHERE ID = " . $_SESSION['session_id'] . ";", PDO::FETCH_ASSOC);
        $arr = array();
        foreach ($cur as $row) {
            $arr[] = $row;
        }


        if (count($arr) > 0) {
            $fields = "";
            $values = "";
            $sep = ", ";

            $cur = $db->query("DESCRIBE General_Information;");

            foreach ($cur as $r) {
                if ($r["Field"] !== 'Code') {
                    if (is_null($post_data[$r["Field"]]) != true && $post_data[$r["Field"]] !== "") {

                        if ($fields !== "")
                            $fields = $fields . $sep . $r["Field"] . '=' . "'" . $post_data[$r["Field"]] . "'";
                        else
                            $fields = $r["Field"] . '=' . "'" . $post_data[$r["Field"]] . "'";

                    } else {
                        if ($fields !== "")
                            $fields = $fields . $sep . $r["Field"] . '=' . "''";
                        else
                            $fields = $r["Field"] . '=' . "''";
                    }
                }
            }
            $sql = "UPDATE General_Information SET " . $fields . " WHERE ID =" . $post_data['ID'] . ";";

            $db->exec($sql);


        } else {

            $fields = "";
            $values = "";
            $sep = ", ";

            $cur = $db->query("DESCRIBE General_Information;");

            foreach ($cur as $r) {
                if ($r["Field"] !== 'Code') {
                    if (is_null($post_data[$r["Field"]]) != true && $post_data[$r["Field"]] !== "") {

                        if ($fields !== "")
                            $fields = $fields . $sep . $r["Field"];
                        else
                            $fields = $r["Field"];

                        if ($values !== "")
                            $values = $values . $sep . "'" . $post_data[$r["Field"]] . "'";
                        else
                            $values = "'" . $post_data[$r["Field"]] . "'";
                    }
                }
            }

            $sql = "INSERT INTO General_Information(" . $fields . ") values (" . $values . ");";
            $db->exec($sql);
        };

//////////////////////////////UPDATE table MO /////////////////////////////
        $cur = $db->query("SELECT * FROM MO WHERE ID = " . $_SESSION['session_id'] . ";", PDO::FETCH_ASSOC);
        $arr = array();
        foreach ($cur as $row) {
            $arr[] = $row;
        }


        if (count($arr) > 0) {
            $fields = "";
            $values = "";
            $sep = ", ";

            $cur = $db->query("DESCRIBE MO;");

            foreach ($cur as $r) {
                if ($r["Field"] !== 'Code') {
                    if (is_null($post_data[$r["Field"]]) != true && $post_data[$r["Field"]] !== "") {

                        if ($fields !== "")
                            $fields = $fields . $sep . $r["Field"] . '=' . "'" . $post_data[$r["Field"]] . "'";
                        else
                            $fields = $r["Field"] . '=' . "'" . $post_data[$r["Field"]] . "'";

                    } else {
                        if ($fields !== "")
                            $fields = $fields . $sep . $r["Field"] . '=' . "''";
                        else
                            $fields = $r["Field"] . '=' . "''";
                    }
                }
            }
            $sql = "UPDATE MO SET " . $fields . " WHERE ID =" . $post_data['ID'] . ";";

            $db->exec($sql);

        } else {

            $fields = "";
            $values = "";
            $sep = ", ";

            $cur = $db->query("DESCRIBE MO;");

            foreach ($cur as $r) {
                if ($r["Field"] !== 'Code') {
                    if (is_null($post_data[$r["Field"]]) != true && $post_data[$r["Field"]] !== "") {

                        if ($fields !== "")
                            $fields = $fields . $sep . $r["Field"];
                        else
                            $fields = $r["Field"];

                        if ($values !== "")
                            $values = $values . $sep . "'" . $post_data[$r["Field"]] . "'";
                        else
                            $values = "'" . $post_data[$r["Field"]] . "'";
                    }
                }
            }

            $sql = "INSERT INTO MO(" . $fields . ") values (" . $values . ");";
            $db->exec($sql);
        };
        echo 'Completed!';
    } catch (Exception $e) {
        echo 'Выброшено исключение: ', $e->getMessage(), "\n";
    }
}