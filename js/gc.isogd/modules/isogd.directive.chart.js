/**
 * User: Julia Suhinina
 * Date: 04.09.13
 * Time: 8:35
 * Description:
 */
(function (global) {
    var
    /*глобальные переменные*/
        _win = global,
        _doc = _win.document,

    /*geoportal instace*/
        gp = _win.geoportalInstance;


    gp.directive('chart', ['$q', '$timeout', function ($q, $timeout) {
        return {
            restrict: 'A',
            scope: {
                ngModel: "="
            },
            link: function (scope, elem, attrs) {

                var data = scope.ngModel,
                    plot,
                    colors = [ "#30a0eb", "#76BDEE", "#8AC368", "#DAEDCE"],
                    drawDefer = $q.defer(),
                    drawCharts = function () {

                        if (_doc.body.clientWidth !== scope.clientWidth || scope.clientWidth === undefined) {

                            if (data !== undefined) {
                                if (data.colors !== undefined)
                                    colors = data.colors;

                                if (data.chartType === 'linear') {
                                    plot = $.plot(elem,
                                        data.dataForChart,
                                        {
                                            label: data.title,
                                            series: {
                                                lines: { show: true,
                                                    lineWidth: 1,
                                                    fill: true,
                                                    fillColor: { colors: [
                                                        { opacity: 0.1 },
                                                        { opacity: 0.1 }
                                                    ] }
                                                },
                                                points: { show: true,
                                                    lineWidth: 2,
                                                    radius: 3
                                                },
                                                shadowSize: 1,
                                                stack: true
                                            },
                                            grid: { hoverable: true,
                                                clickable: true,
                                                tickColor: "#f9f9f9",
                                                borderWidth: 0,
                                                autoHighlight: true

                                            },
                                            legend: {
                                                // show: false
                                                labelBoxBorderColor: "#fff"
                                            },
                                            colors: [colors[0]],
                                            xaxis: {
                                                ticks: data.labels,
                                                font: {
                                                    size: 14,
                                                    family: "Open Sans, Arial",
                                                    variant: "small-caps",
                                                    color: "#9da3a9"
                                                }
                                            },
                                            yaxis: {
                                                ticks: 5,
                                                tickDecimals: 0,
                                                font: {size: 12, color: "#9da3a9"}
                                            }
                                        }
                                    );


                                }
                                if (data.chartType === 'bar') {
                                    var labels = {};
                                    if (data.horizontal === undefined || data.horizontal === false) {
                                        data.horizontal = false;
                                        labels.xaxis = data.labels;
                                        labels.yaxis = 5;
                                    }
                                    else if (data.horizontal === true) {
                                        labels.xaxis = 5;
                                        labels.yaxis = data.labels;
                                    }

                                    plot = $.plot(elem,
                                        data.dataForChart,
                                        {
                                            series: {
                                                lines: {
                                                    show: false,
                                                    lineWidth: 1,
                                                    fill: true,
                                                    fillColor: { colors: [
                                                        { opacity: 0.05 },
                                                        { opacity: 0.09 }
                                                    ] }
                                                },
                                                points: {
                                                    show: false,
                                                    lineWidth: 2,
                                                    radius: 3
                                                },
                                                bars: {
                                                    lineWidth: 1,
                                                    show: true,
                                                    barWidth: 1 / data.dataForChart.length - 0.1,
                                                    horizontal: data.horizontal,
                                                    align: 'center'
                                                },
                                                shadowSize: 1,
                                                stack: false
                                            },
                                            grid: {
                                                hoverable: true,
                                                clickable: true,
                                                tickColor: "#f9f9f9",
                                                borderWidth: 0,
                                                autoHighlight: true
                                            },
                                            legend: {
                                                // show: false
                                                labelBoxBorderColor: "#fff"
                                            },
                                            colors: [colors[2], colors[0]],
                                            xaxis: {
                                                ticks: labels.xaxis,
                                                font: {
                                                    size: 14,
                                                    family: "Open Sans, Arial",
                                                    variant: "small-caps",
                                                    color: "#9da3a9"
                                                }
                                            },
                                            yaxis: {

                                                ticks: labels.yaxis,
                                                tickDecimals: 0,
                                                font: {size: 12, color: "#9da3a9"}
                                            }
                                        });
                                }
                                if (data.chartType === 'pie') {

                                    var sumdata = 0;
                                    _.each(data.dataForChart, function (data) {
                                        sumdata = sumdata + data.data;
                                    });


                                    plot = $.plot(elem,
                                        data.dataForChart,
                                        {
                                            series: {
                                                lines: {
                                                    show: false,
                                                    lineWidth: 1,
                                                    fill: true,
                                                    fillColor: { colors: [
                                                        { opacity: 0.05 },
                                                        { opacity: 0.09 }
                                                    ] }
                                                },
                                                points: {
                                                    show: false,
                                                    lineWidth: 2,
                                                    radius: 3
                                                },
                                                bars: {
                                                    lineWidth: 1,
                                                    show: false,
                                                    barWidth: 1 / data.dataForChart.length - 0.1,
                                                    horizontal: false,
                                                    align: 'center'
                                                },
                                                pie: {
                                                    innerRadius: 0.5,
                                                    show: true,
                                                    radius: 1,
                                                    label: {
                                                        show: true,
                                                        radius: 3 / 4,
                                                        formatter: function (label, series) {
                                                            if (Math.round(series.percent) !== 0)
                                                                return '<div style="font-size:16pt;text-align:center;padding:2px;color:white;">' + Math.round(series.percent) + '<small>%</small></div>';
                                                            else
                                                                return '<div></div>';
                                                        },
                                                        background: { opacity: 0 }
                                                    }
                                                },
                                                shadowSize: 1,
                                                stack: false
                                            },
                                            grid: {
                                                hoverable: true,
                                                clickable: true,
                                                tickColor: "#f9f9f9",
                                                borderWidth: 0,
                                                autoHighlight: true
                                            },
                                            legend: {
                                                show: true,
                                                labelBoxBorderColor: "#fff"
                                            },
                                            colors: colors,
                                            xaxis: {
                                                ticks: data.labels,
                                                font: {
                                                    size: 14,
                                                    family: "Open Sans, Arial",
                                                    variant: "small-caps",
                                                    color: "#9da3a9"
                                                }
                                            },
                                            yaxis: {

                                                ticks: 5,
                                                tickDecimals: 0,
                                                font: {size: 12, color: "#9da3a9"}
                                            }
                                        });

                                    if (sumdata === 0) {
                                        elem.append('<h3 class = "zero">Нулевые показатели</h3>');
                                    }
                                }

                                function showTooltip(x, y, contents) {
                                    $('<div id="tooltip">' + contents + '</div>').css({
                                        position: 'absolute',
                                        display: 'none',
                                        top: y - 30,
                                        left: x - 50,
                                        color: "#fff",
                                        padding: '2px 5px',
                                        'border-radius': '6px',
                                        'background-color': '#3D88BA',
                                        opacity: 0.80
                                    }).appendTo("body").fadeIn(200);
                                }


                                if (data.chartType !== 'pie') {
                                    var previousPoint = null;

                                    $("#" + attrs.id).bind("plothover", function (event, pos, item) {
                                        if (item) {
                                            if (previousPoint != item.dataIndex) {
                                                previousPoint = item.dataIndex;

                                                $("#tooltip").remove();
                                                var x = item.datapoint[0].toFixed(0),
                                                    y = item.datapoint[1].toFixed(0);

                                                var
                                                    label,
                                                    axis,
                                                    value;

                                                if (data.horizontal === undefined || data.horizontal === false) {
                                                    value = y;
                                                }
                                                else {
                                                    value = x;
                                                }

//                                            if (item.series[axis].ticks[item.dataIndex].label != '')
//                                                month = item.series[axis].ticks[item.dataIndex].label;
//                                            else
//                                                month = item.series[axis].ticks[item.dataIndex - 1].label;

//                                            if (item.series.label !== undefined)
//                                                label = item.series.label + " " + month + ": " + value;
//                                            else
//                                                label = month + ": " + value;


                                                label = value;
                                                if (data.postfix !== undefined)
                                                    label = label + ' ' + data.postfix;

                                                showTooltip(item.pageX, item.pageY, label);
                                            }
                                        }
                                        else {
                                            $("#tooltip").remove();
                                            previousPoint = null;
                                        }
                                    });
                                }
                            }
                        }
                    },

                    resizeEventHandler = function () {
                        if (_doc.body.clientWidth !== scope.clientWidth) {
                            scope.clientWidth = _doc.body.clientWidth;
                            drawDefer.reject();
                            drawDefer = $q.defer();

                            drawDefer.promise.then(drawCharts);

                            $timeout(function () {
                                drawDefer.resolve();
                            }, 100);
                        }
                    };

                var winJQ = angular.element(_win);

                scope.$watch('ngModel', function (newVal) {
                    data = newVal;
                    drawCharts();
                });


                winJQ.on('resize', resizeEventHandler);

                scope.$on('$destroy', function () {
                    winJQ.off('resize', resizeEventHandler);
                })

            }
        };
    }]);

})(this);