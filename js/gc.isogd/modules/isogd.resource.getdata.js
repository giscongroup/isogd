/**
 * User: Julia Suhinina
 * Date: 14.08.13
 * Time: 10:36
 * Description:
 */
(function (global) {
    var
        _win = global,
        _wml = _win.wml,
        gp = _win.geoportalInstance,
        url='js/gc.isogd/';


    gp.factory('$httpRequest', [ '$http', function ($http) {
        var
            res = {},
            startPromise = function (params, success, callback) {
                var promise = $http(params);
                promise.success(function (data, status) {
                    if (typeof success === 'function')
                        success(data, status);
                    if (typeof callback === 'function')
                        callback(undefined, data, status);
                });
                promise.error(function (data, status) {
                    if (typeof callback === 'function')
                        callback(status);
                });
            };
        res.getFiles = function (callback) {
            startPromise({
                method: 'GET',
                url: url + 'isogd.srv.getfiles.php'
            }, callback);
        }
    }]);


})(this);