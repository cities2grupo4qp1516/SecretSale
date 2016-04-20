secretSale.controller("RegVendedorController", function ($scope, UtilSrvc) {
  $scope.cif ="";
  $scope.pseudonimo = "";
  $scope.ok = false;
  $scope.error = false;

  $scope.validar = function () {

    if($scope.cif.length < 8){
      $scope.error = true;
    } else if ($scope.cif.length == 8){
      $scope.ok = true;
    }
  };

})

.controller("MyCtrl2", function ($scope) {

});
