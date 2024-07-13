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

let stableTokenAbi = [];

// Function to load the ABI from the JSON file
async function loadAbi() {
  try {
    const response = await fetch('/abi/cusd-abi.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    stableTokenAbi = await response.json();
  } catch (error) {
    console.error("Error loading ABI:", error);
  }
}

// Load the ABI when the module is initialized
loadAbi();

const blockchainService = {
  client,
  requestTransfer: async (tokenAddress, receiverAddress, transferValue, tokenDecimals) => {
    // Ensure the ABI is loaded before attempting the transfer
    if (!stableTokenAbi.length) {
      await loadAbi();
    }

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
