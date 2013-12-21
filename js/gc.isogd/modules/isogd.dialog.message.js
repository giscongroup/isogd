/**
 * User: Julia Suhinina
 * Date: 08.10.13
 * Time: 15:00
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


    gp.controller('isogd.dialog.message', ['$scope', 'dialog', '$isogdData', '$dialog', 'msg', '$http', '$user', function ($scope, dialog, $isogdData, $dialog, msg, $http, $user) {

        $scope.pageSize = 5;
        $scope.selectMO = {};
        $scope.message = {};

        $scope.getArraySelectMO = function () {
            $scope.selectMOArray = [];
            _.each($scope.selectMO, function (value, id) {
                if (value === true) {
                    var mo = _.find($scope.MO, function (mo) {
                        return mo.ID == id;
                    });
                    if (mo !== undefined) {
                        $scope.selectMOArray.push(mo);
                    }
                }
            })
        };

        if ($user.manager == 1) {
            $scope.MO = $isogdData.MO;
        }
        else {
            $scope.MO = $isogdData.allMO;
        }


        if (msg !== undefined) {
            $scope.message = msg;
            if (msg.mailto !== undefined) {
                $scope.selectMO[msg.mailto] = true;
                $scope.getArraySelectMO();
            }
            if (msg.message !== undefined) {
                $scope.message.textMSG = msg.message;
            }
        }

        $scope.answer = function (id) {
            dialog.close();
            var msg = {};
            if ($scope.message.mailto == $user.session_id) {
                msg.mailto = id;
            }
            if ($scope.message.mailfrom == $user.session_id) {
                msg.message = id;
            }


            var d = $dialog.dialog({
                backdrop: true,
                keyboard: true,
                backdropClick: false,
                templateUrl: "js/gc.isogd/templates/isogd.dialog.message.html",
                controller: 'isogd.dialog.message',
                resolve: {
                    msg: function () {
                        return msg;
                    }
                }
            });
            d.open().then(function (result) {

            });


        };

        $scope.openDialog = function () {

            var d = $dialog.dialog({
                backdrop: true,
                keyboard: true,
                backdropClick: false,
                templateUrl: "js/gc.isogd/templates/isogd.dialog.selectMO.html",
                controller: 'isogd.dialog.selectMO',
                resolve: {
                    msg: function () {
                        return $scope.selectMO;
                    }
                }
            });
            d.open().then(function (result) {
                if (result !== undefined) {
                    $scope.selectMO = result;
                    $scope.getArraySelectMO();
                }
            });
        };

        $scope.close = function (message) {
            if (message === undefined) {
                dialog.close(message);
            }
            else {

                message.mailto = [];
                _.each($scope.selectMO, function (value, id) {
                    if (value === true)
                        message.mailto.push(id)
                });
                if (message.mailto.length !== 0) {
                    var promise = $http.post('js/gc.isogd/isogd.fn.savemsg.php', message);

                    promise.success(function (data) {
                        var promise = $http.get('js/gc.isogd/isogd.srv.getmessages.php');
                        promise.success(function (data) {
                            if (typeof (data) === 'object') {
                                $user.messages = data;
                            }
                            dialog.close(message);
                        });
                        promise.error(function (data) {
                            console.log(data);
                            dialog.close(message);
                        });

                    });
                    promise.error(function (data) {
                        dialog.close(message);
                    });
                }

            }
        };

        $scope.markRead = function (msg) {
            if (msg.isread == 0 && msg.mailto == $user.session_id) {
                var promise = $http.get('js/gc.isogd/isogd.fn.markRead.php?code=' + msg.Code);
                promise.success(function (data) {

                    var promise = $http.get('js/gc.isogd/isogd.srv.getmessages.php');
                    promise.success(function (data) {
                        if (typeof (data) === 'object') {
                            $user.messages = data;
                            $user.newMessageCount = 0;
                            _.each(data, function (msg) {
                                if (msg.mailto == $user.session_id && msg.isread == 0) {
                                    $user.newMessageCount = $user.newMessageCount + 1;
                                }
                            })
                        }

                    });
                    promise.error(function (data) {
                        console.log(data);
                    });
                });
                promise.error(function (data) {
                    console.log(data);
                });
            }
        };

        if ($scope.message.Code !== undefined)
            $scope.markRead($scope.message);
    }])
})(this);