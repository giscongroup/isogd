/**
 * User: Julia Suhinina
 * Date: 22.08.13
 * Time: 9:11
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

    gp.controller('isogd.page.volumeMeans', [ '$scope', '$http', '$isogdData', function ($scope, $http, $isogdData) {
        $scope.searchText = '';
        $scope.year = new Date().getFullYear();

        if ($isogdData.MO !== undefined)
            $scope.mo = $isogdData.MO;
        else
            $scope.mo = [];

        if ($isogdData.isogd.lastdata !== undefined)
            $scope.lastdata = $isogdData.isogd.lastdata;
        else
            $scope.lastdata = [];

        $scope.filterLastData = [];


        var moObj = {};
        _.each($scope.mo, function (mo) {
            moObj[mo.ID] = mo;
        });

//        $scope.$watch('searchText', function () {
//            $scope.filterLastData = [];
//            _.each($scope.lastdata, function (record) {
//                if (moObj[record.ID].NameMO.toLowerCase().match($scope.searchText.toLowerCase())) {
//                    $scope.filterLastData.push(record);
//                }
//            });
//            $scope.createGraph();
//        });
//
//        $scope.createGraph = function () {
            var
                volumeMeans = [],
                labels = [],
                a = 1;


            _.each($scope.lastdata, function (record) {
                var nameMO = moObj[record.ID];

                if (nameMO !== undefined) {
                    if (record.VolumeMeans === undefined)
                        record.VolumeMeans = 0;

                    volumeMeans.push([ record.VolumeMeans, a ]);
                    labels.push([a, nameMO.NameMO.replace(/муниципальный район/g, '')]);
                    a = a + 1;
                }
            });

            $scope.chartVolumeMeans = {
                labels: labels,
                chartType: 'bar',
                dataForChart: [
                    { data: volumeMeans, label: ''}
                ],
                horizontal: true,
                postfix: 'тыс. руб.'
            };
//        }
    }]);


})(this);