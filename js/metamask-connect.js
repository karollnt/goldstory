const MMSDK = new MetaMaskSDK.MetaMaskSDK({
  dappMetadata: {
    name: 'Example Pure JS Dapp',
    url: window.location.href
  }
});
let provider = MMSDK.getProvider();

async function connectWallet() {
  try {
    MMSDK.connect();
    document.getElementById('connectBtn').disabled = true;

    const accounts = await provider.request({
      method: 'eth_requestAccounts'
    });

    const account = accounts[0];
    console.log('Connected:', account);

    document.getElementById('status').textContent = `Connected: ${account}`;
    document.getElementById('connectBtn').style.display = 'none';
    document.getElementById('disconnectBtn').style.display = 'block';
  } catch (err) {
    if (err.code === 4001) {
      console.log('User rejected connection');
    } else {
      console.error(err);
    }
  } finally {
    document.getElementById('connectBtn').disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!provider) {
    provider = MMSDK.getProvider();
  }

  provider.on('accountsChanged', (accounts) => {
    if (accounts.length === 0) {
      document.getElementById('status').textContent = 'Not connected';
      document.getElementById('connectBtn').style.display = 'block';
      document.getElementById('disconnectBtn').style.display = 'none';
    } else {
      document.getElementById('status').textContent = `Connected: ${accounts[0]}`;
    }
  });
});
