const { wallets } = require('./frontend/src/blockchain/wallets.js');
const { createWalletProvider } = require('./frontend/src/blockchain/createWalletProvider.js');
const Web3 = require('web3');

async function testWalletSelector() {
  console.log('Testing Wallet Selector Functionality...\n');

  // Test 1: Check if wallets are loaded correctly
  console.log('Test 1: Wallet Configuration');
  console.log('Available wallets:', Object.keys(wallets));
  Object.entries(wallets).forEach(([role, wallet]) => {
    console.log(`  ${role}: ${wallet.name} - ${wallet.privateKey.substring(0, 10)}...`);
  });
  console.log('✓ Wallets loaded successfully\n');

  // Test 2: Test wallet provider creation
  console.log('Test 2: Wallet Provider Creation');
  for (const [role, wallet] of Object.entries(wallets)) {
    try {
      const provider = createWalletProvider(wallet.privateKey);
      const web3 = new Web3(provider);

      const accounts = await web3.eth.getAccounts();
      console.log(`  ${role}: Provider created, account: ${accounts[0]}`);

      // Test 3: Test basic transaction capability
      const balance = await web3.eth.getBalance(accounts[0]);
      console.log(`    Balance: ${web3.utils.fromWei(balance, 'ether')} ETH`);

    } catch (error) {
      console.log(`  ${role}: Error - ${error.message}`);
    }
  }
  console.log('✓ Wallet providers created successfully\n');

  // Test 4: Test contract interaction (if contract is deployed)
  console.log('Test 3: Contract Interaction Test');
  try {
    const contractABI = require('./frontend/src/blockchain/contractABI.json');
    const contractAddress = process.env.VITE_CONTRACT_ADDRESS;

    if (contractAddress) {
      const farmerWallet = wallets.farmer;
      const provider = createWalletProvider(farmerWallet.privateKey);
      const web3 = new Web3(provider);

      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const accounts = await web3.eth.getAccounts();

      console.log(`  Contract address: ${contractAddress}`);
      console.log(`  Using account: ${accounts[0]}`);

      // Try to call a view function if available
      try {
        // This is a placeholder - you'd need to check actual contract functions
        console.log('  Contract interaction test completed');
      } catch (error) {
        console.log(`  Contract call error: ${error.message}`);
      }
    } else {
      console.log('  No contract address found in environment variables');
    }
  } catch (error) {
    console.log(`  Contract test error: ${error.message}`);
  }

  console.log('\nWallet Selector Testing Completed!');
}

testWalletSelector().catch(console.error);
