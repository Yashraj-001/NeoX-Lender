const Web3 = require('web3');
const contractABI = require('./build/contracts/Lender.json').abi;

const web3 = new Web3('http://localhost:8545');  // Adjust to the correct network

const contractAddress = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';
const lenderContract = new web3.eth.Contract(contractABI, contractAddress);

async function interact() {
  const accounts = await web3.eth.getAccounts();
  
  // Call the lend function
  await lenderContract.methods.lend().send({ from: accounts[0], value: web3.utils.toWei('1', 'ether') });

  // Get the balance
  const balance = await lenderContract.methods.getBalance().call({ from: accounts[0] });
  console.log(`Balance: ${web3.utils.fromWei(balance, 'ether')} ETH`);
}

interact();
