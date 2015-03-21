<?php
/**
 * Created by JetBrains PhpStorm.
 * User: julia
 * Date: 09.08.13
 * Time: 13:21
 * To change this template use File | Settings | File Templates.
 */
header('Content-Type: application/json; charset=utf-8');
session_start();

if (isset($_SESSION['session_id'])) {
    try {
        $post_data = json_decode(file_get_contents('php://input'), true);
        include 'isogd.db.param.php';
        $db = new PDO($dbString, $dbUser, $dbPass);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $db->exec("set names latin1");
        $fields = "";
        $values = "";
        $sep = ", ";

        $currentDate = date("Y-m-d");

        if (date("d") <= 15) {
            $fromDate = date("Y-m") . "-00";
            $toDate = date("Y-m") . "-15";
        } else {
            $fromDate = date("Y-m") . "-16";
            $toDate = date("Y-m") . "-32";
        }

        //////вставляем запись в лог///////////////////////////////////////
        $cur = $db->query("DESCRIBE isogdarch");

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

        $sql = "INSERT INTO isogdarch(" . $fields . ") values (" . $values . ");";

        $db->exec($sql);

        //////проверяем, есть ли запись с таким айди в таблице ИСОГД///////////////////////
        $cur = $db->query("SELECT * FROM isogd WHERE ID = " . $_SESSION['session_id'] . ";", PDO::FETCH_ASSOC);
        $row = $cur->fetchColumn();
        //если есть, то делаем UPDATE
        if ($row) {

            $cur = $db->query("DESCRIBE isogd;");
            $fields = "";

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
            $sql = "UPDATE isogd SET " . $fields . " WHERE ID =" . $post_data['ID'] . ";";

            $db->exec($sql);

        } else {
            // нет - INSERT в таблицы isogd
            $fields = "";
            $values = "";
            $sep = ", ";

            $cur = $db->query("DESCRIBE isogd;");

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

            $sql = "INSERT INTO isogd(" . $fields . ") values (" . $values . ");";
            $db->exec($sql);
        }

        //////////////проверяем, есть ли записи для текущей недели //////////////////////////

        $cur = $db->query("SELECT * FROM isogd;", PDO::FETCH_ASSOC);
        $row = $cur->fetch();
        while ($row) {
            $fields = "";
            $values = "";
            $isogdMonthFields = $db->query("DESCRIBE isogdweek");

            $monthExist = $db->query("SELECT * FROM isogdweek WHERE week BETWEEN '" . $fromDate . "' and '" . $toDate . "' and ID = " . $row['ID'] . ";", PDO::FETCH_ASSOC);
            $mE = $monthExist->fetchColumn();
            if ($mE) {

                $fields = "";
                $isogdMonthFields = $db->query("DESCRIBE isogdweek");
                foreach ($isogdMonthFields as $r) {
                    if ($r["Field"] !== 'Code' && $r["Field"] !== 'ID' && $r["Field"] !== 'week') {
                        if (is_null($row[$r["Field"]]) != true && $row[$r["Field"]] !== "") {

                            if ($fields !== "")
                                $fields = $fields . $sep . $r["Field"] . '=' . "'" . $row[$r["Field"]] . "'";
                            else
                                $fields = $r["Field"] . '=' . "'" . $row[$r["Field"]] . "'";

                        } else {
                            if ($fields !== "")
                                $fields = $fields . $sep . $r["Field"] . '=' . "''";
                            else
                                $fields = $r["Field"] . '=' . "''";
                        }
                    }
                }
                $fields = $fields . $sep . " week = '" . $currentDate . "'";

                $sql = "UPDATE isogdweek SET " . $fields . " WHERE ID =" . $row['ID'] . " and week BETWEEN '" . $fromDate . "' and '" . $toDate . "';";

               // $db->exec($sql);

            } else {
                foreach ($isogdMonthFields as $r) {
                    if ($r["Field"] !== 'Code') {
                        if (is_null($row[$r["Field"]]) != true && $row[$r["Field"]] !== "") {


                            if ($fields !== "")
                                $fields = $fields . $sep . $r["Field"];
                            else
                                $fields = $r["Field"];
                            if ($values !== "")
                                $values = $values . $sep . "'" . $row[$r["Field"]] . "'";
                            else
                                $values = "'" . $row[$r["Field"]] . "'";
                        }
                    }
                }
                $sql = "INSERT INTO isogdweek(" . $fields . ", week) values (" . $values . ", '" . $currentDate . "');";
            }
            
            $db->exec($sql);
            // echo $sql;

            $row = $cur->fetch();
        }
        // }

        echo 'Completed!';
    } catch (Exception $e) {

        echo 'Выброшено исключение: ', $e->getMessage(), "\n",$sql;
    }
}