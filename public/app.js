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

      if (window && window.ethereum) {
        // User has a injected wallet
      
        if (window.ethereum.isMiniPay) {
          // User is using Minipay
      
          // Requesting account addresses
          let accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
            params: [],
          });
      
        
          if(accounts && accounts.length > 0){
  // Injected wallets inject all available addresses,
          // to comply with API Minipay injects one address but in the form of array
          console.log(accounts[0]);
          }else{
            alert('This app only support with operamini, minipay app')
          }
        }else{
          alert('This app only support with operamini, minipay app')
        }
      
        
      }


      $scope.steps.push('Initializing blockchain service...');
      try {
        // Get user address from Minipay
        const receiverAddresses = await blockchainService.getUserAddress();
        $scope.receiverAddress = JSON.stringify(receiverAddresses);

        // Ensure receiverAddresses is an array and get the first element
        const receiverAddress = Array.isArray(receiverAddresses) && receiverAddresses.length > 0 ? receiverAddresses[0] : null;

       
        // If no valid receiver address, display an error and return
        if (!receiverAddress) {
          throw new Error('Failed to retrieve receiver address.');
        }

        $scope.receiverAddress = receiverAddress;
        $scope.steps.push('Blockchain service initialized.');

        $scope.balance = await blockchainService.checkCUSDBalance($scope.receiverAddress);

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
        alert(success); alert(success.tx);
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
        $scope.steps.push(`Error during claim: ${error}`);
        alert('Failed to claim reward.');
      } finally {
        $scope.$apply();
      }
    };

    $scope.init();
  }]);
