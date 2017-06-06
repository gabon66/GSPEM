/**
 * Created by gabo on 26/07/16.
 */
GSPEMApp.controller('abmUsuarios', function($scope,$http,$uibModal,toastr,MovPend) {



    $scope.propertyName = ['lastName','name'];
    $scope.reverse = false;
    $scope.reverse_combined = false;


    $scope.sortBy = function(propertyName) {
        if (angular.isArray(propertyName) && angular.isArray(propertyName)){
            $scope.reverse = ($scope.propertyName[0] === propertyName[0]) ? !$scope.reverse : false;
            $scope.reverse_combined =($scope.reverse_combined)? false:true;
            console.log($scope.reverse_combined);
            $scope.reverse =($scope.reverse_combined)? false:true;
            console.log($scope.reverse);

        }else {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        }
        $scope.propertyName = propertyName;
    };


    var getContratistas = function() {
        $http.get(Routing.generate('get_contratistas')
        ).then(function (contratistas) {

            $scope.contratistas=contratistas.data;
            for (var a = 0; a < $scope.contratistas.length; a++) {
                $scope.contratistas[a].supervisor1=angular.fromJson($scope.contratistas[a].supervisor1);
                $scope.contratistas[a].supervisor2=angular.fromJson($scope.contratistas[a].supervisor2);
                $scope.contratistas[a].supervisor3=angular.fromJson($scope.contratistas[a].supervisor3);

            }
            ////console.log($scope.contratistas);
        });
    };
    getContratistas();


    var gerPerfiles = function() {
        $http.get(Routing.generate('get_perfiles')
        ).then(function (perfiles) {
            $scope.perfiles=perfiles.data;
            ////console.log($scope.perfiles);
            $scope.profileselected=$scope.perfiles[0];
        });
    };
    gerPerfiles();

    var getUsuarios = function() {
        $http.get(Routing.generate('get_users')
        ).then(function (users) {
            $scope.users=users.data;
            $scope.userslevel0=[];
            $scope.userslevel1=[];
            $scope.userslevel2=[];
            for (var a = 0; a < $scope.users.length; a++) {
                if($scope.users[a].level==1){
                    // admines
                    $scope.userslevel0.push($scope.users[a]);
                }

                if($scope.users[a].level==2){
                    //supervisores
                    $scope.userslevel1.push($scope.users[a]);
                }

                if($scope.users[a].level==3){
                    // tecnicos
                    $scope.userslevel2.push($scope.users[a]);
                }
            }
            $scope.usersbyroles={levels0:$scope.userslevel0,levels1:$scope.userslevel1,levels2:$scope.userslevel2};
            ////console.log($scope.users);
        });
    };
    getUsuarios();

    $scope.deleteUser = function (id) {
        $http({
            url: Routing.generate('delete_usuario'),
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
                id:id,
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).then(function (response) {
                getUsuarios();
            },
            function (response) { // optional
                // failed
            });
    };

    $scope.chaneStateUser=function (id,state) {
        var stateUser=1;
        if(state=="1"){
             stateUser=0;
        }
        $http({
            url: Routing.generate('save_users_state'),
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
                id:id,
                state: stateUser
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).then(function (response) {
                getUsuarios();
            },
            function (response) { // optional
                // failed
            });
    };


    $scope.new = function (item,template , controller) {
        if (item==null){
            item={};
        }
        item.perfiles=$scope.perfiles;
        item.usersbyroles=$scope.usersbyroles;
        item.contratistas=$scope.contratistas;
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
            getUsuarios();
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };
});



GSPEMApp.controller('ModalNewUserCtrl', function($filter,$scope,$http, $uibModalInstance, item,toastr) {
    $scope.usersbyroles=[];

    $scope.item = item;
    $scope.perfiles=item.perfiles;
    $scope.contratistas=item.contratistas;

    $scope.usersbyroles=item.usersbyroles;
    //console.log($scope.usersbyroles);
    $scope.contratistaenabled=false;
    $scope.levels=[];
    $scope.levels.push({id:1,name:"Administrador"},{id:2,name:"Supervisor"},{id:3,name:"Técnico"});
    $scope.levelselected=$scope.levels[0];
    $scope.contratistaselected=$scope.contratistas[0];

    $scope.profileselected=$scope.perfiles[0];

    $scope.type=1;
    $scope.pass="";
    $scope.passedite=true;
    $scope.bosseselected=[];

    $scope.fixIE = function(){
        //code to check if IE so the other browsers don't get this ugly hack.
        var selectLists = document.querySelectorAll(".selectList");
        for(var x = 0;x  < selectLists.length; x++){
            selectLists[x].parentNode.insertBefore(selectLists[x], selectLists[x]);
        }
    };

    $scope.editPass=function () {
        if($scope.passedite){
            $scope.passedite=false;
        }else {
            $scope.passedite=true;
        }
    }


    $scope.reloadBosses= function () {
        getbosess($scope.levelselected.id);
    }

    var getbosess= function (level) {
        $scope.bosses=[];
        if(level==2){
            if($scope.usersbyroles.levels0.length>0){
                $scope.bosses = $scope.bosses.concat($scope.usersbyroles.levels0)
            }
        }
        if(level==3){
            if($scope.usersbyroles.levels0.length>0){
                $scope.bosses = $scope.bosses.concat($scope.usersbyroles.levels0)
            }
            if($scope.usersbyroles.levels1.length>0){

                $scope.bosses = $scope.bosses.concat($scope.usersbyroles.levels1)
                //console.log($scope.usersbyroles.levels1);
            }
        }

    }

    if(item.id!=null){
        $scope.profileselected=$filter('filter')($scope.perfiles,{"id":item.profileid})[0];
        if(item.bosses){

            //console.log("tienen bosess");
            //console.log(angular.fromJson(item.bosses));
            for(var x = 0;x  < angular.fromJson(item.bosses).length; x++){
                ////console.log(angular.fromJson(item.bosses)[x]);
                $scope.bosseselected.push(angular.fromJson(item.bosses)[x]);
            }

            //$scope.bosseselected= angular.fromJson(item.bosses);
            ////console.log($scope.bosseselected);
        }

        if(item.level){
            getbosess(item.level);
        }
        $scope.levelselected=$filter('filter')($scope.levels,{"id":item.level})[0];
        if(item.contratistaid==0){
            $scope.contratistaenabled=false
        }else {
            if(item.contratistaid>0){
                $scope.contratistaenabled=true;
                $scope.contratistaselected= $filter('filter')($scope.contratistas,{"id":item.contratistaid})[0];
            }else {
                $scope.contratistaenabled=false
            }
        }
        $scope.id=item.id;
        $scope.nombre=item.name;
        $scope.apellido=item.lastName;
        $scope.perfil=item.view;
        $scope.user=item.username;
        $scope.phone=item.phone;
        $scope.mail=item.mail;
    }else {
        //console.log("new");
        $scope.nombre="";
        $scope.descript="";
        $scope.id=0;
        $scope.precio=0;
        $scope.precio1=0;
        $scope.perfil=1;
    }

    $scope.updateCon=function () {
        //console.log($scope.contratistaselected);
    }


    $scope.cerrar=function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    
    $scope.bosseschane= function () {
        //console.log($scope.bosseselected);
    }

    $scope.saveUser= function () {

        ////console.log($scope.bosseselected);
        //return null;

        if ($scope.nombre.length == 0 || $scope.user.length == 0  || $scope.mail.length == 0 ) {
            toastr.warning('Complete todos los campos requeridos (*)', 'Atención');
            return false;
        }

        if(!$scope.passedite){
            if($scope.pass.length <6){
                toastr.warning('La clave no puede ser menor a 6 digitos', 'Atención');
                return false;
            }
        }else{
            $scope.pass="";
        }


        if($scope.mail.search("@")< 0 || $scope.mail.indexOf(".com")< 0){
            toastr.warning('Mail invalido', 'Atención');
            return false;
        }

        ////console.log($scope.contratistaselected);

        if($scope.contratistaenabled){

            $scope.contrat= $scope.contratistaselected.id;
        }else {
            $scope.contrat=0;
        }
        $scope.bossesUser="";
        if ($scope.bosseselected!=undefined && $scope.bosseselected!="undefined" ){
            if ($scope.bosseselected.length>0){
                $scope.bossesUser=angular.toJson($scope.bosseselected);
            }
        }
        ////console.log("bossesa guardar"+$scope.levelselected.id);

        $http({
            url: Routing.generate('save_users'),
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
                nombre: $scope.nombre,
                apellido: $scope.apellido,
                id:$scope.id,
                username:$scope.user,
                password:$scope.pass,
                phone:$scope.phone,
                contratista: $scope.contrat,
                mail:$scope.mail,
                view:$scope.profileselected.id,
                level:$scope.levelselected.id,
                bosses: $scope.bossesUser
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).then(function (response) {
                ////console.log(response);
                $uibModalInstance.dismiss('cancel');
            },
            function (response) { // optional
                // failed
            });
    };
});
