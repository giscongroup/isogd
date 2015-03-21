/**
 * Created with JetBrains PhpStorm.
 * User: julia
 * Date: 06.08.13
 * Time: 15:06
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


    gp.controller('dialogController', ['$scope', 'dialog', 'msg', function ($scope, dialog, msg) {
        $scope.document = msg;
        $scope.close = function (result) {
            dialog.close(result);
        };
    }]);

    gp.controller('dBigFleContr', ['$scope', 'dialog', function ($scope, dialog) {
        $scope.close = function () {
            dialog.close();
        };
    }]);

    gp.controller('isogd.page.formISOGD', [ '$scope', '$http', '$user', '$isogdData', '$filter', '$dialog', '$pathParams', function ($scope, $http, $user, $isogdData, $filter, $dialog, $pathParams) {
        var promise,
            dProcess = $dialog.dialog({
                backdrop: true,
                keyboard: true,
                backdropClick: false,
                templateUrl: "js/gc.isogd/templates/isogd.dialog.process.html"
            });


        $scope.edit = true;
        $scope.MO = $isogdData.MO[0];

        $scope.saveSuccess = false;
        $scope.saveError = false;
        $scope.MOfiles = [];

        $scope.activeTab = $pathParams.tabisogd;

        if ($isogdData.isogd.lastdata !== undefined)
            $scope.currentISOGD = $isogdData.isogd.lastdata[0];
        else
            $scope.currentISOGD = {};


        $scope.getClass = function (path) {
            if ($scope.activeTab == path) {
                $scope.activeTab = $pathParams.tabisogd;
                return "active"
            } else {
                return ""
            }
        };

        $scope.currentISOGD.DateDocumentPayment = $filter('date')(new Date($scope.currentISOGD.DateDocumentPayment), 'yyyy-MM-dd');

        $scope.getISOGDdata = function () {
            promise = $http.get('js/gc.isogd/isogd.srv.getisogd.php');
            promise.success(function (data) {
                _.each(data, function (data, prop) {
                    $isogdData.isogd[prop] = data;
                });

                $scope.getstat();
            });
            promise.error(function (data) {
                console.log(data);
            });
        };

        $scope.openDialogProcess = function () {
            dProcess.open();
        };

        $scope.savedata = function () {
            $scope.openDialogProcess();
            $scope.saveSuccess = false;
            $scope.saveError = false;
            $scope.saveProcess = true;
            $scope.currentISOGD.CreateDate = new Date();
            $scope.edit = false;
          
			$scope.currentISOGD.VolumeMeans = $scope.currentISOGD.VolumeMeans.toString().replace(',', '.');
            promise = $http.post('js/gc.isogd/isogd.fn.isogdSaveUpdate.php', $scope.currentISOGD);
            promise.success(function (data) {
                dProcess.close();
                $scope.saveProcess = false;
                $scope.saveSuccess = true;
                $scope.saveError = false;
                $scope.getISOGDdata();
            });
            promise.error(function (data) {
                dProcess.close();
                $scope.saveProcess = false;
                $scope.saveSuccess = false;
                $scope.saveError = true;
            });
        };

        $scope.activetab = true;

        $scope.openDialogDocument = function () {
            var d = $dialog.dialog({
                backdrop: true,
                keyboard: true,
                backdropClick: false,
                templateUrl: "js/gc.isogd/templates/isogd.dialog.documentISOGD.html",
                controller: 'dialogController',
                resolve: {
                    msg: function () {
                        return $scope.currentISOGD;
                    }
                }
            });
            d.open().then(function (result) {
                if (result !== undefined) {
                    for (var prop in result) {
                        $scope.currentISOGD[prop] = result[prop];
                    }

                    $scope.upload();
                }
                else {

                }
            });
        };

        $scope.setFiles = function (element) {

            $scope.$apply(function ($scope) {
                $scope.filesToUpload = [];
                for (var i = 0; i < element.files.length; i++) {
                    $scope.filesToUpload.push(element.files[i]);
                }
                $scope.openDialogDocument();
            });
        };

        $scope.upload = function () {

            $scope.openDialogProcess();
            if ($scope.filesToUpload != undefined) {
                var formData = new FormData();

                for (var i = 0, max = $scope.filesToUpload.length; i < max; i++) {
                    formData.append('file_' + i, $scope.filesToUpload[i]);
                }

                promise = $http({method: 'POST', url: 'js/gc.isogd/isogd.fn.savefile.php?filename=' + $scope.currentISOGD.NameDocumentPayment, data: formData, headers: {'Content-Type': undefined}, transformRequest: angular.identity});
                promise.success(function (data) {

                    if (typeof data !== 'string') {
                        $scope.currentISOGD.ExistenceDocumentPayment = '';
                        for (var i = 0; i < data.length; i++) {
                            $scope.currentISOGD.ExistenceDocumentPayment = $scope.currentISOGD.ExistenceDocumentPayment + data[i];
                            if (i !== data.length - 1)
                                $scope.currentISOGD.ExistenceDocumentPayment = $scope.currentISOGD.ExistenceDocumentPayment + '; ';
                        }
                    }
                    $scope.filesupload = true;
                    dProcess.close();

                    promise = $http({method: 'GET', url: 'js/gc.isogd/isogd.srv.getfiles.php', params: { fileID: $scope.currentISOGD.ExistenceDocumentPayment}});
                    promise.success(function (data) {
                        $scope.MO.files = data;
                    });
                    promise.error(function () {
                        console.log("error on get files");
                    });
                    $scope.savedata();

                });
                promise.error(function (data, status) {
                    if (status === 413) {
                        dProcess.close();
                        var dBigFle = $dialog.dialog({
                            backdrop: true,
                            keyboard: true,
                            backdropClick: false,
                            templateUrl: "js/gc.isogd/templates/isogd.dialog.bigfile.html",
                            controller: 'dBigFleContr'
                        });
//                        dBigFle.open();
                        $scope.saveProcess = false;
                        $scope.saveSuccess = false;
                        $scope.saveError = true;
                        alert("Файл не был загружен. Допустимый размер файла превышен")
                    }
                });
            }
            else {
                dProcess.close();
            }
        };

        $scope.getFiles = function () {
            if ($scope.MO.files === undefined) {
                promise = $http({method: 'GET', url: 'js/gc.isogd/isogd.srv.getfiles.php', params: { fileID: $scope.currentISOGD.ExistenceDocumentPayment}});
                promise.success(function (data) {
                    $scope.MO.files = data;
                });
                promise.error(function () {
                    console.log("error on get files");
                });
            }
        };
		
	
        $scope.getFiles();

//        $scope.deleteFile = function (file) {
//
//            promise = $http({method: 'GET', url: 'js/gc.isogd/isogd.fn.deletefile.php', params: {code: file.Code, ID: file.ID}});
//            promise.success(function () {
//                $scope.getFiles();
//            });
//            promise.error(function () {
//                console.log("error on delete files");
//            });
//        };

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
            });
            promise.error(function (data) {
                console.log(data);
            });
        };

        $scope.showMessage = function (tab) {
            if (tab === 'data' || tab === 'allInf') {
                if ($scope.currentISOGD.QuantityFactsGrantingData1 === '' || $scope.currentISOGD.QuantityFactsGrantingData1 === undefined ||
                    $scope.currentISOGD.QuantityFactsGrantingData2 === '' || $scope.currentISOGD.QuantityFactsGrantingData2 === undefined ||
                    $scope.currentISOGD.QuantityFactsGrantingData3 === '' || $scope.currentISOGD.QuantityFactsGrantingData3 === undefined ||
                    $scope.currentISOGD.QuantityFactsGrantingData4 === '' || $scope.currentISOGD.QuantityFactsGrantingData4 === undefined ||
                    $scope.currentISOGD.VolumeMeans === '' || $scope.currentISOGD.VolumeMeans === undefined ||
                    $scope.currentISOGD.unpaidRequests === '' || $scope.currentISOGD.unpaidRequests === undefined ||
                    $scope.currentISOGD.denials === '' || $scope.currentISOGD.denials === undefined) {

                    if (tab === 'data')
                        return true;
                    else
                        return false;
                }
            }
            if (tab === 'maininfo' || tab === 'allInf') {

                if ($scope.currentISOGD.NameOfStructural === '' || $scope.currentISOGD.NameOfStructural === undefined ||
                    $scope.currentISOGD.NumberOfEmployees === '' || $scope.currentISOGD.NumberOfEmployees === undefined ||
                    $scope.currentISOGD.NumberOfEmployees2 === '' || $scope.currentISOGD.NumberOfEmployees2 === undefined ||
                    $scope.currentISOGD.FinancingCurrentYear === '' || $scope.currentISOGD.FinancingCurrentYear === undefined ||
                    $scope.currentISOGD.ActualFinancingCurrentYear === '' || $scope.currentISOGD.ActualFinancingCurrentYear === undefined) {
                    return true;
                }
            }
            if (tab === 'document' || tab === 'allInf') {

                if ($scope.currentISOGD.NameDocumentPayment === '' || $scope.currentISOGD.NameDocumentPayment === undefined ||
                    $scope.currentISOGD.NumberDocumentPayment === '' || $scope.currentISOGD.NumberDocumentPayment === undefined ||
                    $scope.currentISOGD.DateDocumentPayment === '' || $scope.currentISOGD.DateDocumentPayment === undefined ||
                    $scope.currentISOGD.SizePayment1 === '' || $scope.currentISOGD.SizePayment1 === undefined ||
                    $scope.currentISOGD.SizePayment2 === '' || $scope.currentISOGD.SizePayment2 === undefined ||
                    $scope.currentISOGD.SizePayment3 === '' || $scope.currentISOGD.SizePayment3 === undefined ||
                    $scope.currentISOGD.SizePayment4 === '' || $scope.currentISOGD.SizePayment4 === undefined) {
                    return true;
                }

                if ($scope.MO.files != undefined) {
                    if ($scope.MO.files.length == 0) {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }

            if (tab === 'option' || tab === 'allInf') {
                if ($scope.currentISOGD.NameSoftwareProduct === '' || $scope.currentISOGD.NameSoftwareProduct === undefined ||
                    $scope.currentISOGD.Executor === '' || $scope.currentISOGD.Executor === undefined ||
                    $scope.currentISOGD.Telefone1 === '' || $scope.currentISOGD.Telefone1 === undefined ||
                    $scope.currentISOGD.Telefone2 === '' || $scope.currentISOGD.Telefone2 === undefined ||
                    $scope.currentISOGD.email === '' || $scope.currentISOGD.email === undefined) {
                    return true;
                }
            }
            return false;
        };

    }]);

})(this);
