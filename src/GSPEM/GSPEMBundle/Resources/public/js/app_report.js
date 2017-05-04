/**
 * Created by gabo on 26/07/16.
 */

GSPEMApp.controller('abmReports', function($scope,$http,$uibModal,toastr,MovPend) {
    $scope.animationsEnabled = false;
    $scope.cargando=true;

    $scope.propertyName = 'id';
    $scope.reverse = true;
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.parseInt = parseInt;
    var getStock = function() {
        $http.get(Routing.generate('get_stock')
        ).then(function (stock) {
            $scope.cargando=false;
            $scope.stock=stock.data;
            ////console.log($scope.stock);
        });
    };
    getStock();




    var getSitios = function() {
        $http.get(Routing.generate('get_sitios')
        ).then(function (sitios) {
            $scope.sitios=sitios.data;
            $scope.sitioselected=$scope.sitios[0];
            getStockFromSite();
        });
    };




    $scope.updateReportSitios=function () {

        getStockFromSite();
    };


    getSitios();



    $scope.updateReportUsers=function () {
        getStockFromUser();
    };



    var getStockFromSite=function () {
        //console.log($scope.sitioselected.id);
        $http({
            url: Routing.generate('get_stock_sitio_custom'),
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
                id:  $scope.sitioselected.id
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).then(function (response) {
                //console.log(response);
                $scope.stock_sit=response.data;
            },
            function (response) { // optional
                // failed
            });
    }

    $scope.confirmar=function () {

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
        }

        if(mm<10) {
            mm='0'+mm
        }

        today = mm+'/'+dd+'/'+yyyy;

        var blob = new Blob([document.getElementById('exportable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Reporte_Maestro_"+today+".xls");
    };




    $scope.exportarStockSitio=function () {

        var blob = new Blob([document.getElementById('exportable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Reporte_"+$scope.sitioselected.name+".xls");
    };
});


GSPEMApp.controller('reportStockAllUsers', function($scope,$http,$uibModal,toastr,MovPend) {
    $scope.cargando=true;
    $scope.usersmultiselect=[];
    $scope.updateReportStockTecnico=function () {
        //console.log($scope.usersselected);
        if($scope.usersselected[0]=="0"){
            getStockFromAllUsers();
        }else {
            $scope.newstock=[];
            for (var a = 0; a < $scope.stockfilter.length; a++) {
                for (var i = 0; i < $scope.usersselected.length; i++) {
                    if( parseInt($scope.stockfilter[a].tecid)== parseInt($scope.usersselected[i])){
                        // esta seleccionado
                        $scope.newstock.push($scope.stockfilter[a]);
                    }
                }

            }
        }

        $scope.stock=$scope.newstock;
        //getStockFromSite();
    };

    var getUsers= function () {
        $http.get(Routing.generate('get_users')
        ).then(function (data) {

            $scope.tecnicos=data.data;
            //console.log($scope.tecnicos);
            $scope.usersmultiselect.push({id:0 ,label:"Todos"});
            for (var a = 0; a < $scope.tecnicos.length; a++) {
                $scope.usersmultiselect.push({id:$scope.tecnicos[a].id,label:$scope.tecnicos[a].name + ' '+ $scope.tecnicos[a].lastName});
            }
            $scope.tecnicotarea=$scope.tecnicos[0];
            //getStockFromUser();
        });
    }
    getUsers();


    var getStockFromAllUsers = function() {
        $http.get(Routing.generate('get_stock_users')
        ).then(function (stock) {
            $scope.stock=stock.data;
            $scope.stockfilter=$scope.stock;
            $scope.cargando=false;
        });
    };
    getStockFromAllUsers();


    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.exportar=function () {

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
        }

        if(mm<10) {
            mm='0'+mm
        }

        today = mm+'/'+dd+'/'+yyyy;
        var blob = new Blob([document.getElementById('exportable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Reporte_Stock_Tecnicos"+today+".xls");
    };

});



GSPEMApp.controller('abmReportsContratista', function($scope,$http,$uibModal,toastr,MovPend) {
    $scope.animationsEnabled = false;
    $scope.cargando=true;
    $scope.propertyName = 'id';
    $scope.reverse = true;

    $scope.usersmultiselect=[];
    $scope.updateReportContratista=function () {

        if($scope.contratistaselected[0]=="0"){
            getStockFromAllContratistas();
        }else {
            $scope.newstock=[];
            for (var a = 0; a < $scope.stockfilter.length; a++) {
                for (var i = 0; i < $scope.contratistaselected.length; i++) {
                    if( parseInt($scope.stockfilter[a].contratistaid)== parseInt($scope.contratistaselected[i])){
                        $scope.newstock.push($scope.stockfilter[a]);
                    }
                }

            }
        }

        $scope.stock=$scope.newstock;
        //getStockFromSite();
    };


    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.exportar=function () {

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
        }

        if(mm<10) {
            mm='0'+mm
        }

        today = mm+'/'+dd+'/'+yyyy;
        var blob = new Blob([document.getElementById('exportable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Reporte_Stock_Contratistas_"+today+".xls");
    };

    var getData = function() {
        $http.get(Routing.generate('get_contratistas')
        ).then(function (contratistas) {

            $scope.contratistas=contratistas.data;
            $scope.contratistaselected=$scope.contratistas[0];
            getStockFromAllContratistas();
        });
    };
    getData();

    var getStockFromAllContratistas = function() {
        $http.get(Routing.generate('get_stock_contratistas')
        ).then(function (stock) {
            $scope.stock=stock.data;
            $scope.stockfilter=$scope.stock;
            $scope.cargando=false;
        });
    };
    getStockFromAllContratistas();


});
GSPEMApp.controller('abmReportsMov', function($filter,$scope,$http,$uibModal,toastr,MovPend) {
    $scope.animationsEnabled = false;
    $scope.contratistaselected;
    $scope.cargando=true;


    $scope.exportar=function () {

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
        }

        if(mm<10) {
            mm='0'+mm
        }

        today = mm+'/'+dd+'/'+yyyy;
        var blob = new Blob([document.getElementById('exportable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Reporte_Movimientos_"+today+".xls");
    };

    $scope.propertyName = 'id';
    $scope.reverse = true;
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };
    $scope.cargando=true;

    var getData = function() {
        $http.get(Routing.generate('get_report_movs')
        ).then(function (movs) {
            $scope.movs=movs.data;
            $scope.cargando=false;
        });
    };
    getData();


    $scope.showItems=function (items) {
        var modalInstance = $uibModal.open({
            templateUrl: "items_mov.html",
            controller: "ModalItemsMov",
            resolve: {
                items: function () {
                    return items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    }

    $scope.showNota=function (nota) {
        var modalInstance = $uibModal.open({
            templateUrl: "nota_mov.html",
            controller: "ModalNotaMov",
            resolve: {
                nota: function () {
                    return nota;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    }


});

GSPEMApp.controller('ModalItemsMov', function($filter,$scope,$http, $uibModalInstance, items,toastr) {
    $scope.stock = items;
    $scope.propertyName = 'name';
    $scope.reverse = true;
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };
    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };

});

GSPEMApp.controller('ModalNotaMov', function($filter,$scope,$http, $uibModalInstance, nota,toastr) {
    $scope.nota = nota;
    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };

});

GSPEMApp.controller('abmReportsAlertas', function($filter,$scope,$http,$uibModal,toastr,MovPend) {


    $scope.propertyName = 'name';
    $scope.reverse = true;
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.animationsEnabled = false;
    $scope.contratistaselected;
    $scope.parseInt = parseInt;
    $scope.showperfiledit = false;
    $scope.cargando = true;
    var getStock = function () {
        $http.get(Routing.generate('get_stock')
        ).then(function (stock) {
            $scope.cargando = false;
            $scope.stock = [];
            $scope.stock_temp = stock.data;
            for (var a = 0; a < $scope.stock_temp.length; a++) {
                if (parseInt($scope.stock_temp[a].stock) < parseInt($scope.stock_temp[a].umbralmin)) {
                    $scope.stock.push($scope.stock_temp[a]);
                }
            }
            ////console.log($scope.stock);
        });
    };
    getStock();


    $scope.exportar=function () {

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
        }

        if(mm<10) {
            mm='0'+mm
        }

        today = mm+'/'+dd+'/'+yyyy;
        var blob = new Blob([document.getElementById('exportable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Reporte_Alertados_"+today+".xls");
    };
});

GSPEMApp.controller('reportsSitios', function($rootScope,$filter,$scope,$http,$uibModal,toastr,MovPend) {
    $scope.cargando=true;

    $scope.propertyName = 'name';
    //$scope.sitioselected={id:0};

    $scope.reverse = true;
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };


    $scope.$watch( "autocompleteSelected", function() {
        if(angular.isObject($rootScope.autocompleteSelected)){
            //$scope.filtrositios=$rootScope.autocompleteSelected.originalObject.emplazamiento;

            $scope.sitioselected=$rootScope.autocompleteSelected.originalObject;
            updateReportSitios();
        }else {
            //$scope.filtrositios=null;
        }
    }, true);


    /*var getMateriales = function() {
        $http.get(Routing.generate('get_materiales')
        ).then(function (materiales) {
            $scope.materiales=materiales.data;
            //$scope.materiales.unshift({id:0,idCustom:"Todos",name:""});
            $scope.materialselected=$scope.materiales[0];
        });
    };

    getMateriales();*/

    var getSitios = function() {
        $http.get(Routing.generate('get_sitios')
        ).then(function (sitios) {

            $scope.sitios=sitios.data;
            $scope.sitioselected=$scope.sitios[0];
            $scope.cargando=false;
            ////console.log("cargo sitios");
            //getStockFromSite();
        });
    };




    var updateReportSitios=function () {
        $scope.stock=$scope.newstock;
        getStockFromSite($scope.sitioselected.id);
    };

    getSitios();



    /*var getStockFromSite = function() {
        $http.get(Routing.generate('get_stock_sitios')
        ).success(function (stock) {
            $scope.stock=stock;
            $scope.stockfilter=$scope.stock;
            $scope.cargando=false;
            //console.log("trajo la data");
        });
    };*/


    var getStockFromSite=function (idSit) {

        //console.log($scope.sitioselected);
        $http({
            url: Routing.generate('get_stock_sitio_custom'),
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
                id:  idSit
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).then(function (response) {
                ////console.log(response);
                //$scope.stock_sit=response.data;
                $scope.stockSit=response.data;
                $scope.stockfilter=$scope.stockSit;
                $scope.cargando=false;
                ////console.log("trajo la data");

            },
            function (response) { // optional
                // failed
            });
    }
    getStockFromSite(0);
    //getStockFromSite();

    $scope.exportar=function () {

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
        }

        if(mm<10) {
            mm='0'+mm
        }

        today = mm+'/'+dd+'/'+yyyy;
        var blob = new Blob([document.getElementById('exportable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Reporte_Sitios_"+today+".xls");
    };

});

/**
 * Controller js Report Compras
 */
GSPEMApp.controller('reportsCompras', function($filter,$scope,$http,$uibModal,toastr,MovPend) {
    $scope.cargando=true;
    $scope.altas;
    $scope.propertyName = 'date';
    $scope.reverse = true;

    $scope.addtime=false;


    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };


    var getMateriales = function() {
        $http.get(Routing.generate('get_materiales')
        ).then(function (materiales) {
            $scope.materiales=materiales.data;
            for (var a = 0; a < $scope.materiales.length; a++) {
                $scope.materiales[a].referencia=angular.fromJson($scope.materiales[a].referencia);
            }
            $scope.materiales.unshift({id:0,idCustom:"Todos",name:""});
            $scope.materialselected=$scope.materiales[0];
        });
    };

    getMateriales();

    $scope.clean= function () {
        $scope.altas=$scope.altas_ori;
        $scope.arraytofilter=[];
        $scope.resultFilter=null;

    }

    $scope.filtrar= function () {
        $scope.resultFilterStartDate=[];
        $scope.resultFilterEndDate=[];
        $scope.resultFilterProv=[];
        $scope.resultFilter=null;
        $scope.resultFilterMat=[];


        $scope.filterByDateStart=false;
        $scope.filterByDateEnd=false;
        $scope.filterByProv=false;
        $scope.filterByMat=false;


        //debugger
        $scope.arraytofilter= $scope.altas_ori;
        //debugger;
        if(angular.isDefined($scope.date_desde)){
            //console.log($scope.date_desde);
            $scope.arrayTofilter=$scope.altas;
            for (var a = 0; a < $scope.arraytofilter.length; a++) {
                var dateAltaStock = new Date($scope.arraytofilter[a].date);

                //console.log(date.getTime());

                if(dateAltaStock.getTime() >= $scope.date_desde.getTime()){
                    $scope.resultFilterStartDate.push($scope.arraytofilter[a]);
                }

            }
            $scope.resultFilter=$scope.resultFilterStartDate;
            $scope.filterByDateStart=true;
        }

        if(angular.isDefined($scope.date_hasta)){
            var _date_hasta=null;

            $scope._arrayTofilter=$scope.altas;
            _date_hasta=$scope.date_hasta;
            if ($scope.addtime==false){
                _date_hasta.addHours(23);// para tomar ese mismo dia
                $scope.addtime=true;
            }


            for (var a = 0; a <  $scope._arrayTofilter.length; a++) {
                var dateAltaStock = new Date( $scope._arrayTofilter[a].date);

                if(dateAltaStock.getTime() <= _date_hasta.getTime()){
                    //console.log("date end filter");
                    $scope.resultFilterEndDate.push($scope._arrayTofilter[a]);
                }
            }
            $scope.resultFilter=$scope.resultFilterEndDate;
            $scope.filterByDateEnd=true;
        }


        if($scope.materialselected!=null){
            console.log($scope.sitiosstock);
            if (angular.isObject($scope.materialselected.originalObject)){

                $scope._arrayTofilter=$scope.altas;
                for (var a = 0; a <  $scope._arrayTofilter.length; a++) {

                    if($scope.materialselected.originalObject.id == $scope._arrayTofilter[a].id){
                        $scope.resultFilterMat.push($scope._arrayTofilter[a]);
                    }
                }
                $scope.resultFilter=$scope.resultFilterMat;
                $scope.filterByMat=true;
            }
        }


        if($scope.contratistaselected.id>0){
                $scope._arrayTofilter=$scope.altas;
                for (var a = 0; a <  $scope._arrayTofilter.length; a++) {

                    if($scope.contratistaselected.id == $scope._arrayTofilter[a].prov_id){
                        $scope.resultFilterProv.push($scope._arrayTofilter[a]);
                    }
                }
                $scope.resultFilter=$scope.resultFilterProv;
                $scope.filterByProv=true;
        }
        if($scope.filterByProv || $scope.filterByDateEnd || $scope.filterByDateStart || $scope.filterByMat )
        {
            $scope.altas=$scope.resultFilter;
        }
    }

    var getContratistas = function() {
        $http.get(Routing.generate('get_contratistas')
        ).then(function (contratistas) {
            $scope.contratistas=contratistas.data;
            $scope.contratistas.unshift({id:0,name:"Todos"});
            $scope.contratistaselected=$scope.contratistas[0];
        });
    };
    getContratistas();





    var getCompras = function() {
        $http.get(Routing.generate('reports_altas')
        ).then(function (rsp) {

            $scope.cargando=false;
            $scope.altas=rsp.data;
            $scope.altas_ori=rsp.data;
        });
    };
    getCompras();



    $scope.exportar=function () {

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
        }

        if(mm<10) {
            mm='0'+mm
        }

        today = mm+'/'+dd+'/'+yyyy;
        var blob = new Blob([document.getElementById('exportable').innerHTML], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "Reporte_Sitios_"+today+".xls");
    };



    Date.prototype.addHours= function(h){
        this.setHours(this.getHours()+h);
        this.setMinutes(59);
        return this;
    }

});

