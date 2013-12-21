/**
 * Created with JetBrains PhpStorm.
 * User: julia
 * Date: 07.08.13
 * Time: 14:48
 * To change this template use File | Settings | File Templates.
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

    gp.controller('isogd.page.table', [ '$scope', '$http', '$user', '$isogdData', '$pathParams', function ($scope, $http, $user, $isogdData, $pathParams) {


//        var sortMethod = '';

        $scope.activeTab = $pathParams.tabtable;

        $scope.getClass = function (path) {
            if ($scope.activeTab == path) {
                $scope.activeTab = $pathParams.tabtable;
                return "active"
            } else {
                return ""
            }
        };

        $scope.dbinfo = {};
        $scope.searchText = '';

        $scope.dbinfo.numberOfrecord = $isogdData.isogd.length;

        if ($isogdData.isogd.lastdata !== undefined)
            $scope.isogddata = $isogdData.isogd.lastdata;
        else
            $scope.isogddata = [];

        $scope.user = $user;
        $scope.mo = $isogdData.MO;
        $scope.money = true;
        $scope.filterIsogd = [];

        $scope.$watch('searchText', function () {
            if ($scope.searchText.length >= 3 || $scope.searchText === '') {
                $scope.dbinfo.volumemeans = 0;
                $scope.filterIsogd = [];

                _.each($scope.isogddata, function (isogd) {
                    if (isogd.NameMO.toLowerCase().match($scope.searchText.toLowerCase())) {
                        $scope.filterIsogd.push(isogd);
                        if (isogd.VolumeMeans !== undefined)
                            $scope.dbinfo.volumemeans = $scope.dbinfo.volumemeans + parseInt(isogd.VolumeMeans);
                    }
                });
                $scope.dbinfo.numberOfrecord = $scope.filterIsogd.length;

            }
            else if ($scope.searchText.length === 0) {
                $scope.filterIsogd = $scope.isogddata.slice();
            }
        });

//        $scope.sortdata = function (nameofcolumn) {
//            $scope.filterIsogd = _.sortBy($scope.filterIsogd, function (element) {
//                if (typeof element[nameofcolumn] === 'string')
//                    return element[nameofcolumn].toLowerCase();
//                else
//                    return element[nameofcolumn]
//            });
//            if (sortMethod === 'sIncrease') {
//                $scope.filterIsogd.reverse();
//                sortMethod = 'sDecrease';
//            }
//            else if (sortMethod === 'sDecrease' || sortMethod === '') {
//                sortMethod = 'sIncrease';
//            }
//        }

    }])

})(this);