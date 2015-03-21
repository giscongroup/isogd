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
            maxyeardate = $pathParams.year == today.getFullYear() ? new Date() : new Date($pathParams.year, 11, 31),
            halfCount = 2,
            maxmonth, date, year;

        $scope.path = $location.path();
        $scope.monthArray = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
            'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];


        $pathParams.phase === undefined && ($pathParams.phase = '1');
        $scope.activeTab = $pathParams.phase;

        if ($pathParams.year == today.getFullYear()) {
            maxmonth = today.getMonth();
            date = today.getDate();
            year = today.getFullYear();
        }
        else {
            maxmonth = 11;
            date = 31;
            year = $pathParams.year
        }

        $scope.year = year;

        $scope.twoWeeks = [];
        $scope.isogd = {};
        $scope.isogd.isogdWeek = msg;


        $scope.isogdByWeek = {};

        halfCount = date < 16 ? 0 : 1;

        for (var i = 0, max = maxmonth; i <= max; i++) {
            var maxHalf = 2;

            if (i === max && $pathParams.year == today.getFullYear())
                maxHalf = halfCount;

            var week = {monthName: $scope.monthArray[i], halfs: []};
            for (var half = 0; half < maxHalf; half++) {
                if (half === 0) {
                    var
                        isogd = _.find($scope.isogd.isogdWeek, function (el) {
                            return parseInt(el.phase) === ((i + 1) * 2) - 1;
                        });
                    var phase = ((i + 1) * 2) - 1;
                    $scope.isogdByWeek[phase] = isogd !== undefined ? isogd : {phase: phase};
                    week.halfs.push(phase);
                }
                else {
                    phase = (i + 1) * 2;
                    isogd = _.find($scope.isogd.isogdWeek, function (el) {
                        return parseInt(el.phase) === (i + 1) * 2;
                    });

                    $scope.isogdByWeek[phase] = isogd !== undefined ? isogd : {phase: phase};
                    week.halfs.push(phase);
                }
            }

            week.halfs.length > 0 && $scope.twoWeeks.push(week);
        }

        $scope.activeWeek = $scope.isogdByWeek[$scope.activeTab];

        $scope.getClass = function (path) {
            if ($pathParams.phase == path) {
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