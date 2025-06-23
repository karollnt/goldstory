function waitForSDK(callback) {
  if (typeof MetaMaskSDK !== "undefined") {
    callback();
  } else {
    setTimeout(() => waitForSDK(callback), 50);
  }
}

waitForSDK(() => {
  const MMSDK = new MetaMaskSDK({
    dappMetadata: {
      name: "Mi DApp Web",
      url: window.location.href,
    },
    injectProvider: true,
    preferDesktop: false, // mostrará QR si no hay extensión
    headless: false,
  });

  const ethereum = MMSDK.getProvider();

  document.getElementById("connectBtn").onclick = async () => {
    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      document.getElementById("wallet").innerText = "Conectado: " + accounts[0];

      // ✅ Si quieres, aquí puedes abrir Transak o Uniswap automáticamente:
      // window.open(`https://global.transak.com?walletAddress=${accounts[0]}`, '_blank');
    } catch (err) {
      console.error("Error al conectar", err);
      document.getElementById("wallet").innerText = "Error al conectar wallet";
    }
  };
});
