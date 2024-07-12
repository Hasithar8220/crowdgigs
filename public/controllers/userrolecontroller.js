angular.module('StarterApp').controller('UserRoleController', function ($scope, $http, $mdDialog, UtilityService) {
    $scope.usertasks = {};
    $scope.addUserRoll = {};
    $scope.addMember = {};
    
    $http.get('/userrolls').then(function(response) {
        //console.log("reponce data",response.data);

        $scope.activity = response.data;
    }, function(error) {
        console.error('Error fetching user rolls:', error);
    });

    $http.get('/getprivileges').then(function(response) {
        //console.log("reponce data",response.data);
        $scope.privileges = response.data;
    }, function(error) {
        console.error('Error fetching privileges:', error);
    });
      
    $scope.assignPrivileges = function(userRollId, privileges) {
        var userTasks = {
            user_roll_id: userRollId,
            privileges: []
        };
    
        for (var i = 0; i < privileges.length; i++) {
            if (privileges[i].isSelected) {
                userTasks.privileges.push(privileges[i].id);
            }
        }
    
        console.log("User Data:", userTasks);
    
        $http.post("/assignrolls", userTasks)
            .then(function(response) {
                UtilityService.showSimpleToast('Successfully Assigned Privileges');
                console.log("Response from server:", response.data);
            })
            .catch(function(error) {
                UtilityService.showSimpleToast('Error sending data to server:', error);
            });
            $mdDialog.hide();
    };
    

    $scope.deleteUserRole = function (userRoleId) {
        var confirm = $mdDialog.confirm()
            .title('Confirm Deletion')
            .textContent('Are you sure you want to delete this user role?')
            .ok('Yes')
            .cancel('No');

        $mdDialog.show(confirm).then(function () {
            $http.delete('/userrolls/' + userRoleId).then(function (response) {
                console.log('User role deleted successfully:', response.data);
                UtilityService.showSimpleToast('Successfully Deleted User Role');
            }).catch(function (error) {
                console.error('Error deleting user role:', error);
                UtilityService.showSimpleToast('User Role Delete is not completed');
            });
        }, function () {
            console.log('User canceled deletion.');
        });
    };

    $scope.addUserRoll = function (){
        $scope.addUserRoll = {
            user_Roll: $scope.userRoll,
            note: $scope.note
        };

        console.log("User Data:", $scope.addUserRoll);

        $http.post("/adduser", $scope.addUserRoll)
    .then(function (response) {
        console.log("Response from server:", response.data);
        
        UtilityService.showSimpleToast('User Role Added');
    })
    .catch(function(error) {
        console.error("Error sending data to server:", error);
        UtilityService.showSimpleToast('User Role Adding is Failed');
    });

    };

    $scope.isFormValid = function() {
        return $scope.email && $scope.name && !isNaN($scope.id) ;
        
      };

    $scope.addMember = function (userRollId){
        if (!$scope.isFormValid()) {
            return;
          }
        $scope.assignMember = {
            user_name : $scope.name,
            user_roll_id : userRollId,
            user_email: $scope.email,
            user_note: $scope.note,
            userid: $scope.id
        };

        console.log("User Data:", $scope.assignMember);

        $http.post("/assignmember", $scope.assignMember).then(function (response) {
            console.log("Response from server:", response.data);
            UtilityService.showSimpleToast('Service Agent Allocated');
        }).catch(function(error) {
            console.error("Error sending data to server:", error);
            UtilityService.showSimpleToast('Agent Allocate is Failed');
        });
        $mdDialog.hide();
    };
    
});
