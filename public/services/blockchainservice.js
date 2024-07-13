import { createPublicClient, createWalletClient, custom, http,parseUnits, parseEther } from 'viem';
import { celoAlfajores } from 'viem/chains';
import RewardDistributorABI from '../abi/RewardDistributorABI.json';

const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http(),
});

const rewardDistributorAddress = "0xDa2eD4295a5b277E8cF9eeEE21F44C236A8F86B0";
const cUSDTokenAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

async function getUserAddress() {
    let walletClient = createWalletClient({
        transport: custom(window.ethereum),
        chain: celoAlfajores,
    });
    let [address] = await walletClient.getAddresses();
    return [address];
}

async function claimReward(to, amount) {
    let walletClient = createWalletClient({
        transport: custom(window.ethereum),
        chain: celoAlfajores,
    });
    alert(to); alert(amount); 
   // const amountInWei = parseEther(amount);
    const amountInWei = parseUnits(amount, 18);
    
    alert(amountInWei);

    const tx = await walletClient.writeContract({
        address: cUSDTokenAddress,
        abi: RewardDistributorABI,
        functionName: "claimReward",
        account: to,
        args: [rewardDistributorAddress, amountInWei],
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
    claimReward
};
