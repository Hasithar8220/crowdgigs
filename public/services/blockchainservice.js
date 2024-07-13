import { createPublicClient, createWalletClient, custom, http,parseUnits, parseEther, formatEther, getContract } from 'viem';
import { celoAlfajores } from 'viem/chains';
import RewardDistributorABI from '../abi/RewardDistributorABI.json';
import stableTokenABI from '../abi/cusd-abi.json';

const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http(),
});

const rewardDistributorAddress = "0xDa2eD4295a5b277E8cF9eeEE21F44C236A8F86B0";
const cUSDTokenAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";


function cUsdToWei(amount) {
    const amountInSmallestUnit = parseUnits(amount.toString(), 18);
    return amountInSmallestUnit;
}

async function getUserAddress() {
    let walletClient = createWalletClient({
        transport: custom(window.ethereum),
        chain: celoAlfajores,
    });
    let [address] = await walletClient.getAddresses();
    return [address];
}

async function checkCUSDBalance(address) {

    let StableTokenContract = getContract({
        abi: stableTokenABI,
        address: cUSDTokenAddress,
        publicClient,
    });
  
    let balanceInBigNumber = await StableTokenContract.read.balanceOf([
        address,
    ]);
  
    let balanceInWei = balanceInBigNumber.toString();
  
    let balanceInEthers = formatEther(balanceInWei);
  
    return balanceInEthers;
  }

async function claimReward(to, amount) {
    let walletClient = createWalletClient({
        transport: custom(window.ethereum),
        chain: celoAlfajores,
    });
    
   // const amountInWei = parseEther(amount);
    const amountInWei = cUsdToWei(amount);
    
    const tx = await walletClient.writeContract({
        address: rewardDistributorAddress,
        abi: RewardDistributorABI,
        functionName: "claimReward",
        account: to,
        args: [to, amountInWei]
    });

    alert(tx);

    let out={};

    out.tx=tx;
    // out.receipt = await publicClient.waitForTransactionReceipt({
    //     hash: tx,
    // });

    return out;
}

export default {
    getUserAddress,
    claimReward,
    checkCUSDBalance
};
