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
    $scope.steps = [];
    $scope.initializing = true;

    // Initialize everything when the view is loaded
    $scope.init = async function() {
      $scope.steps.push('Initializing blockchain service...');
      try {
        const address = await blockchainService.getUserAddress();
        $scope.steps.push('Blockchain service initialized.');
        $scope.address = address;
      } catch (error) {
        $scope.steps.push(`Error during initialization: ${error.message}`);
      } finally {
        $scope.initializing = false;
        $scope.$apply();
      }
    };

    $scope.completeSurvey = function() {
      // Code to complete the survey
      // ...

      // After survey completion, call the reward function
      $scope.claimReward();
    };

    $scope.claimReward = async function() {
      $scope.steps = [];
      try {
        $scope.steps.push('Claiming reward...');
        const receiverAddress = await blockchainService.getUserAddress();
        $scope.steps.push(`Receiver Addresses: ${receiverAddress}`);
        const transferValue = '0.1'; // Replace with actual value

        // Ensure receiverAddresses is an array and get the first element
        //const receiverAddress = Array.isArray(receiverAddresses) && receiverAddresses.length > 0 ? receiverAddresses[0] : null;

        if (!receiverAddress) {
          $scope.steps.push('Failed to retrieve receiver address.');
          alert('Failed to retrieve receiver address.');
          return;
        }

        $scope.receiverAddress = receiverAddress;
        $scope.steps.push(`Receiver Address: ${receiverAddress}`);

        const success = await blockchainService.sendCUSD(receiverAddress, transferValue);
        $scope.steps.push(`Transfer Success: ${success}`);
        if (success) {
          alert('Reward claimed successfully!');
          // Redirect back to crowdgigs
          window.location.href = 'https://crowdgigs.yourdomain.com';
        } else {
          alert('Failed to claim reward.');
        }
      } catch (error) {
        $scope.steps.push(`Error during claim: ${error.message}`);
        alert('Failed to claim reward.');
      } finally {
        $scope.$apply();
      }
    };

    // Call the init function when the view is loaded
    $scope.init();
  }]);
