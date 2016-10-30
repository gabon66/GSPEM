/**
 * Created by gabo on 26/07/16.
 */

GSPEMApp.controller('abmStockMov', function($scope,$http,$uibModal,toastr ,MovPend) {
    $scope.animationsEnabled = false;
    $scope.stockPendiente=[];


    var getUsers= function () {
        $scope.tecnicos=[];
        $http.get(Routing.generate('get_users')
        ).success(function (data) {

            for (var e = 0; e < data.length; e++) {
                if(data[e].id!=$scope.mi_id && data[e].disabled==0){
                    if(data[e].level==$scope.mi_level){
                        $scope.tecnicos.push(data[e]);
                    }else if (data[e].level > $scope.mi_level &&  data[e].bosses ) {
                        // valido a mis hijos
                        $scope.bosses_user=angular.fromJson(data[e].bosses);

                        if($scope.bosses_user){
                            for (var s = 0; s < $scope.bosses_user; s++) {
                                if($scope.bosses_user[s] == $scope.mi_id){
                                    // es uno los hijos
                                    console.log("por hijos");
                                    $scope.tecnicos.push(data[e]);
                                    break;
                                }
                            }
                        }
                    }else {
                        // solo a mis jefes
                        if($scope.mi_bosses){
                            for (var b = 0; b < $scope.mi_bosses.length; b++) {
                                if($scope.mi_bosses[b] == data[e].id){
                                    $scope.tecnicos.push(data[e]);
                                }
                            }
                        }
                    }
                }
            }


            for (var a = 0; a < $scope.tecnicos.length; a++) {
                if ($scope.tecnicos[a].contratista!=null){
                    $scope.tecnicos[a].name=$scope.tecnicos[a].name+" "+$scope.tecnicos[a].lastName +" - "+$scope.tecnicos[a].contratista;
                }else {
                    $scope.tecnicos[a].name=$scope.tecnicos[a].name+" "+$scope.tecnicos[a].lastName;
                }
            }

            $scope.tecnicotarea=$scope.tecnicos[0];
        });
    }

    var getPerfil = function() {
        $http.get(Routing.generate('get_profile')
        ).success(function (user) {
            //console.log(user);
            $scope.mi_level=user.user.level;
            $scope.mi_id=user.user.id;
            $scope.mi_bosses="";
            if(user.user.bosses.length>0){
                $scope.mi_bosses=angular.fromJson(user.user.bosses);
            }

            getUsers();
        });
    };
    getPerfil();








    $scope.propertyName = 'id';
    $scope.reverse = true;
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.parseInt = parseInt;

    var getStock = function() {
        $http.get(Routing.generate('get_stock')
        ).success(function (stock) {
            $scope.stock=stock;
            for (var a = 0; a < $scope.stock.length; a++) {
                $scope.stock[a].referencia=angular.fromJson($scope.stock[a].referencia);
            }
            //console.log($scope.stock);
        });
    };
    getStock();


    $scope.cancelStock=function (item) {
        item.stock=item.stock_ori;
        $scope.stockPendienteTemp=[];
        item.new_stock=0;
        item.showcancel=false;
        for (var a = 0; a < $scope.stockPendiente.length; a++) {
            if($scope.stockPendiente[a].id==item.id){
                existe=true;
                $scope.stockPendiente[a].stock= parseInt($scope.stockPendiente[a].stock) +parseInt(item.cant);
            }else {
                $scope.stockPendienteTemp.push($scope.stockPendiente[a]);
            }
        }
        $scope.stockPendiente=$scope.stockPendienteTemp;
    }


    $scope.setStock=function (item) {
      //console.log(item.cant);

        if(item.cant=="" || item.cant==undefined){
            item.cant=1;
        }

        if(item.cant>0){

            if(parseInt(item.cant)>parseInt(item.stock)){
                toastr.warning('Indique numero menor o igual al stock maestro', 'Atención');
            }else {
                item.showcancel=true;
                if(!item.stock_ori){
                    item.stock_ori=item.stock;
                }
                item.stock=parseInt(item.stock) - parseInt(item.cant) ;
                item.new_stock=item.stock;

                if ($scope.stockPendiente.length>0){
                    var existe=false;
                    for (var a = 0; a < $scope.stockPendiente.length; a++) {
                        if($scope.stockPendiente[a].id==item.id){
                            existe=true;
                            $scope.stockPendiente[a].stock= parseInt($scope.stockPendiente[a].stock) +parseInt(item.cant);
                        }
                    }
                    if(!existe){
                        $scope.stockPendiente.push({id:item.id,idCustom:item.idCustom ,name:item.name , stock:item.cant})
                    }
                }else {
                    $scope.stockPendiente.push({id:item.id,idCustom:item.idCustom ,name:item.name , stock:item.cant})
                }

            }

        }

    };


    $scope.confirmar=function () {
        confirmar_stock_maestro();
        confirmar_mov_stoc_tec();
    }


    var confirmar_stock_maestro=function () {
        $http({
            url: Routing.generate('set_stock'),
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            data: {
                items:$scope.stock
            }
        }).then(function (response) {
                console.log(response);
                //getStock();
                //toastr.success('Guardado con éxito', 'Stock');
            },
            function (response) { // optional
                // failed
            });
    }


    var confirmar_mov_stoc_tec=function () {
        $http({
            url: Routing.generate('set_stock_mov_tec'),
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            data: {
                tecnico:$scope.tecnicotarea.id,
                nota:"prueba",
                items:$scope.stockPendiente
            }
        }).then(function (response) {
                console.log(response);
                $scope.stockPendiente=[];
                getStock();
                toastr.success('Guardado con éxito', 'Stock');
            },
            function (response) { // optional
                // failed
            });
    }



});

GSPEMApp.controller('abmStockMovTecnicoToTecnico', function($scope,$http,$uibModal,toastr ,MovPend) {
    $scope.animationsEnabled = false;
    $scope.stockPendiente=[];

    var getUsers= function () {
        $http.get(Routing.generate('get_users')
        ).success(function (data) {


            $scope.tecnicos=data;
            for (var a = 0; a < $scope.tecnicos.length; a++) {
                if ($scope.tecnicos[a].contratista!=null){
                    $scope.tecnicos[a].name=$scope.tecnicos[a].name+" "+$scope.tecnicos[a].lastName +" - "+$scope.tecnicos[a].contratista;
                }else {
                    $scope.tecnicos[a].name=$scope.tecnicos[a].name+" "+$scope.tecnicos[a].lastName;
                }
            }
            $scope.tecnicoorigen=$scope.tecnicos[0];


            loadTecnicnosDestino();
            //
            getStockFromUser();
        });
    }


    getUsers();

    var loadTecnicnosDestino=function(){

        $scope.tecnicosdest=[];

        //console.log($scope.tecnicoorigen);
        if($scope.tecnicoorigen.bosses.length>0){
            var bosses_tec_ori=angular.fromJson($scope.tecnicoorigen.bosses);
        }


        for (var e = 0; e < $scope.tecnicos.length; e++) {

            if($scope.tecnicos[e].id != $scope.tecnicoorigen.id && $scope.tecnicos[e].disabled==0){
                if($scope.tecnicos[e].level==$scope.tecnicoorigen.level){
                    $scope.tecnicosdest.push($scope.tecnicos[e]);
                }else if ($scope.tecnicos[e].level > $scope.tecnicoorigen.level &&  $scope.tecnicos[e].bosses ) {
                    // valido a mis hijos
                    $scope.bosses_user=angular.fromJson($scope.tecnicos[e].bosses);
                    if($scope.bosses_user){
                        for (var s = 0; s < $scope.bosses_user; s++) {
                            if($scope.bosses_user[s] == $scope.tecnicoorigen.id){
                                // es uno los hijos
                                $scope.tecnicosdest.push($scope.tecnicos[e]);
                                break;
                            }
                        }
                    }
                }else {
                    // solo a mis jefes
                    if(bosses_tec_ori){
                        for (var b = 0; b < bosses_tec_ori; b++) {
                            if(bosses_tec_ori[b] == $scope.tecnicos[e].id){
                                console.log("por jefes");
                                $scope.tecnicosdest.push($scope.tecnicos[e]);
                            }
                        }
                    }
                }
            }
        }

        $scope.tecnicodestino=$scope.tecnicosdest[0];
    }



    $scope.propertyName = 'id';
    $scope.reverse = true;
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };


    $scope.getStockOrigen= function () {
        // recarga users
        loadTecnicnosDestino();
        $scope.stockPendiente=[];
        getStockFromUser();
    }

    var getStockFromUser=function () {

        $http({
            url: Routing.generate('get_stock_user_custom'),
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
                id:  $scope.tecnicoorigen.id
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).then(function (response) {
                console.log(response);


                $scope.stock=response.data;
                for (var a = 0; a < $scope.stock.length; a++) {
                    $scope.stock[a].referencia=angular.fromJson($scope.stock[a].referencia);
                }

            },
            function (response) { // optional
                // failed
            });
    }



    $scope.cancelStock=function (item) {
        item.stock=item.stock_ori;
        $scope.stockPendienteTemp=[];
        item.new_stock=0;
        item.showcancel=false;
        for (var a = 0; a < $scope.stockPendiente.length; a++) {
            if($scope.stockPendiente[a].id==item.id){
                existe=true;
                $scope.stockPendiente[a].stock= parseInt($scope.stockPendiente[a].stock) +parseInt(item.cant);
            }else {
                $scope.stockPendienteTemp.push($scope.stockPendiente[a]);
            }
        }
        $scope.stockPendiente=$scope.stockPendienteTemp;
    }


    $scope.setStock=function (item) {
        //console.log(item.cant);
        if(item.cant=="" || item.cant==undefined){
            item.cant=1;
        }

        if(item.cant>0){
            if(parseInt(item.cant)>parseInt(item.stock)){
                toastr.warning('Indique numero menor o igual al stock maestro', 'Atención');
            }else {
                item.showcancel=true;
                if(!item.stock_ori){
                    item.stock_ori=item.stock;
                }
                item.stock=parseInt(item.stock) - parseInt(item.cant) ;
                item.new_stock=item.stock;
                if ($scope.stockPendiente.length>0){
                    var existe=false;
                    for (var a = 0; a < $scope.stockPendiente.length; a++) {
                        if($scope.stockPendiente[a].id==item.id){
                            existe=true;
                            $scope.stockPendiente[a].stock= parseInt($scope.stockPendiente[a].stock) +parseInt(item.cant);
                        }
                    }
                    if(!existe){
                        $scope.stockPendiente.push({id:item.id,idCustom:item.idCustom ,name:item.name , stock:item.cant})
                    }
                }else {
                    $scope.stockPendiente.push({id:item.id,idCustom:item.idCustom ,name:item.name , stock:item.cant})
                }
            }
        }
    };


    $scope.confirmar=function () {
        if($scope.tecnicodestino.id == $scope.tecnicoorigen.id ){
            toastr.warning('Seleccione un tecnico distinto para el envio de stock', 'Error');
        } else {
            confirmar_stock_tecnico();
            confirmar_mov_stoc_tec();
        }
    }


    var confirmar_stock_tecnico=function () {
        $http({
            url: Routing.generate('set_stock_user'),
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            data: {
                user: $scope.tecnicoorigen.id,
                items:$scope.stock
            }
        }).then(function (response) {
                console.log(response);
                //getStock();
                //toastr.success('Guardado con éxito', 'Stock');
            },
            function (response) { // optional
                // failed
            });
    }


    var confirmar_mov_stoc_tec=function () {
        $http({
            url: Routing.generate('set_stock_mov_tec'),
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            data: {
                
                tecnico:$scope.tecnicodestino.id,
                origen:$scope.tecnicoorigen.id,
                nota:"prueba",
                items:$scope.stockPendiente
            }
        }).then(function (response) {
                console.log(response);
                $scope.stockPendiente=[];
                getStockFromUser();
                toastr.success('Guardado con éxito', 'Stock');
            },
            function (response) { // optional
                // failed
            });
    }

});
GSPEMApp.controller('abmStockMovTecnicoToTecnicoFromTec', function($scope,$http,$uibModal,toastr ,MovPend) {
    $scope.animationsEnabled = false;
    $scope.stockPendiente=[];
    $scope.tecnicos=[];

    var getUsers= function () {
        $http.get(Routing.generate('get_users')
        ).success(function (data) {
            console.log(data);
            for (var e = 0; e < data.length; e++) {
                if(data[e].id!=$scope.mi_id && data[e].disabled==0){

                    if(data[e].level==$scope.mi_level){
                        // mando los de mi mismo nivel
                        console.log("por mismo nivel");
                        $scope.tecnicos.push(data[e]);
                    }else if (data[e].level > $scope.mi_level &&  data[e].bosses ) {
                        // valido a mis hijos
                        console.log("valido por hijos");
                        $scope.bosses_user=angular.fromJson(data[e].bosses);
                        if($scope.bosses_user){
                            for (var s = 0; s < $scope.bosses_user; s++) {
                                if($scope.bosses_user[s] == $scope.mi_id){
                                    // es uno los hijos
                                    console.log("por hijos");
                                    $scope.tecnicos.push(data[e]);
                                    break;
                                }
                            }
                        }

                    }else {
                        // solo a mis jefes
                        if($scope.mi_bosses){

                            for (var b = 0; b < $scope.mi_bosses.length; b++) {

                                if($scope.mi_bosses[b] == data[e].id){
                                    console.log("por jefes");
                                    $scope.tecnicos.push(data[e]);
                                }
                            }
                        }
                    }
                }
            }

            for (var a = 0; a < $scope.tecnicos.length; a++) {
                if ($scope.tecnicos[a].contratista!=null){
                    $scope.tecnicos[a].name=$scope.tecnicos[a].name+" "+$scope.tecnicos[a].lastName +" - "+$scope.tecnicos[a].contratista;
                }else {
                    $scope.tecnicos[a].name=$scope.tecnicos[a].name+" "+$scope.tecnicos[a].lastName;
                }
            }
            $scope.tecnicodestino=$scope.tecnicos[0];



        });
    }



    var getPerfil = function() {
        $http.get(Routing.generate('get_profile')
        ).success(function (user) {
            console.log(user);
            $scope.mi_level=user.user.level;
            $scope.mi_id=user.user.id;
            $scope.mi_bosses="";

            if (user.user.bosses.length>0){
                $scope.mi_bosses=angular.fromJson(user.user.bosses);
                console.log($scope.mi_bosses)
            }
            getUsers();
        });
    };
    getPerfil();


    var getStock = function() {
        $http.get(Routing.generate('get_stock_user')
        ).success(function (stock) {
            $scope.stock=stock;
            for (var a = 0; a < $scope.stock.length; a++) {
                $scope.stock[a].referencia=angular.fromJson($scope.stock[a].referencia);
            }

            //console.log($scope.stock);
        });
    };
    getStock();


    $scope.cancelStock=function (item) {
        item.stock=item.stock_ori;
        $scope.stockPendienteTemp=[];
        item.new_stock=0;
        item.showcancel=false;
        for (var a = 0; a < $scope.stockPendiente.length; a++) {
            if($scope.stockPendiente[a].id==item.id){
                existe=true;
                $scope.stockPendiente[a].stock= parseInt($scope.stockPendiente[a].stock) +parseInt(item.cant);
            }else {
                $scope.stockPendienteTemp.push($scope.stockPendiente[a]);
            }
        }
        $scope.stockPendiente=$scope.stockPendienteTemp;
    }


    $scope.setStock=function (item) {
        //console.log(item.cant);

        if(item.cant=="" || item.cant==undefined){
            item.cant=1;
        }

        if(item.cant>0){

            if(parseInt(item.cant)>parseInt(item.stock)){
                toastr.warning('Indique numero menor o igual al stock maestro', 'Atención');
            }else {
                item.showcancel=true;
                if(!item.stock_ori){
                    item.stock_ori=item.stock;
                }
                item.stock=parseInt(item.stock) - parseInt(item.cant) ;
                item.new_stock=item.stock;

                if ($scope.stockPendiente.length>0){
                    var existe=false;
                    for (var a = 0; a < $scope.stockPendiente.length; a++) {
                        if($scope.stockPendiente[a].id==item.id){
                            existe=true;
                            $scope.stockPendiente[a].stock= parseInt($scope.stockPendiente[a].stock) +parseInt(item.cant);
                        }
                    }
                    if(!existe){
                        $scope.stockPendiente.push({id:item.id,idCustom:item.idCustom ,name:item.name , stock:item.cant})
                    }
                }else {
                    $scope.stockPendiente.push({id:item.id,idCustom:item.idCustom ,name:item.name , stock:item.cant})
                }

            }

        }

    };


    $scope.confirmar=function () {
        confirmar_stock_tecnico();
        confirmar_mov_stoc_tec();
    }


    var confirmar_stock_tecnico=function () {
        $http({
            url: Routing.generate('set_stock_user'),
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            data: {
                user: "login",
                items:$scope.stock
            }
        }).then(function (response) {
                console.log(response);
                //getStock();
                //toastr.success('Guardado con éxito', 'Stock');
            },
            function (response) { // optional
                // failed
            });
    }


    var confirmar_mov_stoc_tec=function () {
        $http({
            url: Routing.generate('set_stock_mov_tec'),
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            data: {

                tecnico:$scope.tecnicodestino.id,
                origen:"login",
                nota:"prueba",
                items:$scope.stockPendiente
            }
        }).then(function (response) {
                console.log(response);
                $scope.stockPendiente=[];
                getStock();
                toastr.success('Guardado con éxito', 'Stock');
            },
            function (response) { // optional
                // failed
            });
    }

});