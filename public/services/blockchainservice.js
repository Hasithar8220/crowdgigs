import { createPublicClient, createWalletClient, custom, getContract, http, parseEther, stringToHex } from 'viem';
import { celoAlfajores } from 'viem/chains';
import StableTokenABI from '../abi/cusd-abi.json';
import MinipayNFTABI from '../abi/minipay-nft.json';

const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http(),
});

const cUSDTokenAddress = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1'; // Testnet
const MINIPAY_NFT_CONTRACT = '0xE8F4699baba6C86DA9729b1B0a1DA1Bd4136eFeF'; // Testnet

const blockchainService = {
  address: null,

  getUserAddress: async function () {
    if (typeof window !== 'undefined' && window.ethereum) {
      let walletClient = createWalletClient({
        transport: custom(window.ethereum),
        chain: celoAlfajores,
      });

      let [address] = await walletClient.getAddresses();
      this.address = address;
      return address;
    }
  },

  sendCUSD: async function (to, amount) {
    let walletClient = createWalletClient({
      transport: custom(window.ethereum),
      chain: celoAlfajores,
    });

    let [address] = await walletClient.getAddresses();
    const amountInWei = parseEther(amount);

    const tx = await walletClient.writeContract({
      address: cUSDTokenAddress,
      abi: StableTokenABI.abi,
      functionName: 'transfer',
      account: address,
      args: [to, amountInWei],
    });

    let receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
    return receipt;
  },

  mintMinipayNFT: async function () {
    let walletClient = createWalletClient({
      transport: custom(window.ethereum),
      chain: celoAlfajores,
    });

    let [address] = await walletClient.getAddresses();

    const tx = await walletClient.writeContract({
      address: MINIPAY_NFT_CONTRACT,
      abi: MinipayNFTABI.abi,
      functionName: 'safeMint',
      account: address,
      args: [address, 'https://cdn-production-opera-website.operacdn.com/staticfiles/assets/images/sections/2023/hero-top/products/minipay/minipay__desktop@2x.a17626ddb042.webp'],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });
    return receipt;
  },

  getNFTs: async function () {
    let walletClient = createWalletClient({
      transport: custom(window.ethereum),
      chain: celoAlfajores,
    });

    const minipayNFTContract = getContract({
      abi: MinipayNFTABI.abi,
      address: MINIPAY_NFT_CONTRACT,
      client: publicClient,
    });

    const [address] = await walletClient.getAddresses();
    const nfts = await minipayNFTContract.read.getNFTsByAddress([address]);

    let tokenURIs = [];
    for (let i = 0; i < nfts.length; i++) {
      const tokenURI = await minipayNFTContract.read.tokenURI([nfts[i]]);
      tokenURIs.push(tokenURI);
    }
    return tokenURIs;
  },

  signTransaction: async function () {
    let walletClient = createWalletClient({
      transport: custom(window.ethereum),
      chain: celoAlfajores,
    });

    let [address] = await walletClient.getAddresses();

    const res = await walletClient.signMessage({
      account: address,
      message: stringToHex('Hello from Celo Composer MiniPay Template!'),
    });

    return res;
  },
};

export default blockchainService;
