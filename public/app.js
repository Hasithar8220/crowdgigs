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
      const tokenAddress = '0xYourTokenAddress'; // Replace with actual token address
      const receiverAddress = '0xReceiverAddress'; // Replace with user's wallet address
      const transferValue = '0.1'; // Replace with actual value
      const tokenDecimals = 18; // Replace with actual token decimals

      const success = await blockchainService.requestTransfer(tokenAddress, receiverAddress, transferValue, tokenDecimals);
      if (success) {
        alert('Reward claimed successfully!');
        // Redirect back to crowdgigs
        window.location.href = 'https://crowdgigs.yourdomain.com';
      } else {
        alert('Failed to claim reward.');
      }
    };
  }]);
