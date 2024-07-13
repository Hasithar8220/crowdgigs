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

    $scope.init = async function() {
      $scope.steps.push('Initializing blockchain service...');
      try {
        // Get user address from Minipay
        const receiverAddress = await blockchainService.getUserAddress();
        $scope.receiverAddress = receiverAddress;

       
        // If no valid receiver address, display an error and return
        if (!receiverAddress) {
          throw new Error('Failed to retrieve receiver address.');
        }

        $scope.receiverAddress = receiverAddress;
        $scope.steps.push('Blockchain service initialized.');
      } catch (error) {
        $scope.steps.push(`Error during initialization: ${error.message}`);
      } finally {
        $scope.initializing = false;
        $scope.$apply();
      }
    };

    $scope.completeSurvey = function() {
      $scope.claimReward();
    };

    $scope.claimReward = async function() {
      $scope.steps.push('Claiming reward...');
      try {
        const transferValue = '0.1'; // Replace with actual value

        const success = await blockchainService.claimReward($scope.receiverAddress, transferValue);
        alert(success);
        $scope.steps.push(`success msg: ${JSON.stringify(success)}`);
        if (success) {
          $scope.steps.push('Reward claimed successfully!');
          alert('Reward claimed successfully!');
          // Redirect back to crowdgigs
          window.location.href = 'https://crowdgigs.yourdomain.com';
        } else {
          throw new Error('Failed to claim reward.');
        }
      } catch (error) {
        $scope.steps.push(`Error during claim: ${error.message}`);
        alert('Failed to claim reward.');
      } finally {
        $scope.$apply();
      }
    };

    $scope.init();
  }]);
