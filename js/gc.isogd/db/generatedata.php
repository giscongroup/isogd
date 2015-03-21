<?php
/**
 * User: Julia Suhinina
 * Date: 22.08.13
 * Time: 10:54
 * Description:
 */

try {
    $ids = array(
        1 => 1,
        2 => 10,
        3 => 23,
        4 => 28,
        5 => 40,
        6 => 49,
        7 => 60,
        8 => 76,
        9 => 87,
        10 => 99,
        11 => 109,
        12 => 118,
        13 => 128,
        14 => 139,
        15 => 150,
        16 => 157,
        17 => 169,
        18 => 180,
        19 => 193,
        20 => 207,
        21 => 220,
        22 => 235,
        23 => 245,
        24 => 254,
        25 => 269,
        26 => 281,
        27 => 291,
        28 => 304,
        29 => 320,
        30 => 326,
        31 => 335,
        32 => 348,
        33 => 359,
        34 => 373,
        35 => 384,
        36 => 395,
        37 => 411,
        38 => 420,
        39 => 421,
        40 => 422,
        41 => 423,
        42 => 424,
        43 => 425,
        44 => 426
    );

    $db = new PDO('sqlite:isogd.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    foreach ($ids as $id) {
        $post_data = array(
            'Code' => 1,
            'NameOfStructural' => 'отдел ведения ИСОГД',
            'NumberOfEmployees' => 5,
            'NumberOfEmployees2' => 2,
            'ExistenceDocumentPayment' => array(87, 88, 89),
            'NameDocumentPayment' => 'Решение Совета муниципального образования',
            'NumberDocumentPayment' => 23423,
            'FinancingCurrentYear' => 1000000,
            'ActualFinancingCurrentYear' => 1000000,
            'DateDocumentPayment' => '2013-08-02',
            'SizePayment1' => 1000,
            'SizePayment2' => 1000,
            'SizePayment3' => 100,
            'SizePayment4' => 100,
            'QuantityFactsGrantingData1' => 0,
            'QuantityFactsGrantingData2' => 0,
            'QuantityFactsGrantingData3' => 0,
            'QuantityFactsGrantingData4' => 0,
            'VolumeMeans' => 0,
            'NameSoftwareProduct' => 'Панорама',
            'Executor' => 'Иванов Иван Петрович',
            'Telefone1' => 43333333333,
            'Telefone2' => 89652457888,
            'email' => 'mail@mail.ru',
            'ID' => $id
        );
        for ($x = 0; $x < 15; $x++) {
            $a = rand(0, 1);
            if ($a != 0) {
                $b = rand(-4, 4);
                $data = date("Y-m-d", strtotime('2013-01-11') + 60 * 60 * 24 * (14 + $b) * $x);
                $today = date("Y-m-d");
                if ($data <= $today) {
                    $post_data['CreateDate'] = $data;
                } else {
                    $post_data['CreateDate'] = $today;
                }
                $post_data['QuantityFactsGrantingData1'] = $post_data['QuantityFactsGrantingData1'] + rand(0, 100);
                $post_data['QuantityFactsGrantingData2'] = $post_data['QuantityFactsGrantingData2'] + rand(0, 100);
                $post_data['QuantityFactsGrantingData3'] = $post_data['QuantityFactsGrantingData3'] + rand(0, 100);
                $post_data['QuantityFactsGrantingData4'] = $post_data['QuantityFactsGrantingData4'] + rand(0, 100);
                $post_data ['VolumeMeans'] = ($post_data['QuantityFactsGrantingData1'] * 1000 + $post_data['QuantityFactsGrantingData3'] * 100) / 1000;

                $fields = "";
                $values = "";
                $sep = ", ";

                $cur = $db->query("PRAGMA table_info(isogdarch)");

                foreach ($cur as $r) {
                    if ($r["name"] !== 'Code') {
                        if (is_null($post_data[$r["name"]]) != true && $post_data[$r["name"]] !== "") {

                            if ($fields !== "")
                                $fields = $fields . $sep . $r["name"];
                            else
                                $fields = $r["name"];

                            if ($values !== "")
                                $values = $values . $sep . "'" . $post_data[$r["name"]] . "'";
                            else
                                $values = "'" . $post_data[$r["name"]] . "'";
                        }
                    }
                }

                $sql = "INSERT INTO isogdarch(" . $fields . ") values (" . $values . ");";

                $db->exec($sql);
            }
        }
    }

    echo 'Completed!';
} catch (Exception $e) {
    echo 'Выброшено исключение: ', $e->getMessage(), "\n";
}

