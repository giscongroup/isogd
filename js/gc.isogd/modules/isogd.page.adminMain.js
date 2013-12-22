/**
 * User: Julia Suhinina
 * Date: 22.08.13
 * Time: 10:46
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


    gp.controller('isogd.page.AdminMain', [ '$scope', '$user', '$isogdData', '$filter', '$pathParams', '$http', '$dialog', function ($scope, $user, $isogdData, $filter, $pathParams, $http, $dialog) {
//        var sortMethod = '';


        $scope.isogdByWeek = [];
        $scope.lastUpdates = [];
        $scope.isogdLog = [];
        $scope.isogdLastData = [];
        $scope.sumByWeek = {};
        $scope.dontReportMO = [];
        $scope.isogdLastYear = [];
        $scope.isogdPreviousYearSamePeriod = [];

        $scope.currentDate = new Date();
        $scope.month = $scope.currentDate.getMonth() + 1;
        if ($scope.month < 10)
            $scope.month = '0' + $scope.month;
        $scope.day = $scope.currentDate.getDate();
        if ($scope.day < 10)
            $scope.day = '0' + $scope.day;
        $scope.year = $scope.currentDate.getFullYear();

        if ($scope.day < 16)
            $scope.period = '01';
        else
            $scope.period = '16';

        $scope.areaColor = $isogdData.stat.areaColor;

        if ($isogdData.isogd !== undefined) {

            if ($isogdData.isogd.alldata !== undefined)
                $scope.lastUpdates = $isogdData.isogd.alldata;

            if ($isogdData.isogd.isogdWeek !== undefined)
                $scope.isogdByWeek = $isogdData.isogd.isogdWeek;

            if ($isogdData.isogd.isogdLog !== undefined)
                $scope.isogdLog = $isogdData.isogd.isogdLog;

            if ($isogdData.isogd.lastdata !== undefined)
                $scope.isogdLastData = $isogdData.isogd.lastdata;

            if ($isogdData.isogd.isogdPreviousYear !== undefined)
                $scope.isogdPreviousYear = $isogdData.isogd.isogdPreviousYear;

            if ($isogdData.isogd.isogdPreviousYearSamePeriod !== undefined)
                $scope.isogdPreviousYearSamePeriod = $isogdData.isogd.isogdPreviousYearSamePeriod;

        }

        $scope.sortisogd = _.sortBy($scope.isogdLastData, function (obj) {
            if (obj.VolumeMeans !== undefined)
                return obj.VolumeMeans;
            else
                return 0;
        });

        $scope.sortisogd.reverse();

        $scope.conclusion = {};
        /////////////////////////вывод для текущуго года /////////////////////////////////////////
        $scope.conclusion.sumByThisYear = $isogdData.stat.sumByYear;
        $scope.conclusion.sumByBestMOinThisYear = 0;
        $scope.conclusion.bestMOinThisYear = [];
        for (var i = 0; i < 5; i++) {
//            if ($scope.conclusion.bestMOinThisYear !== undefined)
//                $scope.conclusion.bestMOinThisYear = $scope.conclusion.bestMOinThisYear + ', ' + $scope.sortisogd[i].NameMO;
//            else
//                $scope.conclusion.bestMOinThisYear = $scope.sortisogd[i].NameMO;
            $scope.conclusion.bestMOinThisYear.push($scope.sortisogd[i].NameMO);
            $scope.conclusion.sumByBestMOinThisYear = $scope.conclusion.sumByBestMOinThisYear + $scope.sortisogd[i].VolumeMeans;
        }

        //////////////////////////вывод для предыдущего года ///////////////////////////////////////////
        if ($scope.isogdPreviousYear.length !== 0) {
            $scope.conclusion.sumByPreviousYear = 0;
            _.each($scope.isogdPreviousYear, function (isogd) {
                var el = _.find($isogdData.MO, function (mo) {
                    return isogd.ID === mo.ID;
                });
                if (el !== undefined)
                    isogd.NameMO = el.NameMO;

                if (isogd.VolumeMeans !== undefined)
                    $scope.conclusion.sumByPreviousYear = $scope.conclusion.sumByPreviousYear + isogd.VolumeMeans;
            });


            $scope.sortisogd = _.sortBy($scope.isogdPreviousYear, function (obj) {
                if (obj.VolumeMeans !== undefined)
                    return obj.VolumeMeans;
                else
                    return 0;
            });

            $scope.sortisogd.reverse();
            $scope.conclusion.sumByBestMOinPreviousYear = 0;
            $scope.conclusion.bestMOinPreviousYear = [];
            for (i = 0; i < 5; i++) {
//                if ($scope.conclusion.bestMOinPreviousYear !== undefined)
//                    $scope.conclusion.bestMOinPreviousYear = $scope.conclusion.bestMOinPreviousYear + ', ' + $scope.sortisogd[i].NameMO;
//                else
//                    $scope.conclusion.bestMOinPreviousYear = $scope.sortisogd[i].NameMO;
                $scope.conclusion.bestMOinPreviousYear.push($scope.sortisogd[i].NameMO);
                if ($scope.sortisogd[i].VolumeMeans !== undefined)
                    $scope.conclusion.sumByBestMOinPreviousYear = $scope.conclusion.sumByBestMOinPreviousYear + $scope.sortisogd[i].VolumeMeans;
            }
        }
        ///////////////////////вывод для аналогичного периода прошлого года /////////////////////////////////////////////////////////
        if ($scope.isogdPreviousYearSamePeriod.length !== 0) {
            $scope.conclusion.sumByPreviousYearSamePeriod = 0;
            _.each($scope.isogdPreviousYearSamePeriod, function (isogd) {
                var el = _.find($isogdData.MO, function (mo) {
                    return isogd.ID === mo.ID;
                });
                if (el !== undefined)
                    isogd.NameMO = el.NameMO;

                if (isogd.VolumeMeans !== undefined)
                    $scope.conclusion.sumByPreviousYearSamePeriod = $scope.conclusion.sumByPreviousYearSamePeriod + isogd.VolumeMeans;
            });


            $scope.sortisogd = _.sortBy($scope.isogdPreviousYearSamePeriod, function (obj) {
                if (obj.VolumeMeans !== undefined)
                    return obj.VolumeMeans;
                else
                    return 0;
            });
            $scope.sortisogd.reverse();
            $scope.conclusion.sumByBestMOinPreviousYearSamePeriod = 0;

            if ($scope.sortisogd.length >= 5)
                var max = 5;
            else
                max = $scope.sortisogd.length;
            $scope.conclusion.bestMOinPreviousYearSamePeriod = [];
            for (i = 0; i < max; i++) {
//                if ($scope.conclusion.bestMOinPreviousYearSamePeriod !== undefined)
//                    $scope.conclusion.bestMOinPreviousYearSamePeriod = $scope.conclusion.bestMOinPreviousYearSamePeriod + ', ' + $scope.sortisogd[i].NameMO;
//                else
//                    $scope.conclusion.bestMOinPreviousYearSamePeriod = $scope.sortisogd[i].NameMO;
                $scope.conclusion.bestMOinPreviousYearSamePeriod.push($scope.sortisogd[i].NameMO);
                if ($scope.sortisogd[i].VolumeMeans !== undefined)
                    $scope.conclusion.sumByBestMOinPreviousYearSamePeriod = $scope.conclusion.sumByBestMOinPreviousYearSamePeriod + $scope.sortisogd[i].VolumeMeans;
            }
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        $scope.mo = $isogdData.MO;

        $scope.activeTab = $pathParams.tabmain;


        $scope.getClass = function (path) {
            if ($scope.activeTab == path) {
                $scope.activeTab = $pathParams.tabmain;
                return "active"
            } else {
                return ""
            }
        };

        for (var i = 0, max = $scope.lastUpdates.length; i < max; i++) {
            $scope.lastUpdates[i].sumQuantityFactsGrantingData = $scope.lastUpdates[i].QuantityFactsGrantingData1 + $scope.lastUpdates[i].QuantityFactsGrantingData2 + $scope.lastUpdates[i].QuantityFactsGrantingData3 + $scope.lastUpdates[i].QuantityFactsGrantingData4;

            var myDate = new Date($scope.lastUpdates[i].CreateDate);
            if ('Invalid Date' != myDate) {
                $scope.lastUpdates[i].CreateDate = $filter('date')(myDate, 'dd.MM.yyyy');
            }

            var mo = _.find($scope.mo, function (elem) {
                return elem.ID == $scope.lastUpdates[i].ID;
            });

            if (mo !== undefined)
                $scope.lastUpdates[i].NameMO = mo.NameMO;
        }

        _.each($scope.mo, function (mo) {
            var indx,
                lastdata;

            indx = _.find($scope.isogdLog, function (obj) {
                return obj.ID === mo.ID
            });

            if (indx == undefined) {
                lastdata = _.find($scope.isogdLastData, function (obj) {
                    return obj.ID === mo.ID
                });
                if (lastdata !== undefined) {
                    mo.Executor = lastdata.Executor;
                    mo.Telefone1 = lastdata.Telefone1;
                    mo.Telefone2 = lastdata.Telefone2;
                    mo.email = lastdata.email;
                }
                $scope.dontReportMO.push(mo);
            }
        });



        var promise = $http.get('js/gc.isogd/isogd.srv.getGraphData.php');
        promise.success(function (data) {
            if (typeof data == 'object') {
                var reportData = data;

                $scope.chartQuantityFactsGrantingDataPie = {
                    labels: [],
                    chartType: 'pie',
                    dataForChart: [
                        { data: reportData.SumQuantityFactsGrantingData.QuantityFactsGrantingData2, label: 'Сведения с взиманием платы'},
                        { data: reportData.SumQuantityFactsGrantingData.QuantityFactsGrantingData4, label: 'Копия одного документа с взиманием платы'},
                        { data: reportData.SumQuantityFactsGrantingData.QuantityFactsGrantingData1, label: 'Сведения без взимания платы'},
                        { data: reportData.SumQuantityFactsGrantingData.QuantityFactsGrantingData3, label: 'Копия одного документа без взимания платы'}
                    ]
                };

                $scope.areastat = {
                    labels: [],
                    chartType: 'pie',
                    dataForChart: [
                        { data: $scope.areaColor.redarea, label: 'Объем средств нулевой, количество фактов предоставления сведений ноль'},
                        { data: $scope.areaColor.yellowarea, label: 'Объем средств нулевой, количество фактов предоставления сведений больше нуля'},
                        { data: $scope.areaColor.greenarea, label: 'Объем средств положительный'}
                    ]
                };

                $scope.chartVolumeMeans = {
                    labels: reportData.labels,
                    chartType: 'linear',
                    dataForChart: [
                        { data: reportData.volumeMeans, label: 'Поступления в бюджет (тыс.руб.)'}
                    ],
                    postfix: 'тыс.руб.'
                };

                $scope.chartIncrement = {
                    labels: reportData.labels,
                    chartType: 'bar',
                    dataForChart: [
                        { data: reportData.increment, label: 'Прирост поступлений (тыс.руб.)'}
                    ],
                    postfix: 'тыс.руб.'
                };
            }
        });
        promise.error(function (data) {
            console.log(data);
        });

        $scope.openDialog = function (rec, message) {
            var msg = {};
            msg.mailto = rec.ID;
            if (message == undefined)
                msg.message = 'Необходимо внести данные ИСОГД за текущий период.';
            else
                msg.message = 'Неверно внесены данные за ' + message;
            var d = $dialog.dialog({
                backdrop: true,
                keyboard: true,
                backdropClick: false,
                templateUrl: "js/gc.isogd/templates/isogd.dialog.message.html",
                controller: 'isogd.dialog.message',
                resolve: {
                    msg: function () {
                        return msg;
                    }
                }
            });
            d.open().then(function (result) {
                console.log(result);

            });


        };


    }])


})(this);
