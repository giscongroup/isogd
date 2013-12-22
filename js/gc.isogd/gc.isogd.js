/**
 * Created with JetBrains PhpStorm.
 * User: julia
 * Date: 02.08.13
 * Time: 15:04
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
    /*isogd*/
        gp,
        baseMods = [],
        $user = {
            nameMO: undefined,
            session_id: undefined,
            manager: undefined,
            messages: []
        },
        $isogdData = {
            isogd: {
                lastdata: [],
                alldata: [],
                isogdWeek: [],
                isogdLog: [],
                MOgeom: {
                    geom: undefined,
                    maxX: undefined,
                    maxY: undefined
                }
            },
            MO: [],
            stat: {},
            reportParam: {}
        },
    /*return path*/
        $pathToReturn = {
            returnTo: '/'
        },
        $pathParams = {
            tabisogd: 'data',
            tabtable: 'maininfo',
            tabmain: 'dontReport',
            tabmap: 'color',
            idmo: 1,
            week: undefined,
            weekAdm: undefined,
            year: new Date().getFullYear()
        };


//    baseMods.push('wml.touch');
//    baseMods.push('eventModule');
//    baseMods.push('wml.chain');
    baseMods.push('ui.bootstrap');
    baseMods.push('ngRoute');
    baseMods.push('ngAnimate');

    gp = _ng.module('wml.isogd', baseMods);

    /*adding dependency injections*/
    gp.value('$user', $user);
    gp.value('$pathToReturn', $pathToReturn);
    gp.value('$isogdData', $isogdData);
    gp.value('$pathParams', $pathParams);

    _win.geoportalInstance = gp;


    gp.config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/', {
//            templateUrl: 'js/gc.isogd/templates/isogd.page.table.html',
//            controller: 'isogd.page.statistics',
            title: 'Главная'
        });

        $routeProvider.when('/mo/stat/', {
//            templateUrl: 'js/gc.isogd/templates/isogd.page.MOstat.html',
//            controller: 'isogd.page.statMO',
            title: 'Статистика'
        });
        $routeProvider.when('/mo/main/', {
            templateUrl: 'js/gc.isogd/templates/isogd.page.MOmain.html',
            controller: 'isogd.page.mainMO',
            title: 'Главная страница',
            reloadOnSearch: false
        });
        $routeProvider.when('/main/', {
            templateUrl: 'js/gc.isogd/templates/isogd.page.adminMain.html',
            controller: 'isogd.page.AdminMain',
            title: 'Главная страница',
            reloadOnSearch: false
        });
        $routeProvider.when('/table/', {
            templateUrl: 'js/gc.isogd/templates/isogd.page.table.html',
            controller: 'isogd.page.table',
            title: 'Статистика',
            reloadOnSearch: false
        });
        $routeProvider.when('/login/', {
            templateUrl: 'js/gc.isogd/templates/isogd.page.login.html',
            controller: 'isogd.page.login',
            title: 'Авторизация'
        });
        $routeProvider.when('/publicmap/', {
            templateUrl: 'js/gc.isogd/templates/isogd.page.publicmap.html',
            controller: 'isogd.page.publicmap',
            title: 'Карта',
            reloadOnSearch: false
        });
        $routeProvider.when('/mo/form/maininfo/', {
            templateUrl: 'js/gc.isogd/templates/isogd.page.formMainInfo.html',
            controller: 'isogd.page.maininfo',
            title: 'Общая информация'
        });
        $routeProvider.when('/mo/form/isogd/', {
            templateUrl: 'js/gc.isogd/templates/isogd.page.formISOGD.html',
            controller: 'isogd.page.formISOGD',
            title: 'Форма ИСОГД',
            reloadOnSearch: false
        });
        $routeProvider.when('/mo/standards/', {
            templateUrl: 'js/gc.isogd/templates/isogd.page.standards.html',
            controller: 'isogd.page.standards',
            title: 'Нормативы'
        });
        $routeProvider.when('/graph/all/', {
            templateUrl: 'js/gc.isogd/templates/isogd.page.graphVolumeMeans.html',
            controller: 'isogd.page.volumeMeans',
            title: 'Объем услуг ИСОГД по всем МО'
        });
        $routeProvider.when('/graph/mo/', {
            templateUrl: 'js/gc.isogd/templates/isogd.page.graphsByMO.html',
            controller: 'isogd.page.graphsByMO',
            title: 'Объем услуг ИСОГД по отдельным МО',
            reloadOnSearch: false
        });
        $routeProvider.when('/dynamic/', {
            templateUrl: 'js/gc.isogd/templates/isogd.page.dynamicParam.html',
            controller: 'isogd.page.dynamicParam',
            title: 'Динамические показатели'
        });
        $routeProvider.when('/reports/', {
            templateUrl: 'js/gc.isogd/templates/isogd.page.reports.html',
            controller: 'isogd.page.reports',
            title: 'Редактор отчетов'
        });
        $routeProvider.when('/check/', {
            templateUrl: 'js/gc.isogd/templates/isogd.page.datacheck.html',
            controller: 'isogd.page.datacheck',
            title: 'Редактор отчетов',
            reloadOnSearch: false
        });
        $routeProvider.when('/messages/', {
            templateUrl: 'js/gc.isogd/templates/isogd.page.message.html',
            controller: 'isogd.page.message',
            title: 'Сообщения'
        });
        $routeProvider.otherwise({
            redirectTo: '/'
        });

    }]);


    gp.directive('dropdownToggle', ['$document', '$location', function ($document, $location) {

        return {
            restrict: 'CA',
            link: function (scope, element, attrs) {

                element.bind('click', function (event) {

                    event.preventDefault();
                    event.stopPropagation();

                    if (element.parent().hasClass("open")) {
                        element.parent().removeClass('open');
                    }
                    else {
                        element.parent().addClass('open');
                    }

                });
            }
        };
    }]);

//    gp.directive('dropdownMes', ['$document', '$location', function ($document, $location) {
//
//        return {
//            restrict: 'CA',
//            link: function (scope, element, attrs) {
//
//                element.bind('mousedown', function (event) {
//
//                    event.preventDefault();
//                    event.stopPropagation();
//
//                    if (element.parent().hasClass("open")) {
//                        scope.classOpen = '';
//                    }
//                    else {
//                        scope.classOpen = 'open';
//                    }
//
//                });
//            }
//        };
//    }]);

    gp.directive('dropdownSwitch', ['$document', '$location', '$pathParams', function ($document, $location, $pathParams) {

        return {
            restrict: 'CA',
            link: function (scope, element, attrs) {

                if (attrs.ngHref !== undefined) {
                    if (attrs.ngHref.split('=')[1].split(' ')[1] == $pathParams.week.split(' ')[1]) {
                        if (element.parent().attr("class").indexOf('active') <= 0) {
                            element.parent().addClass('active');
                            scope.lastEl = element;
                        }
                    }
                }

                element.bind('click', function (event) {
//                    event.preventDefault();
//                    event.stopPropagation();
                    _.each(element.parent().parent().children(), function (elem) {
                        var el = angular.element(elem);
                        if (el.hasClass('active') && el !== element.parent()) {
                            el.removeClass('active');
                        }
                    });

                    element.parent().addClass('active');

                    if (scope.lastEl !== undefined && scope.lastEl !== element) {
                        if (scope.lastEl.parent().hasClass('active'))
                            scope.lastEl.parent().removeClass('active');
                    }

                    scope.lastEl = element;

                });


            }
        };
    }]);


    gp.controller('isogd.page.main', [ '$rootScope', '$user', '$location', '$isogdData', '$dialog', function ($rootScope, $user, $location, $isogdData, $dialog) {

        $rootScope.monthArray = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        $rootScope.location = $location;

        $rootScope.botclass = 'bot';

        //saving path params
        $rootScope.$watch('location.$$search', function (next) {

            _.each(next, function (value, key) {
                if (typeof value === 'string' && value === '')
                    value = undefined;
                $pathParams[key] = value;
            });
        });

        $rootScope.getClass = function (path) {
            var newClass = '',
                location = $location.path();

            for (var i = 0; i < path.length; i++) {
                if (location.substr(0, path[i].length) == path[i]) {
                    newClass = "active";
                    break;
                }
            }

            return newClass;

        };

        $rootScope.isRead = function (msg) {

            if (msg.isread == 0 && msg.mailto == $user.session_id)
                return 'new';
            else
                return '';
        };

        $rootScope.classOpen = '';

        $rootScope.openMesBox = function () {

            if ($rootScope.classOpen == 'open') {
                $rootScope.classOpen = '';
            }
            else {
                $rootScope.classOpen = 'open';
            }

        };

        $rootScope.openMsg = function (evt, msg) {

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

        $rootScope.MO = $isogdData.MO[0];
        $rootScope.user = $user;
        $rootScope.stat = $isogdData.stat;
        $rootScope.isogd = $isogdData.isogd;


        $rootScope.$on('$routeChangeStart', function (event, next, current) {
            if ($user.session_id === undefined) {

                event.defaultPrevented = true;
                if ($location.url() !== '/login/') {
                    $pathToReturn.returnTo = $location.url();
                    $location.url('/login/');
                }
            }
            else {

                var path = $location.url();
                $rootScope.botclass = '';
                if (path === '/graph/mo/')
                    $rootScope.botclass = 'bot';

                if (path === '/') {
                    if ($user.manager == 0) {
                        $location.path('/mo/main/');
                    }
                    else {
                        $location.path('/main/');
                    }
                }
            }
        });

        $rootScope.sessionClose = function () {
            $rootScope.botclass = 'bot';
            $user.session_id = undefined;
            $user.nameMO = undefined;
            $user.manager = undefined;
            $location.path('/login/');
        };


    }])


})
    (this);