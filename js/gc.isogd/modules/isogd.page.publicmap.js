/**
 * Created with JetBrains PhpStorm.
 * User: julia
 * Date: 05.08.13
 * Time: 14:38
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

    gp.controller('isogd.page.publicmap', [ '$scope', '$http', '$user', '$pathParams', '$location', function ($scope, $http, $user, $pathParams, $location) {
        var
            lastScale = 1,
            mapInit = false,
            lastMO, lastIsogd,
            colors = [ "#FF5600", "#FF7C46", "#FAAB34", "#ABF000", "#7BB640"];


        var winJQ = angular.element(_win),
            resizeFN = function () {
                if ($scope.clientWidth != _doc.body.clientWidth) {
                    $scope.clientWidth = _doc.body.clientWidth;
                    $scope.$apply();
                }
            };

        winJQ.on('resize', resizeFN);

        $scope.$on('$destroy', function () {
            winJQ.off('resize', resizeFN);
        });

        $scope.$watch('clientWidth', function (newValue, oldValue) {
            $scope.resizeMap();
        });

        $scope.legend = [
            {
                style: {
                    'background-color': colors[0],
                    height: '20px',
                    width: '40px'
                },
                label: ''
            },
            {
                style: {
                    'background-color': colors[1],
                    height: '20px',
                    width: '40px'
                },
                label: ''
            },
            {
                style: {
                    'background-color': colors[2],
                    height: '20px',
                    width: '40px'
                },
                label: ''
            },
            {
                style: {
                    'background-color': colors[3],
                    height: '20px',
                    width: '40px'
                },
                label: ''
            },
            {
                style: {
                    'background-color': colors[4],
                    height: '20px',
                    width: '40px'
                },
                label: ''
            }
        ];


        $scope.kk = {};

        var isogdObj = {},
            moObj = {};
        promise = $http.get('js/gc.isogd/isogd.srv.getDataForMap.php');
        promise.success(function (data) {
            _.each(data.isogd, function (record) {
                isogdObj[record.ID] = record;
            });
            _.each(data.mo, function (mo) {
                moObj[mo.ID] = mo;
            });
            $scope.activeTab = $pathParams.tabmap;
        });
        promise.error(function (error) {
            console.log(error);
        });

        $scope.getClass = function (path) {
            if ($scope.activeTab == path) {
                $scope.activeTab = $pathParams.tabmap;
                return "active"
            } else {
                return ""
            }
        };

        var maxX = 0,
            maxY = 0;

        _.each(krasnodar_region_svg, function (pol) {
            _.each(pol.geom, function (ring) {
                var r = ring.split(/[ML]/g);

                r.shift();
                _.each(r, function (pntText) {
                    var pnt = pntText.split(',');

                    pnt[0] = parseInt(pnt[0]);
                    pnt[1] = parseInt(pnt[1]);

                    if (maxX < pnt[0])
                        maxX = pnt[0];
                    if (maxY < pnt[1])
                        maxY = pnt[1];
                });
            });
        });

        var R = Raphael("paperMap", maxX, maxY),
            attr = {
                fill: "#eeeeee",
                stroke: "#eeeeee",
                "stroke-width": 1,
                "stroke-linejoin": "round"//,
//                opacity: 0.8
            };

        $scope.resizeMap = function () {
            if (mapInit === false)
                return;

            var
                containerWidth = _doc.getElementById('paperMap').offsetWidth,
                scale = 1 / lastScale;

            if (containerWidth < maxX)
                scale = scale * (containerWidth / maxX);

            var scaleString = 's' + scale + ',' + scale + ',0,0...';
            _.each($scope.kk, function (el) {
                el.transform(scaleString);
                el.attr("stroke-width", 1);
            });

            lastScale = containerWidth < maxX ? containerWidth = containerWidth / maxX : 1;

        };

        $scope.setColors = function (R, attr) {
            if ($scope.activeTab === 'color') {
                $scope.legend[4].label = 'Объем средств положительный';
                $scope.legend[1].label = '';
                $scope.legend[2].label = 'Объем средств нулевой, количество фактов предоставления сведений больше нуля';
                $scope.legend[3].label = '';
                $scope.legend[0].label = 'Объем средств нулевой, количество фактов предоставления сведений ноль';
            }
            else if ($scope.activeTab === 'volumeMeans') {
                $scope.legend[0].label = '0 тыс.руб.';
                $scope.legend[1].label = '0 - 100 тыс.руб.';
                $scope.legend[2].label = '100 - 300 тыс.руб.';
                $scope.legend[3].label = '300 - 500 тыс.руб.';
                $scope.legend[4].label = 'более 500 тыс.руб.';
            }
            else if ($scope.activeTab === 'grantingData') {
                $scope.legend[0].label = '0';
                $scope.legend[1].label = '0 - 100';
                $scope.legend[2].label = '100 - 300';
                $scope.legend[3].label = '300 - 500';
                $scope.legend[4].label = 'более 500';
            }

            var propArray = ['VolumeMeans', 'QuantityFactsGrantingData1', 'QuantityFactsGrantingData2', 'QuantityFactsGrantingData3', 'QuantityFactsGrantingData4']

            _.each($scope.kk, function (region, id) {
                if (id.split('_').length === 1) {
                    var isogdMO = isogdObj[id],
                        sum;

                    if (isogdMO !== undefined) {

                        _.each(propArray, function (prop) {
                            if (isogdMO[prop] === undefined)
                                isogdMO[prop] = 0;
                        });

                        sum = isogdMO.QuantityFactsGrantingData4 + isogdMO.QuantityFactsGrantingData3 + isogdMO.QuantityFactsGrantingData2 + isogdMO.QuantityFactsGrantingData1;
                    }
                    else {
                        sum = 0;
                    }

                    if ($scope.activeTab === 'color') {
                        if (id !== undefined) {
                            if ($scope.mapcolors[id] === 'green')
                                attr.fill = colors[4];
                            if ($scope.mapcolors[id] === 'yellow')
                                attr.fill = colors[2];
                            if ($scope.mapcolors[id] === 'red')
                                attr.fill = colors[0];
                        }

                        if (isogdMO !== undefined) {
                            attr.title = isogdMO.VolumeMeans + ' \n ' + sum;
                        }
                        else {
                            attr.title = '';
                        }

                    }
                    else if ($scope.activeTab === 'volumeMeans') {

                        if (isogdMO !== undefined) {

                            if (isogdMO.VolumeMeans === 0)
                                attr.fill = colors[0];
                            else if (isogdMO.VolumeMeans > 0 && isogdMO.VolumeMeans < 100)
                                attr.fill = colors[1];
                            else if (isogdMO.VolumeMeans >= 100 && isogdMO.VolumeMeans < 300)
                                attr.fill = colors[2];
                            else if (isogdMO.VolumeMeans >= 300 && isogdMO.VolumeMeans < 500)
                                attr.fill = colors[3];
                            else if (isogdMO.VolumeMeans >= 500)
                                attr.fill = colors[4];
                            attr.title = isogdMO.VolumeMeans + ' \n ' + sum;
                        }
                    }
                    else if ($scope.activeTab === 'grantingData') {

                        if (sum === 0)
                            attr.fill = colors[0];
                        else if (sum > 0 && sum < 100)
                            attr.fill = colors[1];
                        else if (sum >= 100 && sum < 300)
                            attr.fill = colors[2];
                        else if (sum >= 300 && sum < 500)
                            attr.fill = colors[3];
                        else if (sum >= 500)
                            attr.fill = colors[4];

                        attr.title = isogdMO.VolumeMeans + ' \n ' + sum;

                    }
                    region.attr(attr);
                }
            });

        };

        $scope.$watch('activeTab', function () {
            $scope.setColors(R, attr);
        });


        $scope.current = undefined;

        var promise = $http.get('js/gc.isogd/isogd.srv.mapcolor.php');
        promise.success(function (data) {
            $scope.mapcolors = data;
            if ($scope.mapcolors !== undefined) {

                /////районы///////////////////////////////////////////

                for (i = 0, max = krasnodar_region_svg.length; i < max; i++) {
                    $scope.kk[krasnodar_region_svg[i].idMO] = R.path(krasnodar_region_svg[i].geom).attr(attr);
                }
                $scope.setColors(R, attr);

                /////города///////////////////////////////////////////
                for (var i = 0, max = krasnodar_city_svg.length; i < max; i++) {
                    var radius,
                        x = krasnodar_city_svg[i].cX,
                        y = krasnodar_city_svg[i].cY,
                        name = krasnodar_city_svg[i].nameCity;

                    if (krasnodar_city_svg[i].place === 'city') {
                        radius = 6;
                        $scope.kk['city_' + krasnodar_city_svg[i].idCity] = R.circle(x, y, radius).attr({
                            fill: "#6A6A61",
                            stroke: "#FFFFFF",
                            "stroke-width": 2,
                            title: name
                        });
                        $scope.kk['text_' + krasnodar_city_svg[i].idCity] = R.text(x + 10, y, name).attr({
                            'text-anchor': 'start',
                            "font-family": '"Helvetica"',
                            "font-size": 16,
                            title: krasnodar_city_svg[i].nameCity
                        });
                    }
                    else {
                        radius = 3;
                        $scope.kk['town_' + krasnodar_city_svg[i].idCity] = R.circle(x, y, radius).attr({
                            fill: "#6A6A61",
                            stroke: "#6A6A61",
                            "stroke-width": 1,
                            title: name
                        });
                        $scope.kk['text_' + krasnodar_city_svg[i].idCity] = R.text(x + 8, y, name).attr({
                            fill: "#333333",
                            'text-anchor': 'start',
                            "font-family": '"Helvetica"',
                            "font-size": 12,
                            title: name
                        });
                    }
                }

                function browser() {
                    var ua = navigator.userAgent;

                    if (ua.search(/MSIE/) > 0) return 'Internet Explorer';
                    if (ua.search(/Firefox/) > 0) return 'Firefox';
                    if (ua.search(/Opera/) > 0) return 'Opera';
                    if (ua.search(/Chrome/) > 0) return 'Google Chrome';
                    if (ua.search(/Safari/) > 0) return 'Safari';
                    if (ua.search(/Konqueror/) > 0) return 'Konqueror';
                    if (ua.search(/Iceweasel/) > 0) return 'Debian Iceweasel';
                    if (ua.search(/SeaMonkey/) > 0) return 'SeaMonkey';

                    return 'Search Bot';
                }

                var br = browser();
                /////события///////////////////////////////////////////
                _.each($scope.kk, function (st, state) {
                    var el = _ng.element(st[0]);
                    if (state.split('_').length === 1) {
                        var mouseover;

                        el.css('cursor', 'pointer');

                        mouseover = function (evt) {

                            if ($scope.current !== undefined)
                                $scope.current.attr({opacity: 0.8});

                            st.attr({opacity: 0.8, "stroke-width": 1});
                            $scope.$apply(function () {

                                var moToDisplay = moObj[state];

                                $scope.moToDisplay = moToDisplay;
                                lastMO = moToDisplay;

                                if (moToDisplay !== undefined) {

                                    $scope.isogdDataToDisplay = st.attrs.title.split('\n');
                                    lastIsogd = $scope.isogdDataToDisplay;

                                }
                                $scope.current = st;

                            });
                        };

                        el.on('mousemove', function (evt) {
                            $scope.$apply(function () {
//                                var element = angular.element(evt.target);
                                if (br !== 'Firefox') {
                                    $scope.x = evt.clientX;
                                    $scope.y = evt.clientY;
                                }
                                else {
                                    $scope.x = evt.pageX - 227;
                                    $scope.y = evt.pageY - 150;
                                }
                            });
                        });


                        el.on('mouseover', mouseover);

                        el.on('click', function (evt) {
                            if ($user.manager == 1) {
                                $location.url('/graph/mo/?idmo=' + state);
                                $scope.$apply();
                            }
                        });

                        el.on('mouseleave', function () {
                            st.attr({opacity: 1, "stroke-width": 1});
                            $scope.$apply(function () {
                                $scope.current = undefined;
                                $scope.moToDisplay = undefined;
                                $scope.isogdDataToDisplay = [];
                            });
                        });

//                        if (state == "nsw") {
//                            mouseover();
//                        }
                    }
                    else {

                        el.css('cursor', 'pointer');

                        el.on('mousemove', function (evt) {
                            $scope.$apply(function () {

                                if (br !== 'Firefox') {
                                    $scope.x = evt.clientX;
                                    $scope.y = evt.clientY;
                                }
                                else {

                                    $scope.x = evt.pageX - 227;
                                    $scope.y = evt.pageY - 150;
                                }
                            });
                        });

                        el.on('click', function (evt) {
                            $location.url('/graph/mo/?idmo=' + lastMO.ID);
                            $scope.$apply();
                        });

                        el.on('mouseover', function () {
                            $scope.$apply(function () {
                                $scope.moToDisplay = lastMO;
                                $scope.isogdDataToDisplay = lastIsogd;
                            });
                        });

                        el.on('mouseleave', function () {
                            $scope.$apply(function () {
                                $scope.moToDisplay = undefined;
                                $scope.isogdDataToDisplay = undefined;
                            });
                        });
                    }
                });


                mapInit = true;
                $scope.resizeMap();

            }
        });


    }])


})(this);
