/**
 * Created with JetBrains PhpStorm.
 * User: julia
 * Date: 07.08.13
 * Time: 14:48
 * To change this template use File | Settings | File Templates.
 */
(function (global) {
    var
    /*глобальные переменные*/
        _win = global,

    /*JS зависимости*/
        _ = _win._,
        gp = _win.geoportalInstance;

    gp.controller('isogd.page.statMO', [ '$scope', '$http', '$user', '$isogdData', '$location', function ($scope, $http, $user, $isogdData, $location) {
        var sortMethod = '', promise;
        $scope.dbinfo = {};
        $scope.searchText = '';
        $scope.dbinfo.numberOfrecord = $isogdData.isogd.length;
        $scope.isogddata = $isogdData.isogd.alldata.slice();
        $scope.user = $user;
        $scope.mo = $isogdData.MO;
        $scope.filesupload = false;
        $scope.filesuploaderror = false;

        $scope.period = "lastdata";

        $scope.money = true;
        $scope.filterIsogd = $isogdData.isogd.lastdata.slice();

        $scope.filter = function () {

            var lastisogd = [],
                searchText = $scope.searchText.toLowerCase(),
                year = new Date().getFullYear().toString();

            $scope.filterIsogd = [];
            $scope.dbinfo.volumemeans = 0;

            if ($scope.period === "lastdata") {
                lastisogd = $isogdData.isogd.lastdata.slice();
            }
            else if ($scope.period === "thisyear") {
                $scope.filterIsogd = [];

                for (var i = 0, max = $isogdData.isogd.alldata.length; i < max; i++) {
                    if ($isogdData.isogd.alldata[i].CreateDate.split('-')[0] === year) {
                        lastisogd.push($isogdData.isogd.alldata[i]);
                    }
                }
            }
            else if ($scope.period === "lastyear") {
                $scope.filterIsogd = [];
                for (i = 0, max = $isogdData.isogd.alldata.length; i < max; i++) {
                    if ($isogdData.isogd.alldata[i].CreateDate.split('-')[0] !== year) {
                        lastisogd.push($isogdData.isogd.alldata[i]);
                    }
                }
            }

            for (i = 0, max = lastisogd.length; i < max; i++) {
                for (var prop in lastisogd[i]) {
                    if (lastisogd[i][prop].toString().toLowerCase().match(searchText)) {
                        $scope.filterIsogd.push(lastisogd[i]);
                        break;
                    }
                }
            }
            for (i = 0, max = $scope.filterIsogd.length; i < max; i++) {
                if ($scope.filterIsogd[i].VolumeMeans !== undefined) {
                    $scope.dbinfo.volumemeans = $scope.dbinfo.volumemeans + parseInt($scope.filterIsogd[i].VolumeMeans);
                }
            }
            $scope.dbinfo.numberOfrecord = $scope.filterIsogd.length;
        };

        $scope.sortdata = function (nameofcolumn) {
            $scope.filterIsogd = _.sortBy($scope.filterIsogd, function (element) {
                if (typeof element[nameofcolumn] === 'string')
                    return element[nameofcolumn].toLowerCase();
                else
                    return element[nameofcolumn]
            });
            if (sortMethod === 'sIncrease') {
                $scope.filterIsogd.reverse();
                sortMethod = 'sDecrease';
            }
            else if (sortMethod === 'sDecrease' || sortMethod === '') {
                sortMethod = 'sIncrease';
            }
        };

//        $scope.filterByDate = function () {
//            var year = new Date().getFullYear().toString();
//            console.log($isogdData.isogd);
//            if ($scope.period === "lastdata") {
//                $scope.filterIsogd = $isogdData.isogd.lastdata.slice();
//            }
//            else if ($scope.period === "thisyear") {
//                $scope.filterIsogd = [];
//
//                for (var i = 0, max = $isogdData.isogd.alldata.length; i < max; i++) {
//                    if ($isogdData.isogd.alldata[i].CreateDate.split('-')[0] === year) {
//                        $scope.filterIsogd.push($isogdData.isogd.alldata[i]);
//                    }
//                }
//            }
//            else if ($scope.period === "lastyear") {
//                $scope.filterIsogd = [];
//                for (i = 0, max = $isogdData.isogd.alldata.length; i < max; i++) {
//                    if ($isogdData.isogd.alldata[i].CreateDate.split('-')[0] !== year) {
//                        $scope.filterIsogd.push($isogdData.isogd.alldata[i]);
//                    }
//                }
//            }
//        };

        $scope.edit = function (record) {
//            $isogdData.isogd.editRecord = record;
//            $location.url("/formISOGD/");
        };

        $scope.setFiles = function (element) {

            $scope.$apply(function ($scope) {
                $scope.filesToUpload = [];
                for (var i = 0; i < element.files.length; i++) {
                    $scope.filesToUpload.push(element.files[i]);
                }
                $scope.upload();
            });
        };

        $scope.upload = function () {
            if ($scope.filesToUpload != undefined) {
                var formData = new FormData();
                for (var i = 0, max = $scope.filesToUpload.length; i < max; i++) {
                    formData.append('file_' + i, $scope.filesToUpload[i]);
                }
                promise = $http({method: 'POST', url: 'js/gc.isogd/isogd.fn.savefile.php', data: formData, headers: {'Content-Type': undefined}, transformRequest: angular.identity});
                promise.success(function () {

                    $scope.filesupload = true;
                    $scope.getFiles();
                });
                promise.error(function (data, status) {
                    if (status === 413) {
                        alert("Файл не был загружен. Допустимый размер файла превышен")
                    }
                });
            }
        };

        $scope.getFiles = function () {
            promise = $http({method: 'GET', url: 'js/gc.isogd/isogd.srv.getfiles.php'});
            promise.success(function (data) {
                $scope.MOfiles = data;
            });
            promise.error(function () {
                console.log("error on get files");
            });
        };
        $scope.getFiles();

        $scope.deleteFile = function (file) {

            promise = $http({method: 'GET', url: 'js/gc.isogd/isogd.fn.deletefile.php', params: {code: file.Code, ID: file.ID}});
            promise.success(function () {
                $scope.getFiles();
            });
            promise.error(function () {
                console.log("error on delete files");
            });
        };

    }])

})(this);