GL.
  controller("AdminCtrl", ["$scope", "$http", "$uibModal", function ($scope, $http, $uibModal) {

  $scope.aAgrementModel = false;
  $scope.updateNode = function() {
    $scope.Utils.update($scope.resources.node, function() { $scope.$emit("REFRESH"); });
  };

  $scope.newItemOrder = function(objects, key) {
    if (objects.length === 0) {
      return 0;
    }

    var max = 0;
    angular.forEach(objects, function(object) {
      if (object[key] > max) {
        max = object[key];
      }
    });

    return max + 1;
  };

  $scope.$watch("resources.users", function() {
    $scope.all_recipients_enabled = false;

    if (!$scope.resources.users) {
      return;
    }

    for (var i=0; i<$scope.resources.users.length; i++) {
      if ($scope.resources.users[i].role === "receiver" && !$scope.resources.users[i].encryption) {
        return;
      }
    }

    $scope.all_recipients_enabled = true;
  }, true);

  $scope.acceptAgreementDialog = function() {
    $uibModal.open({
      templateUrl: "views/modals/accept_agreement.html",
      controller: "ConfirmableModalCtrl",
      resolve: {
        arg: {
        },
        confirmFun: function(){
          return function (receiver_id) {
            $scope.confirmAgreement();
          }
        },
        cancelFun: null
      }
    });
  }

  $scope.confirmAgreement = function(){
    $http({
        method:"PUT",
        url: "api/user/operations",
        data:{
          "operation": "accepted_privacy_policy",
          "args": {}
        }
    });
  }

  if($scope.resources.preferences.accepted_privacy_policy === '1970-01-01T00:00:00Z'){
      $scope.resources.preferences.accepted_privacy_policy = '';
      $scope.acceptAgreementDialog();
  }
}]);
