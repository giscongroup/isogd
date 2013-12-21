/**
 * User: Julia Suhinina
 * Date: 08.10.13
 * Time: 15:03
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

    gp.controller('isogd.dialog.selectMO', ['$scope', 'dialog', '$isogdData', 'msg', '$user', function ($scope, dialog, $isogdData, msg, $user) {


        if ($user.manager == 1) {
            $scope.mo = $isogdData.MO;
        }
        else {
            $scope.mo = $isogdData.allMO;
        }

        $scope.user = $user;

        $scope.searchText = '';
        $scope.filterMO = [];
        $scope.selectMO = {};
        $scope.showSelected = false;

        $scope.currentPage = 0;
        $scope.pageSize = 12;

        if (msg !== undefined) {
            $scope.selectMO = msg;
        }

        $scope.changePage = function (page) {
            $scope.currentPage = page - 1;
        };

        $scope.getClass = function (page) {
            if (page === $scope.currentPage + 1)
                return 'active';
            else
                return '';
        };

        $scope.$watch('searchText', function () {
            $scope.filterFun()
        });

        $scope.$watch('showSelected', function () {
            $scope.filterFun()
        });

        $scope.filterFun = function () {
            if ($scope.showSelected === true) {

                $scope.filterMO = [];
                _.each($scope.mo, function (mo) {
                    if (mo.NameMO.toLowerCase().match($scope.searchText.toLowerCase()) && $scope.selectMO[mo.ID] === true) {
                        $scope.filterMO.push(mo);
                    }
                });

                $scope.pagearray = [];
                for (var i = 1, max = Math.ceil($scope.filterMO.length / $scope.pageSize); i <= max; i++) {
                    $scope.pagearray.push(i);
                }
                if ($scope.currentPage > $scope.pagearray.length)
                    $scope.currentPage = $scope.pagearray.length - 1
            }
            else {
                $scope.filterMO = [];
                _.each($scope.mo, function (mo) {
                    if (mo.NameMO.toLowerCase().match($scope.searchText.toLowerCase())) {
                        $scope.filterMO.push(mo);
                    }
                });

                $scope.pagearray = [];
                for (i = 1, max = Math.ceil($scope.filterMO.length / $scope.pageSize); i <= max; i++) {
                    $scope.pagearray.push(i);
                }
                if ($scope.currentPage > $scope.pagearray.length)
                    $scope.currentPage = $scope.pagearray.length - 1
            }
        };

        $scope.close = function (selectMO) {

            dialog.close(selectMO);
        };
    }]);

})(this);