GL.
    controller("RecipientHomeCtrl", ["$scope", "$http", "$uibModal", function ($scope, $http, $uibModal) {
        $scope.aAgrementModel = false;
        $scope.acceptAgreementDialog = function () {
            $uibModal.open({
                templateUrl: "views/modals/accept_agreement.html",
                controller: "ConfirmableModalCtrl",
                resolve: {
                    arg: {
                    },
                    confirmFun: function () {
                        return function (receiver_id) {
                            $scope.confirmAgreement();
                        }
                    },
                    cancelFun: null
                }
            });
        }

        $scope.confirmAgreement = function () {
            $http({
                method: "PUT",
                url: "api/user/operations",
                data: {
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
