function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (window.innerWidth <= 768);
}

const sdkOptions = {
  dappMetadata: {
    name: 'GoldStory Token Purchase',
    url: window.location.href
  }
};

if (isMobileDevice()) {
  sdkOptions.extensionOnly = false;
  sdkOptions.openDeeplink = (link) => {
    window.open(link, '_self');
  };
} else {
  sdkOptions.extensionOnly = true;
}

const MMSDK = new MetaMaskSDK.MetaMaskSDK(sdkOptions);
let provider = MMSDK.getProvider();

async function connectWallet() {
  try {
    document.getElementById('connectBtn').disabled = true;

    if (isMobileDevice() && !window.ethereum) {
      const dappUrl = encodeURIComponent(window.location.href);
      const deepLink = `https://metamask.app.link/dapp/${dappUrl}`;
      
      document.getElementById('status').textContent = 'Redirecting to MetaMask mobile app...';
      
      setTimeout(() => {
        window.location.href = deepLink;
      }, 1000);
      
      return;
    }

    await MMSDK.connect();

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
      document.getElementById('status').textContent = 'Connection rejected by user';
    } else {
      console.error(err);
      document.getElementById('status').textContent = 'Connection failed. Please try again.';
    }
  } finally {
    document.getElementById('connectBtn').disabled = false;
  }
}

async function disconnectWallet() {
  try {
    if (provider && provider.disconnect) {
      await provider.disconnect();
    }
    
    document.getElementById('status').textContent = 'Not connected to MetaMask';
    document.getElementById('connectBtn').style.display = 'block';
    document.getElementById('disconnectBtn').style.display = 'none';
  } catch (err) {
    console.error('Disconnect failed:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!provider) {
    provider = MMSDK.getProvider();
  }

  const statusElement = document.getElementById('status');
  const connectBtn = document.getElementById('connectBtn');
  
  if (isMobileDevice() && !window.ethereum) {
    statusElement.textContent = 'Ready to connect via MetaMask mobile app';
    connectBtn.textContent = 'Open MetaMask App';
  } else {
    statusElement.textContent = 'Not connected to MetaMask';
    connectBtn.textContent = 'Connect MetaMask';
  }

  if (provider) {
    provider.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        statusElement.textContent = isMobileDevice() && !window.ethereum ? 
          'Ready to connect via MetaMask mobile app' : 
          'Not connected to MetaMask';
        document.getElementById('connectBtn').style.display = 'block';
        document.getElementById('disconnectBtn').style.display = 'none';
      } else {
        statusElement.textContent = `Connected: ${accounts[0]}`;
        document.getElementById('connectBtn').style.display = 'none';
        document.getElementById('disconnectBtn').style.display = 'block';
      }
    });
  }
});
