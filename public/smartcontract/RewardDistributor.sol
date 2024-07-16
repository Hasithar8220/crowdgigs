// Deployed with the Atlas IDE
// https://app.atlaszk.com/
// Deployed with the Atlas IDE
// https://app.atlaszk.com/
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RewardDistributor {
    IERC20 public cUSDToken;
    address public owner;

    event RewardClaimed(address indexed user, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address _cUSDTokenAddress) {
        cUSDToken = IERC20(_cUSDTokenAddress);
        owner = msg.sender;
    }

    function claimReward(address _to, uint256 _amount) external {
        require(cUSDToken.balanceOf(address(this)) >= _amount, "Insufficient balance");
        cUSDToken.transfer(_to, _amount);
        emit RewardClaimed(_to, _amount);
    }

    function deposit(uint256 _amount) external onlyOwner {
        require(cUSDToken.transferFrom(msg.sender, address(this), _amount), "Deposit failed");
    }

    function withdraw(uint256 _amount) external onlyOwner {
        require(cUSDToken.balanceOf(address(this)) >= _amount, "Insufficient balance");
        cUSDToken.transfer(owner, _amount);
    }
}