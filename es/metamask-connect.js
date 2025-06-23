window.addEventListener("load", () => {
  // Ahora sí: MetaMaskSDK está disponible globalmente
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

  document.getElementById("connectBtn").onclick = async () => {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      document.getElementById("wallet").innerText = "Conectado: " + accounts[0];
    } catch (err) {
      console.error("Error al conectar", err);
      document.getElementById("wallet").innerText = "Error al conectar wallet";
    }
  };
});
