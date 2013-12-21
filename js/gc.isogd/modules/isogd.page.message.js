/**
 * User: Julia Suhinina
 * Date: 08.10.13
 * Time: 13:54
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

    gp.controller('isogd.page.message', [ '$scope', '$user', '$filter', '$dialog', '$isogdData', '$http', function ($scope, $user, $filter, $dialog, $isogdData, $http) {
        $scope.user = $user;


        $scope.getClass = function (msg) {
            if (msg.isread == 0 && msg.mailto == $scope.user.session_id)
                return 'new';
            else
                return '';
        };

        $scope.answer = function (id) {
            var msg = {};
            msg.mailto = id;
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

        $scope.openMsg = function (msg) {

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
                console.log(result);

            });


        };
    }])


})(this);