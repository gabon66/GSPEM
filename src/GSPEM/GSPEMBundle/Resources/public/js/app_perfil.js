/**
 * Created by gabo on 26/07/16.
 */
GSPEMApp.controller('abmPerfil', function($filter,$scope,$http,$uibModal,toastr,MovPend) {
    $scope.passedite=true;
    $scope.pass="";


    $scope.showperfiledit=false;

    var getPerfil = function() {
        $http.get(Routing.generate('get_profile')
        ).then(function (user) {
            $scope.userdata=user.data.user;
            $scope.access=angular.fromJson(user.data.profile.access);
            if($scope.access.user.perfiles){
                $scope.showperfiledit=true;
            }
            //console.log($scope.access);
            $scope.id=$scope.userdata.id;
            $scope.nombre=$scope.userdata.name;
            $scope.apellido=$scope.userdata.lastName;
            $scope.profileselected=$filter('filter')($scope.perfiles,{"id":$scope.userdata.view})[0];
            $scope.mail=$scope.userdata.mail;
            $scope.user=$scope.userdata.username;
            //$scope.pass=$scope.userdata.password;
            $scope.phone=$scope.userdata.phone;

        });
    };

    var gerPerfiles = function() {
        $http.get(Routing.generate('get_perfiles')
        ).then(function (perfiles) {
            $scope.perfiles=perfiles.data;
            //console.log($scope.perfiles);
            $scope.profileselected=$scope.perfiles[0];
            getPerfil();
        });
    };
    gerPerfiles();

    $scope.getActive= function(val1,val2){
        if(val1==val2)
            return "btn btn-default active"
        else
            return "btn btn-default";
    }

    $scope.setActiveUser= function(val1){
        $scope.perfil=val1;
    }

    $scope.editPass=function () {
        if($scope.passedite){
            $scope.passedite=false;
        }else {
            $scope.passedite=true;
        }
    }


    $scope.saveUser= function () {

        if(!$scope.passedite){
            if($scope.pass.length <6){
                toastr.warning('La clave no puede ser menor a 6 digitos', 'Atención');
                return false;
            }
        }else {
            $scope.pass="";
        }


        $http({
            url: Routing.generate('save_user_pass'),
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
                id:$scope.id,
                password:$scope.pass,
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).then(function (response) {
                //console.log(response);
                toastr.success('Guardado con exito', 'Perfil');
            },
            function (response) { // optional
                // failed
            });
    };

});

GSPEMApp.controller('abmPerfiles', function($scope,$http,$uibModal,toastr,MovPend) {
    //console.log("dasdsa");
    var gerPerfiles = function() {
        $http.get(Routing.generate('get_perfiles')
        ).then(function (perfiles) {
            $scope.perfiles=perfiles.data;
        });
    };
    gerPerfiles();

    $scope.new = function (item) {

        var modalInstance = $uibModal.open({
            templateUrl: "perfil_form.html",
            controller: "ModelNewPerfil",
            resolve: {
                item: function () {
                    return item;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            gerPerfiles();
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };


    $scope.deletePerfil= function (id) {

        $http({
            url: Routing.generate('delete_perfiles'),
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
                //console.log(response.data);
                if(response.data.process==false){
                    toastr.warning('Perfil en uso', 'Error');
                }else {
                    toastr.success('Eliminado con exito', 'Perfil');
                    gerPerfiles();
                }
                },
            function (response) { // optional
                // failed
            });
    };

});

GSPEMApp.controller('ModelNewPerfil', function($filter,$scope,$http, $uibModalInstance, item,toastr) {
    $scope.item = item;
    //console.log(item);

    $scope.id=0;

    $scope.user={all:true,abm:true, perfiles:true,contratistas:true};
    $scope.sitios={all:true,abm:true};
    $scope.materiales={all:true,abm_tipo:true,abm:true};
    $scope.oper={all:true,stock:true,stock_to_tec:true,stock_tec_to_tec:true};
    $scope.opertec={all:true,stock:true,stoc_pend:true,stoc_tec:true,stoc_sit:true};
    $scope.reportes={all:true,stock_maestro:true,stock_tec:true,stock_sit:true,stock_cont:true,stock_mov:true,stock_mov_by_mat:true,stock_alertas:true,compras:true};

    
    
    
    $scope.perfil={user:$scope.user,sitios:$scope.sitios,
        materiales:$scope.materiales,oper:$scope.oper,opertec:$scope.opertec,reportes:$scope.reportes};


    if(item!=null){
        $scope.editing=false;
        $scope.id=item.id;
        $scope.descript=item.descript;
        $scope.name=item.name;
        $scope.perfil=angular.fromJson($scope.item.access);
    }

    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.saveProfile= function () {
        console.log($scope.perfil);
            $http({
                url: Routing.generate('set_perfiles'),
                method: "POST",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                data: {
                    descript: $scope.descript,
                    name:$scope.name,
                    access:$scope.perfil,
                    id:$scope.id
                }
            }).then(function (response) {

                    $uibModalInstance.dismiss('cancel');
                },
                function (response) { // optional
                    // failed
                });
        };


});