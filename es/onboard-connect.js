import Onboard from "https://unpkg.com/@web3-onboard/core@2.40.0/dist/esm/index.js";
import injectedModule from "https://unpkg.com/@web3-onboard/injected-wallets@2.8.3/dist/esm/index.js";

const injected = injectedModule();

const onboard = Onboard({
  wallets: [injected],
  chains: [
    {
      id: "0x1", // Ethereum Mainnet
      token: "ETH",
      label: "Ethereum",
      rpcUrl: "https://rpc.ankr.com/eth" // o tu RPC
    }
  ],
  appMetadata: {
    name: "Mi DApp Web",
    icon: "https://metamask.io/images/mm-logo.svg", // opcional
    description: "DApp usando Onboard sin extensión"
  }
});

document.getElementById("connectBtn").onclick = async () => {
  const connectedWallets = await onboard.connectWallet();

  if (connectedWallets.length > 0) {
    const address = connectedWallets[0].accounts[0].address;
    document.getElementById("wallet").innerText = "Conectado: " + address;

    // Aquí podrías abrir Transak si quieres:
    // window.open(`https://global.transak.com?walletAddress=${address}`, '_blank');
  }
};
