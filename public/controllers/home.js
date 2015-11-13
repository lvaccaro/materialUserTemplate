angular.module('MyApp')
  .controller('HomeCtrl', function($scope, $auth, toastr, Account) {
      $scope.getProfile = function() {
        Account.getProfile()
            .then(function(response) {
              $scope.user = response.data;
            })
            .catch(function(response) {
              toastr.error(response.data.message, response.status);
            });
      };

      $scope.getProfile();

        $scope.isAuthenticated = function (){
            return $auth.isAuthenticated()
        }

  });