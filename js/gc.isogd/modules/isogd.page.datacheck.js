/**
 * User: Julia Suhinina
 * Date: 02.10.13
 * Time: 15:31
 * Description:
 */
(function (global) {

    var
    /*глобальные переменные*/
        _win = global,

    /*JS зависимости*/
        _ = _win._,
        gp = _win.geoportalInstance;


    gp.controller('isogd.page.datacheck', [ '$scope', '$isogdData', '$dialog', '$http', '$pathParams', function ($scope, $isogdData, $dialog, $http, $pathParams) {
        var dProcess = $dialog.dialog({
                backdrop: true,
                keyboard: true,
                backdropClick: false,
                templateUrl: "js/gc.isogd/templates/isogd.dialog.process.html"
            }),
            today = new Date();

        $scope.isogd = {};
        $scope.isogdweek = [];


        $scope.currentYear = today.getFullYear();


        var promise;
        $scope.saveError = false;
        $scope.saveSuccess = false;

        $scope.isogdByYears = {};
        $scope.isogdByYears[today.getFullYear()] = $isogdData.isogd.isogdWeek;

        $scope.years = [];
        for (var year = 2012; year <= today.getFullYear(); year++) {
            $scope.years.push(year);
        }

        $scope.activeTab = $pathParams.year;
        $scope.getClass = function (path) {
            if ($scope.activeTab == path) {
                $scope.activeTab = $pathParams.year;
                return "active"
            } else {
                return ""
            }
        };

        $scope.$watch('activeTab', function (val) {

            if ($scope.isogdByYears[$scope.activeTab] !== undefined) {
                $scope.isogdweek = $scope.isogdByYears[$scope.activeTab];

            }
            else {
                var promise = $http.get('js/gc.isogd/isogd.srv.getweekISOGD.php?year=' + $scope.activeTab);
                promise.success(function (data) {

                    $scope.isogdByYears[$scope.activeTab] = data;
                    $scope.isogdweek = $scope.isogdByYears[$scope.activeTab];

                });
                promise.error(function (error) {
                    console.log(error);

                });
            }

        });


        $scope.$watch('isogdweek', function (val) {

            $scope.isogd.isogdWeek = $scope.isogdweek.slice();
            var monthArray = ['янв', 'февр', 'марта', 'апр', 'мая', 'июня',
                'июля', 'авг', 'сент', 'окт', 'ноября', 'дек'];

            _.each($scope.isogd.isogdWeek, function (isogd) {
                var week = isogd.week.split('-');
                isogd.data = week[2] + ' ' + monthArray[week[1] - 1];
            });

            $scope.isogd.isogdWeek.reverse();
        });


        $scope.openDialog = function (week) {
            $scope.saveSuccess = false;
            $scope.saveError = false;
            var d = $dialog.dialog({
                backdrop: true,
                keyboard: true,
                backdropClick: false,
                templateUrl: "js/gc.isogd/templates/isogd.dialog.weekISOGD.html",
                controller: 'isogd.dialog.weekCntr',
                resolve: {
                    msg: function () {
                        return $scope.isogdByYears[$scope.activeTab];
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


//        if ($pathParams.weekAdm !== undefined) {
//            $scope.openDialog($pathParams.weekAdm);
//        }
//        if ($pathParams.week !== undefined) {
//            $scope.openDialog();
//        }

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
            var lastUpdate = new Date('1900-08-15T05:21:17.437Z'),
//                lastMonthUpdate = new Date('1900-08-15T05:21:17.437Z'),
                today = new Date(),
                lastMonthDate = new Date(),
                data = undefined,
                sumByYear = 0,
                sumByMonth = 0,
                month = today.getMonth(),
                MOlastMonthUpdate = {},
                updatesInLastMonth = [];

            lastMonthDate.setDate(today.getDate() - 30);

            if ($isogdData.isogd.alldata !== undefined) {
                for (var i = 0, max = $isogdData.isogd.alldata.length; i < max; i++) {
                    data = new Date($isogdData.isogd.alldata[i].CreateDate);
                    if (lastUpdate < data) {
                        lastUpdate = data;
                    }
                    if (today.getMonth() === data.getMonth()) {
                        updatesInLastMonth.push($isogdData.isogd.alldata[i].ID);
                    }
                }
            }

            if ($isogdData.isogd.isogdWeek !== undefined) {
                for (i = 0, max = $isogdData.isogd.isogdWeek.length; i < max; i++) {
                    data = new Date($isogdData.isogd.isogdWeek[i].week);
                    if (today.getMonth() - 1 == data.getMonth() && data.getDate() > 15) {
//                        lastMonthUpdate = data;
//                        sumByMonth = $isogdData.isogd.isogdWeek[i].VolumeMeans;
                        if (MOlastMonthUpdate[$isogdData.isogd.isogdWeek[i].ID] === undefined && $isogdData.isogd.isogdWeek[i].VolumeMeans !== undefined) {
                            MOlastMonthUpdate[$isogdData.isogd.isogdWeek[i].ID] = {};
                            MOlastMonthUpdate[$isogdData.isogd.isogdWeek[i].ID].week = data;
                            MOlastMonthUpdate[$isogdData.isogd.isogdWeek[i].ID].VolumeMeans = $isogdData.isogd.isogdWeek[i].VolumeMeans;
                        }
                        else {
                            if ($isogdData.isogd.isogdWeek[i].VolumeMeans !== undefined) {
                                MOlastMonthUpdate[$isogdData.isogd.isogdWeek[i].ID].week = data;
                                MOlastMonthUpdate[$isogdData.isogd.isogdWeek[i].ID].VolumeMeans = $isogdData.isogd.isogdWeek[i].VolumeMeans;
                            }
                        }
                    }
                }
            }

            _.each(MOlastMonthUpdate, function (obj) {
                sumByMonth = obj.VolumeMeans;
            });

            if ($isogdData.isogd.lastdata !== undefined) {
                for (i = 0, max = $isogdData.isogd.lastdata.length; i < max; i++) {
                    if ($isogdData.isogd.lastdata[i].VolumeMeans !== undefined)
                        sumByYear = sumByYear + parseFloat($isogdData.isogd.lastdata[i].VolumeMeans);
                }
            }

            $isogdData.stat.lastupdate = lastUpdate;
            $isogdData.stat.numberOfRecord = $isogdData.isogd.isogdLog.length;
            $isogdData.stat.sumByYear = sumByYear;
            $isogdData.stat.sumByMonth = sumByYear - sumByMonth;
            $isogdData.stat.updatesCount = updatesInLastMonth.length;
            $isogdData.stat.userCount = $isogdData.MO.length;

            $isogdData.stat.year = today.getFullYear();

            var monthArray = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
                'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

            $isogdData.stat.month = monthArray[month];

        };

    }])
})(this);