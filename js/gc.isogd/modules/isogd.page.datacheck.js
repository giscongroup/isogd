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
            var
                today = new Date(),
                month = today.getMonth();

            $isogdData.stat.year = today.getFullYear();

            var monthArray = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
                'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

            $isogdData.stat.month = monthArray[month];

            var promise = $http.get('js/gc.isogd/isogd.srv.getStat.php');
            promise.success(function (data) {
                if (typeof(data) === 'object') {
                    _.each(data, function (value, name) {
                        $isogdData.stat[name] = name === 'lastupdate' ? new Date(value) : value;
                    });
                }
            });
            promise.error(function (data) {
                console.log(data);
            });
        };

    }])
})(this);