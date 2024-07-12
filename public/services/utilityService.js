angular.module('StarterApp').service('UtilityService', function UtilityService($http, $mdToast) {
    var service = {};
    service.showSimpleToast = function(msg,hideDelay) {
        let hd = 5000;
        if(hideDelay){
          hd=hideDelay;
        }
  
   $mdToast.show(
  
            $mdToast.simple()
              .textContent(msg)
              .hideDelay(hd)
              .position('top right')
              .toastClass('custom-toast') 
  
          ).then(function() {
            // $log.log('Toast dismissed.');
            location.reload();
          }).catch(function() {
            $log.log('Toast failed or was forced to close early by another toast.');
          });
          
        };

    service.getDeal = async function (data) {
        let c = await $http.post("/api/deal/get", JSON.stringify(data));

        if (c && !c.data) {
            c = await this.getDeal(data);
        }

        return c;
    }

    return service;
});