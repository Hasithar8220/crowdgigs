import { createPublicClient, createWalletClient, custom, http, parseEther } from 'viem';
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

    const amountInWei = parseUnits(`${Number(amount)}`, 18);
    

    const tx = await walletClient.writeContract({
        address: rewardDistributorAddress,
        abi: RewardDistributorABI,
        functionName: "claimReward",
        account: walletClient.getAddresses()[0],
        args: [to, amountInWei],
    });

    let receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
    });

    return receipt.status;
}

export default {
    getUserAddress,
    claimReward
};
