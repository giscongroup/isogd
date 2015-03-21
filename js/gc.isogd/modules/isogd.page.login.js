/**
 * Created with JetBrains PhpStorm.
 * User: julia
 * Date: 02.08.13
 * Time: 15:10
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

    gp.controller('isogd.page.login', [ '$scope', '$http', '$user', '$location', '$pathToReturn', '$isogdData', function ($scope, $http, $user, $location, $pathToReturn, $isogdData) {
        $scope.login = "Polkvoy";
        $scope.password = "921";
        $scope.process = '';

        $scope.krasnodar_region_svg = krasnodar_region_svg;

        $scope.isogd = $isogdData.isogd;

        $scope.invalidAuthorization = '';
        $scope.invalidConnection = '';


        $scope.login = "3657000W6";
        $scope.password = "N1d4G5f5";
//
//        $scope.login = "3655000T3";
//        $scope.password = "K5M0g7M3";
//
//        $scope.password = 'A4r2m4k8';
//        $scope.login = "3641000P8";
//
//        $scope.login = "3601000X3";
//        $scope.password = "a5i3B4Q1";

        $scope.getISOGDdata = function () {
            var promise = $http.get('js/gc.isogd/isogd.srv.getisogd.php');
            promise.success(function (data) {
                if (typeof (data) === 'object')
                    $isogdData.isogd = data;
                $scope.getMOdata();
            });
            promise.error(function (data) {
                console.log(data);
                $scope.getMOdata();
            });
        };

        $scope.getMOdata = function () {
            var promise = $http.get('js/gc.isogd/isogd.srv.getmo.php');
            promise.success(function (data) {

                if (typeof (data) === 'object') {
                    $isogdData.MO = data;
                    $scope.MO = $isogdData.MO[0];
                }
                $scope.getMessages();
            });
            promise.error(function (data) {
                console.log(data);
                $scope.getMessages();
            });

            if ($user.manager == 0) {
                promise = $http.get('js/gc.isogd/isogd.srv.getMOList.php');
                promise.success(function (data) {
                    if (typeof (data) === 'object') {
                        $isogdData.allMO = data;
                    }
                });
                promise.error(function (data) {
                    console.log(data);
                });
            }
        };

        $scope.getMessages = function () {
            var promise = $http.get('js/gc.isogd/isogd.srv.getmessages.php');
            promise.success(function (data) {

                if (typeof (data) === 'object') {
                    $user.messages = data;
                    $user.newMessageCount = 0;
                    _.each(data, function (msg) {
                        if (msg.mailto == $user.session_id && msg.isread == 0) {
                            $user.newMessageCount = $user.newMessageCount + 1;
                        }
                    });
                }
                $scope.getstat();
            });
            promise.error(function (data) {
                console.log(data);
                $scope.getstat();
            });
        };

        $scope.authorization = function () {
            if ($scope.process !== 'hid' && $scope.invalidAuthorization === '') {
                $scope.process = 'hid';
                $scope.invalidConnection = '';

                var promise = $http.post('js/gc.isogd/login.php', {password: $scope.password, login: $scope.login});
                promise.success(function (data) {
                    if (typeof(data) === 'object') {

                        $user.session_id = data.ID;
                        $user.nameMO = data.NameMO;
                        $user.manager = data.manager;

                        $scope.getISOGDdata();
                    }
                    else {
                        $scope.process = '';
                        if (data === 'Invalid login or password') {
                            $scope.invalidAuthorization = 'hid';
                        }
                        else {
                            $scope.invalidConnection = 'hid';
                        }
                    }

                });
                promise.error(function () {
                    $scope.process = '';
                    $scope.invalidConnection = 'hid';
                });
            }
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
                $scope.getColorArea();
            });
            promise.error(function (data) {
                console.log(data);
                $scope.getColorArea();
            });
        };

        $scope.getColorArea = function () {
            var promise = $http.get('js/gc.isogd/isogd.srv.mapcolor.php');
            $isogdData.stat.areaColor = {};
            promise.success(function (data) {
                $isogdData.stat.areaColor.greenarea = data.green;
                $isogdData.stat.areaColor.redarea = data.red;
                $isogdData.stat.areaColor.yellowarea = data.yellow;
                $location.url($pathToReturn.returnTo);
            });
            promise.error(function (data) {
                $location.url($pathToReturn.returnTo);
            });

        };


    }
    ]);
})(this);
