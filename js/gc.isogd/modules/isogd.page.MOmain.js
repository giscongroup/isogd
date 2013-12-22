/**
 * User: Julia Suhinina
 * Date: 15.08.13
 * Time: 11:21
 * Description:
 */

(function (global) {
    var
    /*глобальные переменные*/
        _win = global,
        _doc = _win.document,

    /*JS зависимости*/
        _wml = _win.wml,
        _ng = _win.angular,
        _ = _win._,

        gp = _win.geoportalInstance;


    gp.controller('isogd.page.mainMO', [ '$scope', '$http', '$user', '$isogdData', '$location', '$filter', '$dialog', '$pathParams', function ($scope, $http, $user, $isogdData, $location, $filter, $dialog, $pathParams) {

        $scope.MO = {};
        $scope.MO = $isogdData.MO[0];
        $scope.year = new Date().getFullYear();
        var promise,
            dProcess = $dialog.dialog({
                backdrop: true,
                keyboard: true,
                backdropClick: false,
                templateUrl: "js/gc.isogd/templates/isogd.dialog.process.html"
            });

        var
            mapStyle = {
                fill: "#76BDEE",
                stroke: "#30a0eb",
                "stroke-width": 1,
                "stroke-linejoin": "round"
            },
            geom = [],
            newgeom = [],
            minX = Number.MAX_VALUE,
            minY = Number.MAX_VALUE,
            maxX = Number.MIN_VALUE,
            maxY = Number.MIN_VALUE;


        for (var i = 0, max = krasnodar_region_svg.length; i < max; i++) {
            if (krasnodar_region_svg[i].idMO == $user.session_id) {
                geom = krasnodar_region_svg[i].geom.slice();
                break;
            }
        }

        for (i = 0; i < geom.length; i++) {
            var regSvgCoord = 'M ';
            geom[i] = geom[i].replace('M', '');
            geom[i] = geom[i].split('L');

            for (var a = 0, maxa = geom[i].length; a < maxa; a++) {
                var point = [],
                    x = parseFloat(geom[i][a].split(',')[0]),
                    y = parseFloat(geom[i][a].split(',')[1]);

                point = [x, y];
                geom[i][a] = point;
                if (x < minX)
                    minX = x;
                if (y < minY)
                    minY = y;
                if (x > maxX)
                    maxX = x;
                if (y > maxY)
                    maxY = y;
            }
        }
        minX = minX - 15;
        for (i = 0; i < geom.length; i++) {
            for (a = 0, maxa = geom[i].length; a < maxa; a++) {
                regSvgCoord = regSvgCoord + (geom[i][a][0] - minX).toString() + ", " + (geom[i][a][1] - minY).toString();
                if (a != maxa - 1)
                    regSvgCoord = regSvgCoord + " L ";
            }
            newgeom.push(regSvgCoord);
        }


        var R = Raphael("paper", maxX - minX, maxY - minY);
        $isogdData.isogd.MOgeom = {};
        $isogdData.isogd.MOgeom.geom = newgeom;
        $isogdData.isogd.MOgeom.maxX = maxX;
        $isogdData.isogd.MOgeom.maxY = maxY;


        regSvgCoord = R.path(newgeom).attr(mapStyle);
        regSvgCoord.transform('s1.0,1.0,0,0...');
//        var el = _ng.element(regSvgCoord[0]);
//        el.css('cursor', 'pointer');
//
//        el.on('mouseover', function () {
//            regSvgCoord.attr({opacity: 0.6, "stroke-width": 1});
//        });
//
//        el.on('mouseleave', function () {
//            regSvgCoord.attr({opacity: 1, "stroke-width": 1});
//        });

        if ($isogdData.isogd.isogdWeek !== undefined) {
            $scope.isogd.isogdWeek = $isogdData.isogd.isogdWeek.slice($isogdData.isogd.isogdWeek.length - 6, $isogdData.isogd.isogdWeek.length);
            $scope.isogd.isogdWeek.reverse();
        }

        if ($isogdData.isogd.isogdWeek !== undefined)
            $scope.isogdByWeek = $isogdData.isogd.isogdWeek;
        else
            $scope.isogdByWeek = [];

        if ($isogdData.isogd.isogdLog !== undefined)
            $scope.isogdLog = $isogdData.isogd.isogdLog;
        else
            $scope.isogdLog = [];


        var monthArray = ['янв', 'февр', 'марта', 'апр', 'мая', 'июня',
            'июля', 'авг', 'сент', 'окт', 'ноября', 'дек'];

        _.each($scope.isogd.isogdWeek, function (isogd) {
            var week = isogd.week.split('-');
            isogd.data = week[2] + ' ' + monthArray[week[1] - 1];
        });


        _.each($scope.isogdLog, function (record) {
            record.sumQuantityFactsGrantingData = record.QuantityFactsGrantingData1 + record.QuantityFactsGrantingData2 + record.QuantityFactsGrantingData3 + record.QuantityFactsGrantingData4;
            var myDate = new Date(record.CreateDate);
            if ('Invalid Date' != myDate) {
                record.CreateDate = $filter('date')(myDate, 'dd.MM.yyyy');
            }
        });

        $scope.dataByWeek = {};

        for (i = 0, max = $scope.isogdByWeek.length; i < max; i++) {
            if ($scope.dataByWeek[$scope.isogdByWeek[i].week] === undefined)
                $scope.dataByWeek[$scope.isogdByWeek[i].week] = {};
            $scope.dataByWeek[$scope.isogdByWeek[i].week] = $scope.isogdByWeek[i];
        }


        var monthArray = ['янв.', 'февр.', 'март', 'апр.', 'май', 'июнь',
                'июль', 'авг.', 'сент', 'окт', 'нояб.', 'дек.'],
            volumeMeans = [],
            increment = [],
            labels = [],
            quantityFactsGrantingData = [],
            quantityFactsGrantingData1Increment = [],
            quantityFactsGrantingData2Increment = [],
            quantityFactsGrantingData3Increment = [],
            quantityFactsGrantingData4Increment = [],
            pie = {},
            lastData = {
                VolumeMeans: 0,
                QuantityFactsGrantingData1: 0,
                QuantityFactsGrantingData2: 0,
                QuantityFactsGrantingData3: 0,
                QuantityFactsGrantingData4: 0
            };
        $scope.SumQuantityFactsGrantingData = {
            QuantityFactsGrantingData1: 0,
            QuantityFactsGrantingData2: 0,
            QuantityFactsGrantingData3: 0,
            QuantityFactsGrantingData4: 0
        };

        a = 1;

        _.each($scope.dataByWeek, function (mo, week) {
            $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData1 = $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData1 + mo.QuantityFactsGrantingData1;
            $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData2 = $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData2 + mo.QuantityFactsGrantingData2;
            $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData3 = $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData3 + mo.QuantityFactsGrantingData3;
            $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData4 = $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData4 + mo.QuantityFactsGrantingData4;
            volumeMeans.push([a, mo.VolumeMeans]);
            increment.push([a, mo.VolumeMeans - lastData.VolumeMeans]);

            if (a % 2 !== 0)
                labels.push([a, monthArray[parseInt(week.split('-')[1]) - 1]]);
            else
                labels.push([a, '']);

            quantityFactsGrantingData.push([a, mo.QuantityFactsGrantingData1 + mo.QuantityFactsGrantingData2 + mo.QuantityFactsGrantingData3 + mo.QuantityFactsGrantingData4]);
            quantityFactsGrantingData1Increment.push([a + 0.35, mo.QuantityFactsGrantingData1 - lastData.QuantityFactsGrantingData1]);
            quantityFactsGrantingData2Increment.push([a + 0.8, mo.QuantityFactsGrantingData2 - lastData.QuantityFactsGrantingData2]);
            quantityFactsGrantingData3Increment.push([a + 0.35, mo.QuantityFactsGrantingData3 - lastData.QuantityFactsGrantingData3]);
            quantityFactsGrantingData4Increment.push([a + 0.8, mo.QuantityFactsGrantingData4 - lastData.QuantityFactsGrantingData4]);
            lastData = mo;
            a = a + 1;
        });

        $scope.chartVolumeMeansMO = {
            labels: labels,
            chartType: 'linear',
            dataForChart: [
                { data: volumeMeans, label: 'Поступления в бюджет (тыс.руб.)'}
            ],
            postfix: 'тыс.руб.'
        };

        $scope.chartIncrementMO = {
            labels: labels,
            chartType: 'bar',
            dataForChart: [
                { data: increment, label: 'Прирост поступлений (тыс.руб.)'}
            ],
            postfix: 'тыс.руб.'
        };

        $scope.chartQuantityFactsGrantingDataMO = {
            labels: labels,
            chartType: 'linear',
            dataForChart: [
                { data: quantityFactsGrantingData, label: 'Количество фактов (шт.)'}
            ]
        };

        $scope.chartQuantityFactsGrantingDataPieMO = {
            labels: [],
            chartType: 'pie',
            dataForChart: [
                { data: $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData2, label: 'Сведения с взиманием платы'},
                { data: $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData1, label: 'Сведения без взимания платы'},
                { data: $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData4, label: 'Копия одного документа с взиманием платы'},
                { data: $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData3, label: 'Копия одного документа без взимания платы'}

            ]
        };

        $scope.chartQuantityFactsGrantingDataIncrementMO1 = {
            labels: labels,
            chartType: 'bar',
            dataForChart: [
                { data: quantityFactsGrantingData1Increment, label: 'Количество фактов предоставления сведений без взимания платы'},
                { data: quantityFactsGrantingData2Increment, label: 'Количество фактов предоставления сведений с взиманием платы'}

            ]
        };

        $scope.chartQuantityFactsGrantingDataIncrementMO2 = {
            labels: labels,
            chartType: 'bar',
            dataForChart: [
                { data: quantityFactsGrantingData3Increment, label: 'Количество фактов предоставления копии одного документа без взимания платы'},
                { data: quantityFactsGrantingData4Increment, label: 'Количество фактов предоставления копии одного документа с взиманием платы'}

            ]
        };


        $scope.openDialog = function (week) {

            var d = $dialog.dialog({
                backdrop: true,
                keyboard: true,
                backdropClick: false,
                templateUrl: "js/gc.isogd/templates/isogd.dialog.weekISOGD.html",
                controller: 'isogd.dialog.weekCntr',
                resolve: {
                    msg: function () {
                        return $scope.isogd.isogdWeek;
                    }
                }
            });

            if (week !== undefined && week !== '') {
                var data = week.split('-')[2],
                    month = week.split('-')[1],
                    monthArray = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
                        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
                if (data <= 15)
                    data = '14 ';
                else
                    data = '28 ';

                $pathParams.week = data + monthArray[month - 1];
            }

            d.open().then(function (result) {

                if (result !== undefined) {
                    dProcess.open();
                    result.CreateDate = new Date();


                    promise = $http.post('js/gc.isogd/isogd.fn.saveweek.php', result);
                    promise.success(function (data) {
                        $scope.saveSuccess = true;
                        $scope.saveError = false;
                        dProcess.close();
                        $scope.getISOGDdata();

                    });
                    promise.error(function (data) {
                        dProcess.close();
                        $scope.saveError = true;
                        $scope.saveSuccess = false;
                    });
                }
            });
        };

        $scope.getISOGDdata = function () {
            promise = $http.get('js/gc.isogd/isogd.srv.getisogd.php');
            promise.success(function (data) {

                _.each(data, function (data, prop) {
                    $isogdData.isogd[prop] = data;
                });
                var promise = $http.get('js/gc.isogd/isogd.srv.getweekISOGD.php?year=' + $scope.activeTab);
                promise.success(function (data) {

                    $scope.isogdByYears[$scope.activeTab] = data;
                    $scope.isogdweek = $scope.isogdByYears[$scope.activeTab];

                });
                promise.error(function (error) {
                    console.log(error);

                });
                $scope.getstat();

            });

            promise.error(function (data) {
                console.log(data);
            });

        };

        $scope.getstat = function () {

            var promise = $http.get('js/gc.isogd/isogd.srv.getStat.php');
            promise.success(function (data) {
                if (typeof(data) === 'object') {
                    _.each(data, function (value, name) {
                        $isogdData.stat[name] = value;
                    });
                }
                $scope.getColorArea();
            });
            promise.error(function (data) {
                console.log(data);
                $scope.getColorArea();
            });


        };
//        $scope.chart_bar_by_MO_VolumeMeans = {
//            "type": "LineChart",
//            "displayed": true,
//            "view": {
//                legend: 'none',
//                isStacked: true
//            },
//            "data": {
//                "cols": [
//                    {
//                        "id": "mo",
//                        "label": "Муниципальное образование",
//                        "type": "string"}                    ,
//                    {
//                        "id": "volumeMeans",
//                        "label": "Общий объем средств",
//                        "type": "number"
//                    }
//                ],
//                "rows": []
//            },
//            "options": {
//                "bar": {"groupWidth": '85%'},
//                "chartArea": {"left": '10%', "top": '10%'},
//                "title": "Динамика увеличения общего объема поступлений в бюджет МО за текущий год",
//                "isStacked": "true",
//                "vAxis": {
//                    "title": "тыс. руб.",
//                    "textStyle": {
//                        fontSize: 12
//                    },
//                    "gridlines": {
//                        "count": 10
//                    }
//                },
//                "hAxis": {
//                    "title": "неделя года",
//                    "textStyle": {
//                        fontSize: 12
//                    },
//                    "gridlines": {
//                        "count": 20
//                    }
//                },
//                "lineWidth": 3,
//                "pointSize": 5
//            }
//        };
//
//        $scope.chart_bar_by_MO_Increment = {
//            "type": "ColumnChart",
//            "displayed": true,
//            "view": {
//                legend: 'none',
//                isStacked: true
//            },
//            "data": {
//                "cols": [
//                    {
//                        "id": "mo",
//                        "label": "Муниципальное образование",
//                        "type": "string"}                    ,
//                    {
//                        "id": "volumeMeans",
//                        "label": "Поступлений за 2 недели",
//                        "type": "number"
//                    }
//                ],
//                "rows": []
//            },
//            "options": {
//                "bar": {"groupWidth": '85%'},
//                "chartArea": {"left": '10%', "top": '10%'},
//                "title": "Столбиковая диаграмма прироста поступлений в бюджет МО за текущий год",
//                "isStacked": "true",
//                "vAxis": {
//                    "title": "тыс. руб.",
//                    "textStyle": {
//                        fontSize: 12
//                    },
//                    "gridlines": {
//                        "count": 10
//                    }
//                },
//                "hAxis": {
//                    "title": "неделя года",
//                    "textStyle": {
//                        fontSize: 12
//                    },
//                    "gridlines": {
//                        "count": 20
//                    }
//                },
//                "lineWidth": 3,
//                "pointSize": 5
//            }
//        };
//
//        $scope.chart_bar_by_MO_QuantityFactsGrantingData = {
//            "type": "ColumnChart",
//            "displayed": true,
//            "view": {
//                legend: 'none',
//                isStacked: true
//            },
//            "data": {
//                "cols": [
//                    {
//                        "id": "mo",
//                        "label": "Муниципальное образование",
//                        "type": "string"}                    ,
//                    {
//                        "id": "QuantityFactsGrantingData1",
//                        "label": "Количество фактов предоставления сведений без взимания платы",
//                        "type": "number"
//                    },
//                    {
//                        "id": "QuantityFactsGrantingData2",
//                        "label": "Количество фактов предоставления сведений с взиманием платы",
//                        "type": "number"
//                    },
//                    {
//                        "id": "QuantityFactsGrantingData3",
//                        "label": "Количество фактов предоставления копии одного документа без взимания платы",
//                        "type": "number"
//                    },
//                    {
//                        "id": "QuantityFactsGrantingData4",
//                        "label": "Количество фактов предоставления копии одного документа с взиманием платы",
//                        "type": "number"
//                    }
//                ],
//                "rows": []
//            },
//            "options": {
////                    "legend": {"position": 'bottom' },
////                "bar": {"groupWidth": '85%'},
//                "chartArea": {"left": '10%', "top": '10%'},
//                "title": "Столбиковая диаграма, отражающая количество фактов предоставление сведний за расчетный период",
//                "isStacked": "false",
//                "vAxis": {
//                    "title": "Количество фактов предоставления сведений",
//                    "textStyle": {
//                        fontSize: 12
//                    },
//                    "gridlines": {
//                        "count": 8
//                    }
//                },
//                "hAxis": {
//                    "title": "неделя года",
//                    "textStyle": {
//                        fontSize: 12
//                    },
//                    "gridlines": {
//                        "count": 10
//                    }
//                },
//                "lineWidth": 3,
//                "pointSize": 5
//            }
//        };


//        _.each($scope.dataByWeek, function (mo, week) {
//            var
//                newCell_VolumeMeans = {
//                    "c": [
//                        {
//                            "v": monthArray[week.split('-')[1]]
//                        },
//                        {
//                            "v": mo.VolumeMeans,
//                            "f": mo.VolumeMeans.toString() + " тыс. руб."
//                        }
//
//                    ]
//                },
//                newCell_QuantityFactsGrantingData = {
//                    "c": [
//                        {
//                            "v": monthArray[parseInt(week.split('-')[1]) - 1]
//                        },
//                        {
//                            "v": mo.QuantityFactsGrantingData1 - lastData.QuantityFactsGrantingData1,
//                            "f": (mo.QuantityFactsGrantingData1 - lastData.QuantityFactsGrantingData1).toString()
//                        },
//                        {
//                            "v": mo.QuantityFactsGrantingData2 - lastData.QuantityFactsGrantingData2,
//                            "f": (mo.QuantityFactsGrantingData2 - lastData.QuantityFactsGrantingData2).toString()
//                        },
//                        {
//                            "v": mo.QuantityFactsGrantingData3 - lastData.QuantityFactsGrantingData3,
//                            "f": (mo.QuantityFactsGrantingData3 - lastData.QuantityFactsGrantingData3).toString()
//                        },
//                        {
//                            "v": mo.QuantityFactsGrantingData4 - lastData.QuantityFactsGrantingData4,
//                            "f": (mo.QuantityFactsGrantingData4 - lastData.QuantityFactsGrantingData4).toString()
//                        }
//                    ]
//                },
//                newCell_QuantityIncrement = {
//                    "c": [
//                        {
//                            "v": week.split('-')[1]
//                        },
//                        {
//                            "v": mo.VolumeMeans - lastData.VolumeMeans,
//                            "f": (mo.VolumeMeans - lastData.VolumeMeans).toString() + " тыс. руб."
//                        }
//
//                    ]
//                };
//            lastData = mo;
//            $scope.chart_bar_by_MO_QuantityFactsGrantingData["data"]["rows"].push(newCell_QuantityFactsGrantingData);
//            $scope.chart_bar_by_MO_Increment["data"]["rows"].push(newCell_QuantityIncrement);
//            $scope.chart_bar_by_MO_VolumeMeans["data"]["rows"].push(newCell_VolumeMeans);
//        });
    }])

})(this);
