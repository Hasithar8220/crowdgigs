import { createWalletClient, custom, parseUnits, createPublicClient, http } from 'viem';
import { celoAlfajores } from 'viem/chains';
import StableTokenABI from '../abi/cusd-abi.json';

// Initialize the public client
const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(),
});

// Initialize the wallet client
const walletClient = createWalletClient({
  chain: celoAlfajores,
  transport: custom(window.ethereum)
});

const cUSDTokenAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

const blockchainService = {
  address: null,

  async getUserAddress() {
    const [address] = await walletClient.getAddresses();
    this.address = address;
    return address;
  },

  async sendCUSD(to, amount) {
    const amountInWei = parseUnits(amount, 18);

    alert(to); alert(amount); alert(amountInWei); alert(StableTokenABI);

    const tx = await walletClient.writeContract({
      address: cUSDTokenAddress,
      abi: StableTokenABI.abi,
      functionName: "transfer",
      account: to,
      args: [to, amountInWei],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
    return receipt.status === "success";
  }
};

export default blockchainService;
