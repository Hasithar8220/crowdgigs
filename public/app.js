import angular from 'angular';
import 'angular-animate';
import 'angular-aria';
import 'angular-material';
import blockchainService from './services/blockchainservice';
import './assets/css/style.css';

angular.module('StarterApp', ['ngMaterial'])
  .factory('blockchainService', function() {
    return blockchainService;
  })
  .controller('SurveyController', ['$scope', 'blockchainService', function($scope, blockchainService) {
    $scope.completeSurvey = function() {
      // Code to complete the survey
      // ...

      // After survey completion, call the reward function
      $scope.claimReward();
    };

    $scope.claimReward = async function() {
    
      const receiverAddresses = await blockchainService.getUserAddress(); // getting from minipay
      const transferValue = '0.1'; // Replace with actual value
     
      $scope.receiverAddress = JSON.stringify(receiverAddresses);

      // Ensure receiverAddresses is an array and get the first element
      const receiverAddress = Array.isArray(receiverAddresses) && receiverAddresses.length > 0 ? receiverAddresses[0] : null;

      // If no valid receiver address, display an error and return
      if (!receiverAddress) {
        alert('Failed to retrieve receiver address.');
        return;
      }

      $scope.receiverAddress = receiverAddress;

      const success = await blockchainService.sendCUSD(receiverAddress, transferValue);
      if (success) {
        alert('Reward claimed successfully!');
        // Redirect back to crowdgigs
        window.location.href = 'https://crowdgigs.yourdomain.com';
      } else {
        alert('Failed to claim reward.');
      }
    };
  }]);
