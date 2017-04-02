var GSPEMApp = angular.module('AppGSPEM', ["checklist-model",'ngRoute','ngAnimate','ui.bootstrap','toastr','ngAutocomplete','google.places']);

// Configuración de las rutas



GSPEMApp.service('MovPend', function($http,toastr) {
    var leng=0;
    var getMovPend = function() {
        $http.get(Routing.generate('get_mov_pend')
        ).success(function (data) {
            //console.log("pide movs pend");
            //console.log(data);

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

GSPEMApp.config(function($routeProvider,toastrConfig) {


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
            templateUrl : '../bundles/gspemgspem/pages/abm_contratistas.html',
            controller  : 'abmContratistas'
        })
        .when('/perfiles_abm', {
            templateUrl : '../bundles/gspemgspem/pages/abm_perfiles.html',
            controller  : 'abmPerfiles'
        })
        .when('/materiales_abm', {
            templateUrl : '../bundles/gspemgspem/pages/abm_materiales.html',
            controller  : 'abmMaterial'
        })
        .when('/sitios_abm', {
            templateUrl : '../bundles/gspemgspem/pages/abm_sitios.html',
            controller  : 'abmSitios'
        })
        .when('/usuarios_abm', {
            templateUrl : '../bundles/gspemgspem/pages/abm_usuarios.html',
            controller  : 'abmUsuarios'
        })
        .when('/materiales_reportes', {
            templateUrl : '../bundles/gspemgspem/pages/reportes_materiales.html',
            controller  : 'contactController'
        })
        .when('/materiales_typo_abm', {
            templateUrl : '../bundles/gspemgspem/pages/abm_typo_materiales.html',
            controller  : 'abmMaterial'
        })
        .when('/sitios_typo_abm', {
            templateUrl : '../bundles/gspemgspem/pages/abm_typo_sitios.html',
            controller  : 'abmSitios'
        })
        .when('/tareas_abm', {
            templateUrl : '../bundles/gspemgspem/pages/abm_tareas.html',
            controller  : 'abmTareas'
        })
        .when('/stock_maestro', {
            templateUrl : '../bundles/gspemgspem/pages/stock_maestro.html',
            controller  : 'abmStockMaestro'
        })
        .when('/stock_to_tec', {
            templateUrl : '../bundles/gspemgspem/pages/stock_mov_tecnico.html',
            controller  : 'abmStockMov'
        })
        .when('/stock_tec_to_tec', {
            templateUrl : '../bundles/gspemgspem/pages/stock_mov_tecnico_to_tecnico.html',
            controller  : 'abmStockMovTecnicoToTecnico'
        })
        .when('/mi_stock_to_tec', {
            templateUrl : '../bundles/gspemgspem/pages/stock_mov_tecnico_to_tecnico_from_tec.html',
            controller  : 'abmStockMovTecnicoToTecnicoFromTec'
        })
        .when('/stock_pend', {
            templateUrl : '../bundles/gspemgspem/pages/stock_pend.html',
            controller  : 'abmStockPend'
        })
        .when('/stock_pend_rechazados', {
            templateUrl : '../bundles/gspemgspem/pages/stock_pend_rechazado.html',
            controller  : 'abmStockPendRechazados'
        })
        .when('/stock_tecnico', {
            templateUrl : '../bundles/gspemgspem/pages/stock_user.html',
            controller  : 'abmStockUser'
        })
        .when('/stock_to_sit', {
            templateUrl : '../bundles/gspemgspem/pages/stock_mov_sitio.html',
            controller  : 'abmStockMovSitio'
        })
        .when('/stock_report', {
            templateUrl : '../bundles/gspemgspem/pages/report_maestro.html',
            controller  : 'abmReports'
        })
        .when('/stock_alertas', {
            templateUrl : '../bundles/gspemgspem/pages/report_alertas.html',
            controller  : 'abmReportsAlertas'
        })
        .when('/stock_movimientos', {
            templateUrl : '../bundles/gspemgspem/pages/report_movimiento.html',
            controller  : 'abmReportsMov'
        })

        .when('/stock_report_tec', {
            templateUrl : '../bundles/gspemgspem/pages/report_tecnico.html',
            controller  : 'reportStockAllUsers'
        })
        .when('/stock_report_sit', {
            templateUrl : '../bundles/gspemgspem/pages/report_sitio.html',
            controller  : 'reportsSitios'
        })
        .when('/stock_contratista', {
            templateUrl : '../bundles/gspemgspem/pages/report_contratista.html',
            controller  : 'abmReportsContratista'
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
        ).success(function (stock) {
            $scope.stockMaestro=stock;
            //console.log($scope.stock);

            for (var a = 0; a < $scope.stockMaestro.length; a++) {
                $scope.stockMaestro[a].referencia=angular.fromJson($scope.stockMaestro[a].referencia);
            }
            $scope.cargando=false;

        });
    };




    var getStock = function() {
        $http.get(Routing.generate('get_stock')
        ).success(function (stock) {
            $scope.cargando=false;
            $scope.stock=[];
            $scope.stock_temp=stock;
            for (var a = 0; a < $scope.stock_temp.length; a++) {
                if(parseInt($scope.stock_temp[a].stock) < parseInt($scope.stock_temp[a].umbralmin)){
                    $scope.stock.push($scope.stock_temp[a]);
                }
            }
            for (var a = 0; a < $scope.stock.length; a++) {
                $scope.stock[a].referencia=angular.fromJson($scope.stock[a].referencia);
            }
            //console.log($scope.stock);
        });
    };


    var getMyStock = function() {
        $http.get(Routing.generate('get_stock_user')
        ).success(function (stock) {
            $scope.stock=stock;
            $scope.cargando=false;
            //console.log($scope.stock);
            for (var a = 0; a < $scope.stock.length; a++) {
                $scope.stock[a].referencia=angular.fromJson($scope.stock[a].referencia);
            }
        });
    };


    var getPerfil = function() {
        $http.get(Routing.generate('get_profile')
        ).success(function (user) {
            console.log(user);
            if(user.user.level==1){
                $scope.isadmin=true;
            }
            $scope.access=angular.fromJson(user.profile.access);
            if($scope.access.oper.all){
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

            }else {
                $scope.cargando=false;
            }


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
