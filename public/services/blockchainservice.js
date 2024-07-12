import { createWalletClient, custom, encodeFunctionData, parseUnits, createPublicClient, http } from 'viem';
import { celoAlfajores } from 'viem/chains';

// Initialize the wallet client
const client = createWalletClient({
  chain: celoAlfajores,
  transport: custom(window.ethereum)
});

const publicClient = createPublicClient({ 
  chain: celoAlfajores,
  transport: http()
});

// Define the ABI for the stable token
const stableTokenAbi = [
  // ... Add the ABI here
];

const blockchainService = {
  requestTransfer: async (tokenAddress, receiverAddress, transferValue, tokenDecimals) => {
    try {
      let hash = await client.sendTransaction({
        to: tokenAddress,
        data: encodeFunctionData({
          abi: stableTokenAbi,
          functionName: "transfer",
          args: [
            receiverAddress,
            parseUnits(`${Number(transferValue)}`, tokenDecimals),
          ],
        }),
        chain: celoAlfajores,
      });

      const transaction = await publicClient.waitForTransactionReceipt({
        hash,
      });

      return transaction.status === "success";
    } catch (error) {
      console.error("Transaction failed:", error);
      return false;
    }
  }
};

export default blockchainService;
