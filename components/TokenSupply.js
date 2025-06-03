// Requires ethers.js to be loaded in your HTML before this script

const ERC20_ABI = [
  "function totalSupply() view returns (uint256)",
  "function decimals() view returns (uint8)"
];

const TOKEN_ADDRESS = "0x9c2Cd31784ffD13350058Ac199f884bb166cE41C";
const POLYGON_RPC = "https://polygon-rpc.com";

// Fetch token price in USD from GeckoTerminal API (DEX price aggregator)
async function fetchTokenPriceUSD() {
  const GECKOTERMINAL_API_URL = `https://api.geckoterminal.com/api/v2/networks/polygon_pos/tokens/${TOKEN_ADDRESS.toLowerCase()}`;
  try {
    const response = await fetch(GECKOTERMINAL_API_URL, {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    });
    if (!response.ok) {
      console.error("GeckoTerminal API error:", response.status, response.statusText);
      return null;
    }
    const data = await response.json();
    // Get price in USD from the API response
    const price = Number(data?.data?.attributes?.price_usd);
    if (!isNaN(price) && price > 0) {
      return price;
    } else {
      console.warn("Token not listed or no USD price available on GeckoTerminal for", TOKEN_ADDRESS.toLowerCase());
      return null;
    }
  } catch (e) {
    console.error("Error fetching token price from GeckoTerminal:", e);
    return null;
  }
}

async function displayTokenSupply() {
  try {
    const provider = new ethers.JsonRpcProvider(POLYGON_RPC);
    const contract = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, provider);
    const [rawSupply, decimals] = await Promise.all([
      contract.totalSupply(),
      contract.decimals()
    ]);
    const formatted = ethers.formatUnits(rawSupply, decimals);

    const priceUSD = await fetchTokenPriceUSD();

    if (priceUSD !== null) {
      const totalUSD = (parseFloat(formatted) * priceUSD).toLocaleString(undefined, { style: "currency", currency: "USD" });
      document.querySelector(".js-token-supply-usd").textContent = totalUSD;
      document.querySelector(".js-token-price-usd").textContent = priceUSD.toLocaleString(undefined, { style: "currency", currency: "USD" });
    } else {
      document.querySelector(".js-token-supply-usd").textContent = "Not listed on GeckoTerminal";
      document.querySelector(".js-token-price-usd").textContent = "-";
    }
  } catch (err) {
    console.error("Error fetching token supply or price:", err);
    document.querySelector(".js-token-supply-usd").textContent = "Error";
    document.querySelector(".js-token-price-usd").textContent = "Error";
  }
}

window.addEventListener("DOMContentLoaded", displayTokenSupply);
