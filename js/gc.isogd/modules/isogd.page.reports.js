/**
 * User: Julia Suhinina
 * Date: 30.08.13
 * Time: 11:39
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

    gp.filter('startFrom', function () {
        return function (input, start) {
            start = +start; //parse to int
            return input.slice(start);
        }
    });

    gp.controller('isogd.page.reports', [ '$scope', '$isogdData', '$dialog', '$location', '$http', '$q', '$timeout', '$chain', function ($scope, $isogdData, $dialog, $location, $http, $q, $timeout, $chain) {

        var chain = $chain();

        $scope.reportParam = {
            selectMO: {},
            by: 'all',
            linearVolumeMeans: false,
            tableDataMainInfo: false,
            tableDataDoc: false,
            tableDataFin: false,
            tableDataVolMean: false,
            barIncrease: false,
            linearQuantityFactsGrantingData: false,
            pieQuantityFactsGrantingData: false,
            barQuantityFactsGrantingData: false,
            barQuantityFactsGrantingDataCopy: false,
            log: false
        };

        if ($isogdData.isogd.lastdata !== undefined)
            $scope.isogddata = $isogdData.isogd.lastdata;
        else
            $scope.isogddata = [];

        $scope.year = new Date().getFullYear();

        $scope.printReport = false;

        $scope.MO = $isogdData.MO;
        $scope.selectMO = {};

        $scope.openDialog = function () {

            var d = $dialog.dialog({
                backdrop: true,
                keyboard: true,
                backdropClick: false,
                templateUrl: "js/gc.isogd/templates/isogd.dialog.selectMO.html",
                controller: 'isogd.dialog.selectMO',
                resolve: {
                    msg: function () {
                        return undefined;
                    }
                }
            });
            d.open().then(function (result) {
                if (result !== undefined) {
                    $scope.reportParam.selectMO = result;
                }
            });
        };


        $scope.areaColor = $isogdData.stat.areaColor;
        var reportData;

        $scope.startGraph = false;


        $scope.disableButton = function () {
            if ($scope.reportParam.linearVolumeMeans === false &&
                $scope.reportParam.tableDataMainInfo === false &&
                $scope.reportParam.tableDataDoc === false &&
                $scope.reportParam.tableDataFin === false &&
                $scope.reportParam.tableDataVolMean === false &&
                $scope.reportParam.barIncrease === false &&
                $scope.reportParam.linearQuantityFactsGrantingData === false &&
                $scope.reportParam.pieQuantityFactsGrantingData === false &&
                $scope.reportParam.barQuantityFactsGrantingData === false &&
                $scope.reportParam.barQuantityFactsGrantingDataCopy === false &&
                $scope.reportParam.log === false) {
                $scope.disableRep = true;
            }
            else {
                $scope.disableRep = false;
            }
        };
        $scope.disableButton();

        $scope.creteReport = function () {

            var updateGraph = function () {
                if ($scope.reportParam.linearVolumeMeans === true) {
                    $scope.chartVolumeMeansMO = {
                        labels: reportData.labels,
                        chartType: 'linear',
                        dataForChart: [
                            {data: reportData.volumeMeans, label: 'Поступления в бюджет (тыс.руб.)'}
                        ],
                        postfix: 'тыс.руб.'
                    };
                }
                if ($scope.reportParam.barIncrease === true) {
                    $scope.chartIncrementMO = {
                        labels: reportData.labels,
                        chartType: 'bar',
                        dataForChart: [
                            {data: reportData.increment, label: 'Прирост поступлений (тыс.руб.)'}
                        ],
                        postfix: 'тыс.руб.'
                    };
                }
                if ($scope.reportParam.linearQuantityFactsGrantingData === true) {
                    $scope.chartQuantityFactsGrantingDataMO = {
                        labels: reportData.labels,
                        chartType: 'linear',
                        dataForChart: [
                            {data: reportData.quantityFactsGrantingData, label: 'Количество фактов (шт.)'}
                        ]
                    };
                }
                if ($scope.reportParam.pieQuantityFactsGrantingData === true) {
                    $scope.chartQuantityFactsGrantingDataPieMO = {
                        labels: [],
                        chartType: 'pie',
                        dataForChart: [
                            {data: reportData.SumQuantityFactsGrantingData.QuantityFactsGrantingData2, label: 'Сведения с взиманием платы'},
                            {data: reportData.SumQuantityFactsGrantingData.QuantityFactsGrantingData1, label: 'Сведения без взимания платы'},
                            {data: reportData.SumQuantityFactsGrantingData.QuantityFactsGrantingData4, label: 'Копия одного документа с взиманием платы'},
                            {data: reportData.SumQuantityFactsGrantingData.QuantityFactsGrantingData3, label: 'Копия одного документа без взимания платы'}

                        ]
                    };
                }

                if ($scope.reportParam.barQuantityFactsGrantingData === true) {
                    $scope.chartQuantityFactsGrantingDataIncrementMO1 = {
                        labels: reportData.labels,
                        chartType: 'bar',
                        dataForChart: [
                            {data: reportData.quantityFactsGrantingData1Increment, label: 'Количество фактов предоставления сведений без взимания платы'},
                            {data: reportData.quantityFactsGrantingData2Increment, label: 'Количество фактов предоставления сведений с взиманием платы'}
                        ]
                    };
                }

                if ($scope.reportParam.barQuantityFactsGrantingDataCopy === true) {
                    $scope.chartQuantityFactsGrantingDataIncrementMO2 = {
                        labels: reportData.labels,
                        chartType: 'bar',
                        dataForChart: [
                            {data: reportData.quantityFactsGrantingData3Increment, label: 'Количество фактов предоставления копии одного документа без взимания платы'},
                            {data: reportData.quantityFactsGrantingData4Increment, label: 'Количество фактов предоставления копии одного документа с взиманием платы'}
                        ]
                    };
                }
                if ($scope.reportParam.log === true) {
                    $scope.chartLog = {
                        labels: reportData.labels,
                        chartType: 'linear',
                        dataForChart: [
                            {data: reportData.log}
                        ]
                    };
                }
            };

            if ($scope.reportParam.by === 'all') {
                $scope.filterIsogd = $scope.isogddata.slice();
                var promise = $http.get('js/gc.isogd/isogd.srv.getGraphData.php');
                promise.success(function (data) {
                    reportData = data;
                    updateGraph();
                    $scope.printReport = true;

                });
                promise.error(function (data) {
                    console.log(data);
                });
            }
            else {
//                console.log($scope.reportParam.selectMO);
                var today = new Date();
                chain.reject('Отменено пользователем');
                chain = $chain(function errorHandler(err) {
                    console.log(err);
                });

                var result = {};
                $scope.graphs = [];
                $scope.filterIsogd = [];
                $scope.graphCount = 0;
                _.each($scope.reportParam.selectMO, function (value, id) {
                    if (value === true) {
                        var isogd = _.find($scope.isogddata, function (record) {

                            return id == record.ID;
                        });

                        if (isogd !== undefined)
                            $scope.filterIsogd.push(isogd);


                        chain.add(id, function (id) {
                            var def = this;

                            if ($scope.reportParam.selectMO[id] === true) {
                                var promise = $http.get('js/gc.isogd/isogd.srv.getGraphDataByMO.php?ID=' + id);
                                promise.success(function (data) {
                                    result[id] = data;
                                    var obj = {
                                        id: id,
                                        NameMO: isogd.NameMO,
                                        graphs: []
                                    };
                                    if ($scope.reportParam.linearVolumeMeans === true) {
                                        obj.graphs.push(
                                            {
                                                id: 'volumeMeans' + id,
                                                title: 'Увеличение общего объема поступлений в бюджет МО за ' + today.getFullYear() + ' год (тыс.руб.)',
                                                data: {
                                                    labels: data.labels,
                                                    chartType: 'linear',
                                                    dataForChart: [
                                                        {data: data.volumeMeans, label: 'Поступления в бюджет (тыс.руб.)'}
                                                    ],
                                                    postfix: 'тыс.руб.'
                                                }
                                            }
                                        );
                                    }
                                    if ($scope.reportParam.barIncrease === true) {
                                        obj.graphs.push(
                                            {
                                                id: 'barIncrease' + id,
                                                title: 'Поступления в бюджет МО в ' + today.getFullYear() + ' году (тыс.руб.)',
                                                data: {
                                                    labels: data.labels,
                                                    chartType: 'bar',
                                                    dataForChart: [
                                                        {data: data.increment, label: 'Прирост поступлений (тыс.руб.)'}
                                                    ],
                                                    postfix: 'тыс.руб.'
                                                }
                                            }
                                        );
                                    }
                                    if ($scope.reportParam.linearQuantityFactsGrantingData === true) {
                                        obj.graphs.push(
                                            {
                                                id: 'volumeMeans' + id,
                                                title: 'Увеличение количества фактов предоставления сведений отделом ведения ИСОГД за ' + today.getFullYear() + ' год',
                                                data: {
                                                    labels: data.labels,
                                                    chartType: 'linear',
                                                    dataForChart: [
                                                        {data: data.quantityFactsGrantingData, label: 'Количество фактов (шт.)'}
                                                    ]
                                                }
                                            }
                                        );
                                    }
                                    if ($scope.reportParam.pieQuantityFactsGrantingData === true) {

                                        obj.graphs.push(
                                            {
                                                id: 'volumeMeans' + id,
                                                title: 'Количество фактов предоставления сведений ИСОГД за ' + today.getFullYear() + ' год',
                                                data: {
                                                    labels: [],
                                                    chartType: 'pie',
                                                    dataForChart: [
                                                        {data: data.SumQuantityFactsGrantingData.QuantityFactsGrantingData2, label: 'Сведения с взиманием платы'},
                                                        {data: data.SumQuantityFactsGrantingData.QuantityFactsGrantingData1, label: 'Сведения без взимания платы'},
                                                        {data: data.SumQuantityFactsGrantingData.QuantityFactsGrantingData4, label: 'Копия одного документа с взиманием платы'},
                                                        {data: data.SumQuantityFactsGrantingData.QuantityFactsGrantingData3, label: 'Копия одного документа без взимания платы'}

                                                    ]
                                                }
                                            }
                                        );
                                    }
                                    if ($scope.reportParam.barQuantityFactsGrantingData === true) {
                                        obj.graphs.push(
                                            {
                                                id: 'volumeMeans' + id,
                                                title: 'Количество фактов предоставления сведний ИСОГД за ' + today.getFullYear() + ' год',
                                                data: {
                                                    labels: data.labels,
                                                    chartType: 'bar',
                                                    dataForChart: [
                                                        {data: data.quantityFactsGrantingData1Increment, label: 'Количество фактов предоставления сведений без взимания платы'},
                                                        {data: data.quantityFactsGrantingData2Increment, label: 'Количество фактов предоставления сведений с взиманием платы'}
                                                    ]
                                                }
                                            }
                                        );
                                    }
                                    if ($scope.reportParam.barQuantityFactsGrantingDataCopy === true) {
                                        obj.graphs.push(
                                            {
                                                id: 'volumeMeans' + id,
                                                title: 'Количество фактов предоставления копии одного документа ИСОГД за ' + today.getFullYear() + ' год',
                                                data: {
                                                    labels: data.labels,
                                                    chartType: 'bar',
                                                    dataForChart: [
                                                        {data: data.quantityFactsGrantingData3Increment, label: 'Количество фактов предоставления копии одного документа без взимания платы'},
                                                        {data: data.quantityFactsGrantingData4Increment, label: 'Количество фактов предоставления копии одного документа с взиманием платы'}
                                                    ]
                                                }
                                            }
                                        );
                                    }
                                    $scope.graphCount = $scope.graphCount + obj.graphs.length;
                                    $scope.graphs.push(obj);

                                    def.resolve();
                                });
                                promise.error(function (data) {

                                    def.resolve();
                                });
                            }
                        });

                    }
                });

                //добавим в цепочку функцию которая сигнализирует о завершении
                chain.add(function () {
                    $scope.graphsRep = [];
                    $scope.startGraph = true;
                    var i, max = $scope.graphs.length, a;


                    chain = $chain(function (err) {
                        console.log(err);
                    });
                    var lastName = '', currentNameMO;
                    $scope.currentIndex = 0;
                    for (i = 0; i < max; i++) {

                        for (a = 0; a < $scope.graphs[i].graphs.length; a++) {
                            if (lastName !== $scope.graphs[i].NameMO) {
                                currentNameMO = $scope.graphs[i].NameMO;
                                lastName = $scope.graphs[i].NameMO;
                            }
                            else {
                                currentNameMO = '';
                            }
                            chain.add($scope.graphs[i].graphs[a], a, currentNameMO, function (currentGraph, index, namemo) {
                                "use strict";
                                var def = this;

                                $timeout(function () {

                                    currentGraph.currentNameMO = namemo;
                                    $scope.currentIndex = $scope.currentIndex + 1;
                                    $scope.graphsRep.push(currentGraph);
                                    def.resolve();
                                }, 300)
                            });
                        }
                    }

                    chain.add(function () {
                        $scope.startGraph = false;
                    });


                    chain.start();

                });
                chain.start();


            }
        };

        $scope.cancelGraph = function () {
            chain.reject('Отменено пользователем');
            $scope.startGraph = false;
        }


    }])
})(this);