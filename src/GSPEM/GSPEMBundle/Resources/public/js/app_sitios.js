/**
 * Created by gabo on 26/07/16.
 */
GSPEMApp.controller('abmSitios', function($rootScope,$filter,$scope,$http,$uibModal,toastr,MovPend) {
    $scope.animationsEnabled = false;

    $scope.cargando=true;
    $scope.filterTitle="Filtrar por :"
    $scope.filterValue="";
    $scope.filterColumns=[{'id':0,'val':'name','name':'Nombre'},
                            {'id':1,'val':'emplazamiento','name':'Emplazamiento'},
                            {'id':2,'val':'direccion','name':'Dirección'}];
    $scope.filterColumnsSelected=$scope.filterColumns[0];
    var getSitios = function() {
        $http.get(Routing.generate('get_sitios')
        ).then(function (sitios) {
            $scope.sitios=sitios.data;
            $scope.sitios_ori=sitios.data;
            $scope.cargando=false;
        });
    };
    getSitios();

    $scope.filterSitios=  function(){
        $scope.filterTitle="Buscando ..";
        $scope.sitios=$scope.sitios_ori;
        var column=$scope.filterColumnsSelected.val;
        var value=$scope.filterValue.toLowerCase();
        $scope.cargando=true;
        $scope.sitesResult=[];
        if ($scope.filterValue!=""){

            for (var a = 0; a < $scope.sitios.length; a++) {
                // filter by contains:
                if (column=='name'){
                    if (angular.isDefined($scope.sitios[a].name) && $scope.sitios[a].name!=null){
                        if ($scope.sitios[a].name.toLowerCase().indexOf(value)>=0){
                            $scope.sitesResult.push($scope.sitios[a]);
                        }
                    }
                }
                if (column=='emplazamiento'){
                    if (angular.isDefined($scope.sitios[a].emplazamiento) && $scope.sitios[a].emplazamiento!=null){
                        if ($scope.sitios[a].emplazamiento.toLowerCase().indexOf(value)>=0){
                            $scope.sitesResult.push($scope.sitios[a]);
                        }
                    }
                }
                if (column=='direccion'){
                    if (angular.isDefined($scope.sitios[a].direccion) && $scope.sitios[a].direccion!=null){
                        if ($scope.sitios[a].direccion.toLowerCase().indexOf(value)>=0){
                            $scope.sitesResult.push($scope.sitios[a]);
                        }
                    }
                }
            }

            /*if (column=='name') $scope.sitios= $filter('filter')($scope.sitios, {  name : value });
            if (column=='emplazamiento') $scope.sitios= $filter('filter')($scope.sitios, {  emplazamiento : value });
            if (column=='direccion'){
                $scope.sitios= $filter('filter')($scope.sitios, {  direccion : value });
            }*/
            $scope.sitios=$scope.sitesResult;
        }else {
            $scope.sitios=$scope.sitios_ori;
        }
        $scope.cargando=false;
        $scope.filterTitle="Filtrar por :"
    }

    $scope.clean=  function() {
        $scope.cargando=true;
        $scope.filterValue="";
        $scope.sitios=$scope.sitios_ori;
        $scope.cargando=false;
    }

        $scope.$watch( "autocompleteSelected", function() {
        if(angular.isObject($rootScope.autocompleteSelected)){
            $scope.filtrositios=$rootScope.autocompleteSelected.originalObject.emplazamiento;
        }else {
            $scope.filtrositios=null;
        }
    }, true);

    $scope.new = function (item,template , controller) {

        var modalInstance = $uibModal.open({
            templateUrl: template,
            controller: controller,
            resolve: {
                item: function () {
                    return item;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $scope.cargando=true;
            getSitios()
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };


    $scope.deleteSitios= function (id) {
        //console.log("delete");
        $http({
            url: Routing.generate('delete_sitios'),
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
                id: id
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).then(function (response) {
                getSitios()


            },
            function (response) { // optional
                // failed
            });
    };

});
GSPEMApp.controller('ModelNewSiteCtrl', function($filter,$scope,$http, $uibModalInstance, item,toastr) {
    $scope.item = item;

    $scope.name="";
    $scope.descript="";
    $scope.direccion="";
    $scope.emplazamiento="";
    $scope.latitud=0;
    $scope.longitud=0;
    $scope.editing=true;
    $scope.id=0;

    //console.log(item);




    if(item!=null){
        $scope.editing=false;
        $scope.id=item.id;
        $scope.direccion_str=item.direccion;
        $scope.descript=(item.descript!=null)?item.descript:"";
        if($scope.descript==null){
            $scope.descript="";
        }

        $scope.name=item.name;
        $scope.emplazamiento=(item.emplazamiento!=null)?item.emplazamiento:"";
        if($scope.emplazamiento==null){
            $scope.emplazamiento="";
        }
        $scope.latitud=item.latitud;
        $scope.longitud=item.longitud;
        $scope.typematerial=item.type_id;
    }


    $scope.placeChanged=function (place) {
    }


    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveSitio= function () {
        if ($scope.name.length == 0) {
            toastr.warning('Complete todos los campos requeridos (*)', 'Atención');
            return false;
        } else {
            if ($scope.direccion){
                $scope.latitud  = $scope.direccion.geometry.location.lat()
                $scope.longitud = $scope.direccion.geometry.location.lng()
                $scope.direccion_str=$scope.direccion.formatted_address;
            }else{
                if($scope.id==0){
                    toastr.warning('Complete con una direccion valida', 'Atención');
                    return false
            }
        }

        //console.log($scope.direccion_str);

        $http({
            url: Routing.generate('save_sitios'),
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
                descript: $scope.descript,
                direccion: $scope.direccion_str,
                name:$scope.name,
                emplazamiento:$scope.emplazamiento,
                lat:$scope.latitud,
                long:$scope.longitud,
                id:$scope.id
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).then(function (response) {
                if (response.data.process==false){
                    toastr.warning('Emplazamiento ya utilizado en otro sitio', 'Atención');
                }else {
                    toastr.success('Guardado con éxito', 'Sitio');
                    $uibModalInstance.dismiss('cancel');
                }

            },
            function (response) { // optional
                // failed
            });
    };
    }
});
