/**
 * Created by gabo on 26/07/16.
 */

GSPEMApp.controller('abmStockMaestro', function($scope,$http,$uibModal,toastr,MovPend) {
    $scope.animationsEnabled = false;

    $scope.cargando=true;
    $scope.enviando=false;
    $scope.propertyName = 'id';
    $scope.reverse = true;
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };



    var getStock = function() {
        $http.get(Routing.generate('get_stock')
        ).then(function (stock) {
            $scope.stock=stock.data;
            ////console.log($scope.stock);

            for (var a = 0; a < $scope.stock.length; a++) {
                $scope.stock[a].referencia=angular.fromJson($scope.stock[a].referencia);
            }
            $scope.cargando=false;

        });
    };

    getStock();

    $scope.altaStock=function (item) {
        var modalInstance = $uibModal.open({
            templateUrl: "moda_alta_stock.html",
            controller: "ModalAltaStock",
            size:"lg",
            resolve: {
                item: function () {
                    return item;
                }
            }
        });

        modalInstance.result.then(function (newStock) {

            //asigo el nuevo stock al item y agrego los dato de alta.
            for (var a = 0; a < $scope.stock.length; a++) {
                if ($scope.stock[a].id==newStock.id){
                    if(!angular.isDefined($scope.stock[a].stock_ori)){
                        $scope.stock[a].stock_ori=$scope.stock[a].stock;
                    }

                    $scope.stock[a].stock=parseInt($scope.stock[a].stock) + parseInt(newStock.new_stock);
                    $scope.stock[a].new_stock=newStock.new_stock;
                    $scope.stock[a].altaData=newStock;
                }
            }

        }, function (result) {
            //debugger;
            //$scope.cargando=true;
            //$log.info('Modal dismissed at: ' + new Date());
        });

    }

    $scope.parseInt = parseInt;

    $scope.resetStock=function (item) {
        //asigo el nuevo stock al item y agrego los dato de alta.
        item.stock=item.stock_ori;
        item.new_stock=0;
        item.altaData="";
    };


    $scope.confirmar=function () {
        $scope.enviando=true;
        $scope.stockToSend= new Array();

        for (var a = 0; a < $scope.stock.length; a++) {
            if (angular.isDefined($scope.stock[a].new_stock)){
                $scope.stockToSend.push($scope.stock[a]);
            }
        }
        ////console.log($scope.stockToSend);

        $http({
            url: Routing.generate('set_stock'),
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            data: {
                items:$scope.stockToSend
            }
        }).then(function (response) {
                ////console.log(response);
                $scope.enviando=false;
                getStock();
                toastr.success('Guardado con éxito', 'Stock');
            },
            function (response) { // optional
                // failed
            });
    }

});

GSPEMApp.controller('ModalAltaStock', function($filter,dateUtils,$uibModal,$scope,$http, $uibModalInstance, item,toastr) {
    $scope.item = item;
    $scope.stock=0;
    $scope.date=$filter('date')(new Date(), "dd-MM-yyyy");
    $scope.historial=false;
    $scope.obs="";

    $scope.save=function (alta) {
        $scope.altaToPost= alta;
        $scope.altaToPost.new_prov_id=alta.provselected.id;
        // edit alta
        //debugger;x
        $http({
            url: Routing.generate('save_alta'),
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            data:{
                id:$scope.altaToPost.id,
                obs:$scope.altaToPost.obs,
                date:dateUtils.parseDate($scope.altaToPost.date_obj),
                new_prov_id:$scope.altaToPost.new_prov_id,
            }
        }).then(function (response) {
                toastr.success('Editada correctamente', 'Alta de Stock');
            },
            function (response) { // optional
                // failed
            });
    }

    $scope.showHistorial= function (val) {
        $scope.historial=val;
    }
    var getContratistas = function() {
        $http.get(Routing.generate('get_contratistas')
        ).then(function (contratistas) {
            $scope.contratistas=contratistas.data;
            if(item!=null){
                $scope.contratistaselected=$filter('filter')($scope.contratistas,{"id":item.contratistaid})[0];
            }else {
                $scope.contratistaselected=$scope.contratistas[0];
            }
            getAltas();
        });
    };
    getContratistas();

    var getAltas = function() {
        $http.get(Routing.generate('get_alta_by_mat')+"/"+item.id
        ).then(function (reps) {
            $scope.altas=reps.data;
            //debugger;
            console.log($scope.altas);
            // parse date
            // contrasita selected
            for (var a = 0; a < $scope.altas.length; a++) {
                $scope.altas[a].date_obj=$filter('date')(dateUtils.parseDate2($scope.altas[a].date) , "dd-MM-yyyy");
                for (var i = 0; i < $scope.contratistas.length; i++) {
                    if ($scope.contratistas[i].id == $scope.altas[a].prov_id) {
                        $scope.altas[a].provselected=$scope.contratistas[i];
                        $scope.altas[a].date_edit=null;
                    }
                }
            }


            //var mydate = new Date('2014-04-03');
            //console.log(mydate.toDateString()
            //console.log($scope.altas);
        });
    };


    $scope.asignar=function () {


        $scope.alta ={"id":item.id,"new_stock":$scope.stock,"date":$scope.date,"obs":$scope.obs,"prov":$scope.contratistaselected.id};

        if($scope.stock<=0){
            toastr.error('Ingrese stock valido', 'Error');
            return false;
        }

        if($scope.date==""){
            toastr.error('Ingrese Fecha de compra valida', 'Error');
            return false;
        }
        //console.log()
        var now=new Date();
        if (now.addHours(11)< dateUtils.parseDate($scope.date) ){
            toastr.error('Ingrese Fecha de compra valida', 'Error');
            return false;
        }
        $uibModalInstance.close($scope.alta);
    }

    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };

    Date.prototype.addHours= function(h){
        this.setHours(this.getHours()+h);
        this.setMinutes(59);
        return this;
    }
});

