/**
 * Created with JetBrains PhpStorm.
 * User: julia
 * Date: 06.08.13
 * Time: 15:02
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

    gp.controller('isogd.page.maininfo', [ '$scope', '$http', '$user', '$isogdData', function ($scope, $http, $user, $isogdData) {
        $scope.currentMO = $isogdData.MO[0];
        $scope.saveSuccess = false;
        $scope.saveError = false;

        if ($scope.currentMO.Telefone !== undefined) {
            $scope.currentMO.Telefone = $scope.currentMO.Telefone.replace(/[^\d]/gi, '');
            if ($scope.currentMO.Telefone.length === 10)
                $scope.currentMO.Telefone = '8' + $scope.currentMO.Telefone;
        }

        $scope.tipArray = ['Городской округ', 'Муниципальный район'];

        $scope.savedata = function () {
            var promise = $http.post('js/gc.isogd/isogd.fn.moSaveUpdate.php', $scope.currentMO);


            promise.success(function (data) {
                $scope.saveSuccess = true;
            });
            promise.error(function (data) {
                $scope.saveError = true;
            });
        };
    }])


})(this);
