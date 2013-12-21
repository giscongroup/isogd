<?php
/**
 * Created by JetBrains PhpStorm.
 * User: julia
 * Date: 09.08.13
 * Time: 13:21
 * To change this template use File | Settings | File Templates.
 */
session_start();

if (isset($_SESSION['session_id'])) {
    try {
        $post_data = json_decode(file_get_contents('php://input'), true);
//        $db = new PDO('sqlite:db/isogd.db');
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
            $fromDate = date("Y-m") . "-15";
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


            $fields = "";
            $isogdMonthFields = $db->query("DESCRIBE isogdweek");
            foreach ($isogdMonthFields as $r) {
                if ($r["Field"] !== 'Code' && $r["Field"] !== 'ID' && $r["Field"] !== 'week') {
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
            $fields = $fields . $sep . " week = '" . $currentDate . "'";

            $sql = "UPDATE isogdweek SET " . $fields . " WHERE ID =" . $post_data['ID'] . " and week BETWEEN '" . $fromDate . "' and '" . $toDate . "';";

            echo $sql;

            $db->exec($sql);


        } else {
            // нет - INSERT в таблицы isogd и isogdweek
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

            $fieldsIM = '';
            $valuesIM = '';
            $cur = $db->query("DESCRIBE isogdweek");
            foreach ($cur as $r) {
                if ($r["Field"] !== 'Code') {
                    if (is_null($post_data[$r["Field"]]) != true && $post_data[$r["Field"]] !== "") {

                        if ($fieldsIM !== "")
                            $fieldsIM = $fieldsIM . $sep . $r["Field"];
                        else
                            $fieldsIM = $r["Field"];

                        if ($valuesIM !== "")
                            $valuesIM = $valuesIM . $sep . "'" . $post_data[$r["Field"]] . "'";
                        else
                            $valuesIM = "'" . $post_data[$r["Field"]] . "'";
                    }
                }
            }

            $sql = "INSERT INTO isogdweek(" . $fieldsIM . ", week) values (" . $valuesIM . ", '" . $currentDate . "');";
            $db->exec($sql);
        }

        //////////////проверяем, есть ли записи для текущей недели //////////////////////////


        $monthExist = $db->query("SELECT * FROM isogdweek WHERE week BETWEEN '" . $fromDate . "' and '" . $toDate . "';", PDO::FETCH_ASSOC);
        $mE = $monthExist->fetchColumn();

        $cur = $db->query("SELECT * FROM isogd;", PDO::FETCH_ASSOC);
        $row = $cur->fetch();
        if ($mE) {
            //если есть - UPDATE

//            while ($row) {

//                $fields = "";
//                $isogdMonthFields = $db->query("DESCRIBE isogdweek");
//                foreach ($isogdMonthFields as $r) {
//                    if ($r["Field"] !== 'Code' && $r["Field"] !== 'ID' && $r["Field"] !== 'week') {
//                        if (is_null($row[$r["Field"]]) != true && $row[$r["Field"]] !== "") {
//
//                            if ($fields !== "")
//                                $fields = $fields . $sep . $r["Field"] . '=' . "'" . $row[$r["Field"]] . "'";
//                            else
//                                $fields = $r["Field"] . '=' . "'" . $row[$r["Field"]] . "'";
//
//                        } else {
//                            if ($fields !== "")
//                                $fields = $fields . $sep . $r["Field"] . '=' . "''";
//                            else
//                                $fields = $r["Field"] . '=' . "''";
//                        }
//                    }
//                }
//                $fields = $fields . $sep . " week = '" . $currentDate . "'";
//
//                $sql = "UPDATE isogdweek SET " . $fields . " WHERE ID =" . $row['ID'] . " and week BETWEEN '" . $fromDate . "' and '" . $toDate . "';";
//
//                $db->exec($sql);
//                $row = $cur->fetch();
//            }
        } else {
            // если нет - INSERT
            while ($row) {

                $fields = "";
                $values = "";
                $isogdMonthFields = $db->query("DESCRIBE isogdweek");
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
                $db->exec($sql);

                $row = $cur->fetch();
            }
        }

        echo 'Completed!';
    } catch (Exception $e) {

        echo 'Выброшено исключение: ', $e->getMessage(), "\n";
    }
}