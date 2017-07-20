var GSPEMApp = angular.module('AppGSPEM', ["720kb.datepicker","angucomplete","ngMaterial","checklist-model",'ngRoute','ngAnimate','ui.bootstrap','toastr','ngAutocomplete','google.places']);

// Configuración de las rutas


/**
 * Date Utils
 */
GSPEMApp.service("dateUtils",function(){
    return {
        parseDate: function(stringDate) {
            var year=stringDate.substring(6,10);
            var month=stringDate.substring(3,5);
            var day=stringDate.substring(0,2);
            var date = new Date(year,month-1,day,00,00,00);
            return date;
        },
        parseDate2: function(stringDate) {
            //2017-05-20 03:00:00
            var year=stringDate.substring(0,4);
            var month=stringDate.substring(5,7);
            var day=stringDate.substring(8,10);
            var hr=stringDate.substring(11,13);
            var min=stringDate.substring(14,16);
            var date = new Date(year,month-1,day,hr,min,00);
            return date;
        },
        addHours: function (hs) {
            Date.prototype.addHours= function(hs){
            this.setHours(this.getHours()+hs);
            this.setMinutes(59);
            return this;
        }
    }


    };

})


GSPEMApp.directive('jqdatepicker', function () {
    return {
        require: '?ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {

            var model = attrs['ngModel'];

            // update the scope if model is defined
            console.log(model);
            element.datepicker({
                dateFormat: 'dd/mm/yy',
                onSelect: function (date) {
                    if (model) {
                        debugger
                        scope[model] = date;
                    }
                },
            });
        }
    };
});


GSPEMApp.service('MovPend', function($http,toastr) {
    var leng=0;
    var getMovPend = function() {
        $http.get(Routing.generate('get_mov_pend')
        ).then(function (data) {
            ////console.log("pide movs pend");
            ////console.log(data);

            if(data.length>0){
                if(data.length >leng){
                    toastr.warning('Tiene movimientos de stock pendientes', 'Atención');
                }
            }
            leng=data.length;

        });
    };

    setInterval(function(){
        getMovPend();
    },5000);
    getMovPend();

});

GSPEMApp.config(function($routeProvider,$mdDateLocaleProvider,toastrConfig,$locationProvider) {

    // Example of a Spanish localization.
    $mdDateLocaleProvider.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    $mdDateLocaleProvider.shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    $mdDateLocaleProvider.days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
    $mdDateLocaleProvider.shortDays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];
    // Can change week display to start on Monday.
    $mdDateLocaleProvider.firstDayOfWeek = 1;
    // Optional.
    //$mdDateLocaleProvider.dates = [1, 2, 3, 4, 5, 6, 7,8,9,10,11,12,13,14,15,16,17,18,19,
    //                               20,21,22,23,24,25,26,27,28,29,30,31];
    // In addition to date display, date components also need localized messages
    // for aria-labels for screen-reader users.
    $mdDateLocaleProvider.weekNumberFormatter = function(weekNumber) {
        return 'Semana ' + weekNumber;
    };
    $mdDateLocaleProvider.msgCalendar = 'Calendario';
    $mdDateLocaleProvider.msgOpenCalendar = 'Abrir calendario';
    $mdDateLocaleProvider.formatDate = function(date) {
        return moment(date).format('DD/MM/YYYY');
    };



    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/', {
            templateUrl : '../bundles/gspemgspem/pages/home.html',
            controller  : 'mainController'
        })
        .when('/perfil', {
            templateUrl : '../bundles/gspemgspem/pages/perfil.html',
            controller  : 'abmPerfil'
        })
        .when('/contratistas_abm', {
            templateUrl : '../bundles/gspemgspem/pages/abms/abm_contratistas.html',
            controller  : 'abmContratistas'
        })
        .when('/perfiles_abm', {
            templateUrl : '../bundles/gspemgspem/pages/abms/abm_perfiles.html',
            controller  : 'abmPerfiles'
        })
        .when('/materiales_abm', {
            templateUrl : '../bundles/gspemgspem/pages/abms/abm_materiales.html',
            controller  : 'abmMaterial'
        })
        .when('/sitios_abm', {
            templateUrl : '../bundles/gspemgspem/pages/abms/abm_sitios.html',
            controller  : 'abmSitios'
        })
        .when('/usuarios_abm', {
            templateUrl : '../bundles/gspemgspem/pages/abms/abm_usuarios.html',
            controller  : 'abmUsuarios'
        })
        .when('/materiales_reportes', {
            templateUrl : '../bundles/gspemgspem/pages/abms/reportes_materiales.html',
            controller  : 'contactController'
        })
        .when('/materiales_typo_abm', {
            templateUrl : '../bundles/gspemgspem/pages/abms/abm_typo_materiales.html',
            controller  : 'abmMaterial'
        })
        .when('/sitios_typo_abm', {
            templateUrl : '../bundles/gspemgspem/pages/abms/abm_typo_sitios.html',
            controller  : 'abmSitios'
        })
        .when('/tareas_abm', {
            templateUrl : '../bundles/gspemgspem/pages/abms/abm_tareas.html',
            controller  : 'abmTareas'
        })
        .when('/stock_maestro', {
            templateUrl : '../bundles/gspemgspem/pages/stock/stock_maestro.html',
            controller  : 'abmStockMaestro'
        })
        .when('/stock_to_tec', {
            templateUrl : '../bundles/gspemgspem/pages/stock/stock_mov_tecnico.html',
            controller  : 'abmStockMov'
        })
        .when('/stock_tec_to_tec', {
            templateUrl : '../bundles/gspemgspem/pages/stock/stock_mov_tecnico_to_tecnico.html',
            controller  : 'abmStockMovTecnicoToTecnico'
        })
        .when('/mi_stock_to_tec', {
            templateUrl : '../bundles/gspemgspem/pages/stock/stock_mov_tecnico_to_tecnico_from_tec.html',
            controller  : 'abmStockMovTecnicoToTecnicoFromTec'
        })
        .when('/stock_pend', {
            templateUrl : '../bundles/gspemgspem/pages/stock/stock_pend.html',
            controller  : 'abmStockPend'
        })
        .when('/stock_pend_rechazados', {
            templateUrl : '../bundles/gspemgspem/pages/stock/stock_pend_rechazado.html',
            controller  : 'abmStockPendRechazados'
        })
        .when('/stock_tecnico', {
            templateUrl : '../bundles/gspemgspem/pages/stock/stock_user.html',
            controller  : 'abmStockUser'
        })
        .when('/stock_to_sit', {
            templateUrl : '../bundles/gspemgspem/pages/stock/stock_mov_sitio.html',
            controller  : 'abmStockMovSitio'
        })
        .when('/stock_report', {
            templateUrl : '../bundles/gspemgspem/pages/reports/report_maestro.html',
            controller  : 'abmReports'
        })
        .when('/stock_alertas', {
            templateUrl : '../bundles/gspemgspem/pages/reports/report_alertas.html',
            controller  : 'abmReportsAlertas'
        })
        .when('/stock_movimientos', {
            templateUrl : '../bundles/gspemgspem/pages/reports/report_movimiento.html',
            controller  : 'abmReportsMov'
        })

        .when('/stock_movimientos_by_mat', {
            templateUrl : '../bundles/gspemgspem/pages/reports/report_movimiento_by_mat.html',
            controller  : 'abmReportsMovByMat'
        })

        .when('/stock_report_tec', {
            templateUrl : '../bundles/gspemgspem/pages/reports/report_tecnico.html',
            controller  : 'reportStockAllUsers'
        })
        .when('/stock_report_sit', {
            templateUrl : '../bundles/gspemgspem/pages/reports/report_sitio.html',
            controller  : 'reportsSitios'
        })
        .when('/stock_contratista', {
            templateUrl : '../bundles/gspemgspem/pages/reports/report_contratista.html',
            controller  : 'abmReportsContratista'
        })
        .when('/historial_compras', {
            templateUrl : '../bundles/gspemgspem/pages/reports/report_compras.html',
            controller  : 'reportsCompras'
        })
        .when('/tareas_tecnico', {
            templateUrl : '../bundles/gspemgspem/pages/tareas_tecnico.html',
            controller  : 'abmTareasTecnico'
        })
        
        .otherwise({
            redirectTo: '/'
        });

        angular.extend(toastrConfig, {
            autoDismiss: false,
            containerId: 'toast-container',
            maxOpened: 0,
            timeOut: 3000,
            newestOnTop: true,
            positionClass: 'toast-top-center',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            target: 'body'
        });

});

GSPEMApp.controller('mainController', function($scope,MovPend,$http) {

    $scope.parseInt = parseInt;
    $scope.showperfiledit=false;
    $scope.cargando=true;
    $scope.title_my_stock="Mi Stock";
    $scope.isadmin=false;

    var getStockMaestro = function() {
        $http.get(Routing.generate('get_stock')
        ).then(function (resp) {
            $scope.stockMaestro=resp.data;

            for (var a = 0; a < $scope.stockMaestro.length; a++) {
                $scope.stockMaestro[a].referencia=angular.fromJson($scope.stockMaestro[a].referencia);
            }
            $scope.cargando=false;

        });
    };




    var getStock = function() {
        $http.get(Routing.generate('get_stock')
        ).then(function (resp) {

            $scope.cargando=false;
            $scope.stock=[];
            $scope.stock_temp=resp.data;
            for (var a = 0; a < $scope.stock_temp.length; a++) {
                if(parseInt($scope.stock_temp[a].stock) < parseInt($scope.stock_temp[a].umbralmin)){
                    $scope.stock.push($scope.stock_temp[a]);
                }
            }
            for (var a = 0; a < $scope.stock.length; a++) {
                $scope.stock[a].referencia=angular.fromJson($scope.stock[a].referencia);
            }
            console.log($scope.stock);
        });
    };


    var getMyStock = function() {
        $http.get(Routing.generate('get_stock_user')
        ).then(function (stock) {
            $scope.stock=stock.data;
            $scope.cargando=false;
            for (var a = 0; a < $scope.stock.length; a++) {
                $scope.stock[a].referencia=angular.fromJson($scope.stock[a].referencia);
            }
        });
    };


    var getPerfil = function() {
        $http.get(Routing.generate('get_profile')
        ).then(function (resp) {

            if(resp.data.user.level==1){
                $scope.isadmin=true;
            }
            $scope.access=angular.fromJson(resp.data.profile.access);
            //if($scope.access.oper.all){
                // valido que tenga acceso al stock maestro para ver las alertas
                if($scope.isadmin){
                    getStock();
                    getStockMaestro();
                    $scope.title_my_stock="Stock Maestro";
                }else {
                    getMyStock();
                    $scope.title_my_stock="Mi Stock";
                }
                $scope.showperfiledit=true;

            //}else {
            //    $scope.cargando=false;
            //}


        });
    };
    getPerfil();


});

GSPEMApp.controller('aboutController', function($scope) {
    $scope.message = 'Esta es la página "Acerca de"';
});

GSPEMApp.controller('contactController', function($scope) {
    $scope.message = 'Esta es la página de "Contacto", aquí podemos poner un formulario';
});
