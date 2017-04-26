/**
 * Created by gabo on 26/07/16.
 */


GSPEMApp.controller('abmStockPendRechazados', function($scope,$http,$uibModal,toastr,MovPend) {
    $scope.animationsEnabled = false;
    $scope.descript_reject="";


    $scope.propertyName = 'idCustom';
    $scope.reverse = true;
    $scope.sortBy = function(propertyName) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    var getStockPendRejected = function() {
        $http.get(Routing.generate('get_mov_pend_items_rechazados')
        ).then(function (movs) {
                $scope.movs=movs.data;
        });
    };
    getStockPendRejected();

    $scope.aceptRechazo= function (type,id,idMov , cant) {


        $http({
            url: Routing.generate('acept_rechazados'),
            method: "POST",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
                item_id:idMov,
                cant: cant,
                id:id,
                type:type
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            }
        }).then(function (response) {
                toastr.success('Transferencia realizada con exito ', 'Stock');

                getStockPendRejected()
            },
            function (response) { // optional
                // failed
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
