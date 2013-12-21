/**
 * User: Julia Suhinina
 * Date: 29.08.13
 * Time: 16:11
 * Description:
 */

(function (global) {
    var
    /*глобальные переменные*/
        _win = global,

    /*JS зависимости*/
        _ = _win._,
        gp = _win.geoportalInstance;


    gp.controller('isogd.page.dynamicParam', [ '$scope', '$isogdData', '$http', function ($scope, $isogdData, $http) {

        $scope.year = new Date().getFullYear();

        if ($isogdData.isogd.alldata !== undefined)
            $scope.lastUpdates = $isogdData.isogd.alldata;

        if ($isogdData.isogd.isogdWeek !== undefined)
            $scope.isogdByWeek = $isogdData.isogd.isogdWeek;
        else
            $scope.isogdByWeek = [];
        $scope.mo = $isogdData.MO;

        $scope.sumByWeek = {};

        for (var i = 0, max = $scope.isogdByWeek.length; i < max; i++) {
            var week;
            if ($scope.isogdByWeek[i].week.split('-')[2] <= 15)
                week = $scope.isogdByWeek[i].week.split('-')[0] + '-' + $scope.isogdByWeek[i].week.split('-')[1] + '-01';
            else
                week = $scope.isogdByWeek[i].week.split('-')[0] + '-' + $scope.isogdByWeek[i].week.split('-')[1] + '-02';

            if ($scope.sumByWeek[week] === undefined)
                $scope.sumByWeek[week] = {
                    VolumeMeans: 0,
                    QuantityFactsGrantingData1: 0,
                    QuantityFactsGrantingData2: 0,
                    QuantityFactsGrantingData3: 0,
                    QuantityFactsGrantingData4: 0
                };

            $scope.sumByWeek[week].VolumeMeans = $scope.sumByWeek[week].VolumeMeans + $scope.isogdByWeek[i].VolumeMeans;
            $scope.sumByWeek[week].QuantityFactsGrantingData1 = $scope.sumByWeek[week].QuantityFactsGrantingData1 + $scope.isogdByWeek[i].QuantityFactsGrantingData1;
            $scope.sumByWeek[week].QuantityFactsGrantingData2 = $scope.sumByWeek[week].QuantityFactsGrantingData2 + $scope.isogdByWeek[i].QuantityFactsGrantingData2;
            $scope.sumByWeek[week].QuantityFactsGrantingData3 = $scope.sumByWeek[week].QuantityFactsGrantingData3 + $scope.isogdByWeek[i].QuantityFactsGrantingData3;
            $scope.sumByWeek[week].QuantityFactsGrantingData4 = $scope.sumByWeek[week].QuantityFactsGrantingData4 + $scope.isogdByWeek[i].QuantityFactsGrantingData4;

        }

        var
            lastWeek = '',
            keys = Object.keys($scope.sumByWeek),
            monthArray = ['янв', 'февр', 'март', 'апр', 'май', 'июнь',
                'июль', 'авг', 'сент', 'окт', 'нояб', 'дек'],
            volumeMeans = [],
            increment = [],
            labels = [],
            quantityFactsGrantingData = [],
            quantityFactsGrantingData1Increment = [],
            quantityFactsGrantingData2Increment = [],
            quantityFactsGrantingData3Increment = [],
            quantityFactsGrantingData4Increment = [],
            a = 1,
            pie = {},
            lastData = {
                VolumeMeans: 0,
                QuantityFactsGrantingData1: 0,
                QuantityFactsGrantingData2: 0,
                QuantityFactsGrantingData3: 0,
                QuantityFactsGrantingData4: 0
            };


        keys.sort();

        $scope.SumQuantityFactsGrantingData = {
            QuantityFactsGrantingData1: 0,
            QuantityFactsGrantingData2: 0,
            QuantityFactsGrantingData3: 0,
            QuantityFactsGrantingData4: 0
        };

        _.each(keys, function (week) {
            var mo = $scope.sumByWeek[week];

            if (lastWeek !== '') {
                lastData = $scope.sumByWeek[lastWeek];


                $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData1 = $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData1 + mo.QuantityFactsGrantingData1;
                $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData2 = $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData2 + mo.QuantityFactsGrantingData2;
                $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData3 = $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData3 + mo.QuantityFactsGrantingData3;
                $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData4 = $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData4 + mo.QuantityFactsGrantingData4;
                volumeMeans.push([a, mo.VolumeMeans]);
                increment.push([a, mo.VolumeMeans - lastData.VolumeMeans]);

                if (a % 2 !== 0)
                    labels.push([a, monthArray[parseInt(week.split('-')[1]) - 1]]);
                else
                    labels.push([a, '']);

                quantityFactsGrantingData.push([a, mo.QuantityFactsGrantingData1 + mo.QuantityFactsGrantingData2 + mo.QuantityFactsGrantingData3 + mo.QuantityFactsGrantingData4]);
                quantityFactsGrantingData1Increment.push([a + 0.35, mo.QuantityFactsGrantingData1 - lastData.QuantityFactsGrantingData1]);
                quantityFactsGrantingData2Increment.push([a + 0.8, mo.QuantityFactsGrantingData2 - lastData.QuantityFactsGrantingData2]);
                quantityFactsGrantingData3Increment.push([a + 0.35, mo.QuantityFactsGrantingData3 - lastData.QuantityFactsGrantingData3]);
                quantityFactsGrantingData4Increment.push([a + 0.8, mo.QuantityFactsGrantingData4 - lastData.QuantityFactsGrantingData4]);
                lastData = mo;
                a = a + 1;
            }
            lastWeek = week;
        });


        $scope.chartVolumeMeansMO = {
            labels: labels,
            chartType: 'linear',
            dataForChart: [
                {data: volumeMeans, label: 'Поступления в бюджет (тыс.руб.)'}
            ],
            postfix: 'тыс.руб.'
        };

        $scope.chartIncrementMO = {
            labels: labels,
            chartType: 'bar',
            dataForChart: [
                {data: increment, label: 'Прирост поступлений (тыс.руб.)'}
            ],
            postfix: 'тыс.руб.'
        };

        $scope.chartQuantityFactsGrantingDataMO = {
            labels: labels,
            chartType: 'linear',
            dataForChart: [
                {data: quantityFactsGrantingData, label: 'Количество фактов (шт.)'}
            ]
        };

        $scope.chartQuantityFactsGrantingDataPieMO = {
            labels: [],
            chartType: 'pie',
            dataForChart: [
                {data: $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData2, label: 'Сведения с взиманием платы'},
                {data: $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData1, label: 'Сведения без взимания платы'},
                {data: $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData4, label: 'Копия одного документа с взиманием платы'},
                {data: $scope.SumQuantityFactsGrantingData.QuantityFactsGrantingData3, label: 'Копия одного документа без взимания платы'}

            ]
        };

        $scope.chartQuantityFactsGrantingDataIncrementMO1 = {
            labels: labels,
            chartType: 'bar',
            dataForChart: [
                {data: quantityFactsGrantingData1Increment, label: 'Количество фактов предоставления сведений без взимания платы'},
                {data: quantityFactsGrantingData2Increment, label: 'Количество фактов предоставления сведений с взиманием платы'}
            ]
        };

        $scope.chartQuantityFactsGrantingDataIncrementMO2 = {
            labels: labels,
            chartType: 'bar',
            dataForChart: [
                {data: quantityFactsGrantingData3Increment, label: 'Количество фактов предоставления копии одного документа без взимания платы'},
                {data: quantityFactsGrantingData4Increment, label: 'Количество фактов предоставления копии одного документа с взиманием платы'}
            ]
        };

        var promise = $http.get('js/gc.isogd/isogd.srv.getlog.php');
        promise.success(function (data) {
            if (typeof (data) === 'object') {
                var log = [],
                    index = 1,
                    today = new Date();

                for (var i = 1, max = today.getMonth() + 2; i < max; i++) {
                    var maxa = 2;
                    if (i === max - 1 && today.getDate() <= 15) {
                        maxa = 1;
                    }

                    for (var a = 0; a < maxa; a++) {
                        var currentDate = i + '-',
                            sum;
                        if (a === 0)
                            currentDate = currentDate + '01';
                        else
                            currentDate = currentDate + '16';
                        sum = data[currentDate];
                        if (sum !== undefined)
                            log.push([index, sum]);
                        else
                            log.push([index, 0]);
                        index = index + 1;
                    }
                }

                $scope.chartLog = {
                    labels: labels,
                    chartType: 'linear',
                    dataForChart: [
                        {data: log, label: 'Количество обновлений (шт.)'}
                    ]
                };
            }
        });
        promise.error(function (data) {
            console.log(data);
        });


    }])
})(this);