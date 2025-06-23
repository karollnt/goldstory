window.addEventListener("load", () => {
  const MMSDK = new MetaMaskSDK.MetaMaskSDK({
    dappMetadata: {
      name: "Mi DApp Web",
      url: window.location.href,
    },
    injectProvider: true,
    preferDesktop: false,
    headless: false,
  });

  const ethereum = MMSDK.getProvider();

  const connectBtn = document.getElementById("connectBtn");
  const walletDiv = document.getElementById("wallet");

  connectBtn.onclick = async () => {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      walletDiv.innerText = "Conectado: " + accounts[0];
    } catch (err) {
      console.error("No se pudo conectar a MetaMask", err);
      walletDiv.innerText = "Error al conectar wallet";
    }
  };
});
