/**
 * User: Julia Suhinina
 * Date: 28.08.13
 * Time: 13:05
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


    gp.controller('isogd.page.graphsByMO', [ '$scope', '$http', '$user', '$isogdData', '$location', '$pathParams', function ($scope, $http, $user, $isogdData, $location, $pathParams) {

        $scope.turnList = function (evt) {
            var element = angular.element(evt.target);
            if (element.parent().hasClass('min')) {
                element.parent().removeClass('min');
                element.removeClass('icon-plus');
                element.addClass('icon-minus');
            }
            else {
                element.parent().addClass('min');
                element.removeClass('icon-minus');
                element.addClass('icon-plus');
            }
        };

        $scope.search = {NameMO: ''};
        $scope.mo = $isogdData.MO;
        $scope.pathParams = $pathParams;
        $scope.isogd = $isogdData.isogd;

        var today = new Date();

        $scope.month = today.getMonth() + 1;
        if ($scope.month < 10)
            $scope.month = '0' + $scope.month;

        $scope.day = today.getDate();
        if ($scope.day < 10)
            $scope.day = '0' + $scope.day;

        $scope.year = today.getFullYear();


        var isogdObj = {};
        _.each($scope.isogd.lastdata, function (record) {
            isogdObj[record.ID] = record;
        });

        var moObj = {};
        _.each($scope.mo, function (mo) {
            moObj[mo.ID] = mo;
        });

        $scope.$watch('pathParams.idmo', function () {

            $scope.currentMO = moObj[$scope.pathParams.idmo];
            $scope.currentISOGD = isogdObj[$scope.pathParams.idmo];

            $scope.createGraph($scope.pathParams.idmo);
        });

        $scope.getClass = function (path) {
            if ($scope.pathParams.idmo == path) {

                return "active"
            } else {
                return ""
            }
        };

        $scope.reportData = {};

        $scope.createGraph = function (id) {

            var updateGraph = function () {
                $scope.chartVolumeMeansMO = {
                    labels: $scope.reportData[$scope.pathParams.idmo].labels,
                    chartType: 'linear',
                    dataForChart: [
                        {data: $scope.reportData[$scope.pathParams.idmo].volumeMeans, label: 'Поступления в бюджет (тыс.руб.)'}
                    ],
                    postfix: 'тыс.руб.'
                };

                $scope.chartIncrementMO = {
                    labels: $scope.reportData[$scope.pathParams.idmo].labels,
                    chartType: 'bar',
                    dataForChart: [
                        {data: $scope.reportData[$scope.pathParams.idmo].increment, label: 'Прирост поступлений (тыс.руб.)'}
                    ],
                    postfix: 'тыс.руб.'
                };

                $scope.chartQuantityFactsGrantingDataMO = {
                    labels: $scope.reportData[$scope.pathParams.idmo].labels,
                    chartType: 'linear',
                    dataForChart: [
                        {data: $scope.reportData[$scope.pathParams.idmo].quantityFactsGrantingData, label: 'Количество фактов (шт.)'}
                    ]
                };

                $scope.chartQuantityFactsGrantingDataPieMO = {
                    labels: [],
                    chartType: 'pie',
                    dataForChart: [
                        {data: $scope.reportData[$scope.pathParams.idmo].SumQuantityFactsGrantingData.QuantityFactsGrantingData2, label: 'Сведения с взиманием платы'},
                        {data: $scope.reportData[$scope.pathParams.idmo].SumQuantityFactsGrantingData.QuantityFactsGrantingData1, label: 'Сведения без взимания платы'},
                        {data: $scope.reportData[$scope.pathParams.idmo].SumQuantityFactsGrantingData.QuantityFactsGrantingData4, label: 'Копия одного документа с взиманием платы'},
                        {data: $scope.reportData[$scope.pathParams.idmo].SumQuantityFactsGrantingData.QuantityFactsGrantingData3, label: 'Копия одного документа без взимания платы'}

                    ]
                };

                $scope.chartQuantityFactsGrantingDataIncrementMO1 = {
                    labels: $scope.reportData[$scope.pathParams.idmo].labels,
                    chartType: 'bar',
                    dataForChart: [
                        {data: $scope.reportData[$scope.pathParams.idmo].quantityFactsGrantingData1Increment, label: 'Количество фактов предоставления сведений без взимания платы'},
                        {data: $scope.reportData[$scope.pathParams.idmo].quantityFactsGrantingData2Increment, label: 'Количество фактов предоставления сведений с взиманием платы'}
                    ]
                };

                $scope.chartQuantityFactsGrantingDataIncrementMO2 = {
                    labels: $scope.reportData[$scope.pathParams.idmo].labels,
                    chartType: 'bar',
                    dataForChart: [
                        {data: $scope.reportData[$scope.pathParams.idmo].quantityFactsGrantingData3Increment, label: 'Количество фактов предоставления копии одного документа без взимания платы'},
                        {data: $scope.reportData[$scope.pathParams.idmo].quantityFactsGrantingData4Increment, label: 'Количество фактов предоставления копии одного документа с взиманием платы'}
                    ]
                };

            };

            if ($scope.reportData[$scope.pathParams.idmo] === undefined) {
                var promise = $http.get('js/gc.isogd/isogd.srv.getGraphDataByMO.php?ID=' + $scope.pathParams.idmo);
                promise.success(function (data) {
                    if (typeof(data) === 'object') {
                        $scope.reportData[$scope.pathParams.idmo] = data;
                        updateGraph();
                    }
                });
                promise.error(function (data) {
                    console.log(data);
                });
            }
            else {
                updateGraph();
            }
        }
    }])
})(this);
