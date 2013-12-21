/**
 * User: Julia Suhinina
 * Date: 10.10.13
 * Time: 12:06
 * Description:
 */

(function (global) {

    var
    /*глобальные переменные*/
        _win = global,

    /*JS зависимости*/
        _ = _win._,
        gp = _win.geoportalInstance;

    gp.controller('isogd.dialog.weekCntr', ['$scope', 'dialog', '$pathParams', '$isogdData', '$location', 'msg', function ($scope, dialog, $pathParams, $isogdData, $location, msg) {
        var today = new Date(),
            halfCount = 2;

        $scope.path = $location.path();
        $scope.monthArray = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

        if ($pathParams.week !== undefined) {
            var monthInd;
            for (var i = 0; i < $scope.monthArray.length; i++) {
                if ($scope.monthArray[i] == $pathParams.week.split(' ')[1])
                    monthInd = i;
            }

            if (monthInd <= today.getMonth()) {
                $scope.activeTab = $pathParams.week;
            }
            else {
                $pathParams.week = '14 января';
                $scope.activeTab = $pathParams.week;
            }
        }
        else {
            $pathParams.week = '14 января';
            $scope.activeTab = $pathParams.week;
        }

        if ($pathParams.year == today.getFullYear()) {
            $scope.month = today.getMonth();
            $scope.date = today.getDate();
            $scope.year = today.getFullYear();
        }
        else {
            $scope.month = 11;
            $scope.date = 31;
            $scope.year = $pathParams.year
        }


        $scope.twoWeeks = [];
        $scope.isogd = {};
        $scope.isogd.isogdWeek = msg;


        $scope.isogdByWeek = {};

        if ($scope.date < 16)
            halfCount = 0;
        else
            halfCount = 1;

        for (var i = 0, max = $scope.month; i <= max; i++) {
            var maxHalf = 2;

            if (i === max && $pathParams.year == today.getFullYear())
                maxHalf = halfCount;

            var week = {monthName: $scope.monthArray[i], halfs: []}
            for (var half = 0; half < maxHalf; half++) {
                if (half === 0) {
                    var
                        isogd = _.find($scope.isogd.isogdWeek, function (el) {
                            var data = new Date(el.week),
                                startDate = new Date($scope.year, i, 0),
                                stopDate = new Date($scope.year, i, 16);
                            return startDate < data && data < stopDate;
                        });
                    var month = ((i + 1) < 10) ? '0' + (i + 1) : (i + 1);
                    if (isogd !== undefined) {
                        $scope.isogdByWeek['14 ' + $scope.monthArray[i]] = isogd;
//                        $scope.isogdByWeek['14 ' + $scope.monthArray[i]].week = today.getFullYear() + '-' + month + '-14';
                    }
                    else {
                        $scope.isogdByWeek['14 ' + $scope.monthArray[i]] = {week: $scope.year + '-' + month + '-14'};
                    }

                    week.halfs.push('14 ' + $scope.monthArray[i]);
                }
                else {
                    month = ((i + 1) < 10) ? '0' + (i + 1) : (i + 1);
                    isogd = _.find($scope.isogd.isogdWeek, function (el) {
                        var data = new Date(el.week),
                            startDate = new Date($scope.year, i, 15),
                            stopDate = new Date($scope.year, i, 32);

                        return startDate < data && data < stopDate;
                    });

                    if (isogd !== undefined) {
                        $scope.isogdByWeek['28 ' + $scope.monthArray[i]] = isogd;
//                        $scope.isogdByWeek['28 ' + $scope.monthArray[i]].week = today.getFullYear() + '-' + month + '-28';
                    }
                    else {
                        $scope.isogdByWeek['28 ' + $scope.monthArray[i]] = {week: $scope.year + '-' + month + '-28'};
                    }

                    week.halfs.push('28 ' + $scope.monthArray[i]);
                }
            }

            $scope.twoWeeks.push(week);
        }

        $scope.activeWeek = $scope.isogdByWeek[$scope.activeTab];

        $scope.getClass = function (path) {
            if ($pathParams.week == path) {
                $scope.activeTab = path;
                $scope.activeWeek = $scope.isogdByWeek[$scope.activeTab];

                return "active"
            } else {
                return ""
            }
        };


        $scope.close = function (result) {
            dialog.close(result);
        };

    }]);

})(this);