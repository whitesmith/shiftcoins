/*
  RUN OFF NODE
 */
// geth attach
web3.personal.newAccount('password')
web3.personal.unlockAccount(web3.eth.accounts[0], 'password');
miner.start()

//  truffle console
ShiftCoin.deployed().then(inst => { ShiftCoinInstance = inst })
ShiftCoinInstance.addEth.sendTransaction({from: web3.eth.accounts[0], to: ShiftCoinInstance.address, value: web3.toWei(10, 'ether')});
web3.fromWei(web3.eth.getBalance(ShiftCoinInstance.address), "ether");


/*
  Bootstrap Node
 */
const Web3 = require('web3');
const net = require('net');

// connect to the blockchain network
const ipc = "/home/pmdcosta/Workspace/src/github.com/pmdcosta/shiftcoins/geth/chaindata/geth.ipc";
const web3 = new Web3(ipc, net);

// Create contract instance
const contract_abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"INITIAL_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"previousOwner","type":"address"},{"indexed":true,"name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":false,"inputs":[],"name":"addEth","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"new_address","type":"address"},{"name":"username","type":"string"},{"name":"user_id","type":"string"}],"name":"register","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_player","type":"string"}],"name":"addressOf","outputs":[{"name":"_address","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_player","type":"string"}],"name":"registered","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"}];
const contract_address = "0x94f0a4bc878221acee813d743de343ec5a128911";
let ShiftCoin = new web3.eth.Contract(contract_abi, contract_address);

// Set admin account
const password = 'password';
const admin_account = "0x0fb34ae629f435ab02ffca179a1942d6ddaf05cb";
web3.eth.defaultAccount = admin_account;


/*
  Register new user
 */
let new_username = "pmdcosta";
let new_id = "0";

web3.eth.personal.newAccount(password).then(function(new_address){
    console.log("New Account: " + new_address);
    return new_address
  }).then(function(new_address){
    web3.eth.personal.unlockAccount(admin_account, password).then(function(success){
        if (success) {
          console.log("Unlocked admin account");
        } else {
          console.log("Failed to unlock admin account")
        }
        return new_address
      }).then(function(new_address){
      ShiftCoin.methods.register(new_address, new_username, new_id).send({ from: admin_account, gas: 90000000 }).on("receipt", function(receipt) {
        if (receipt.status) {
          console.log("OK");
        } else {
          console.log("FAILED");
        }
      }).on("error", function(error) {
        console.log("Error: " + error);
      });
      })
  });

// Call addressOf
ShiftCoin.methods.addressOf(new_username).call(function(error, result){
  console.log(result);
});

// Call Registered
ShiftCoin.methods.registered(new_id).call(function(error, result){
  console.log(result);
});


/*
  Check ether balance
 */
web3.eth.getBalance(new_address, function (error, result) {
  if (error) {
    console.log(error);
  } else {
    console.log(web3.utils.fromWei(result, 'ether'));
  }
})


/*
  Check Shiftcoin Balance
 */
ShiftCoin.methods.balanceOf(new_address).call(function(error, result){
  console.log(result);
});


/*
  Make a Shiftcoin transfer
 */
web3.eth.personal.unlockAccount(new_address, password).then(function(success){
  if (success) {
    console.log("Unlocked account");
  } else {
    console.log("Failed to unlock account")
  }
  return new_address
}).then(function(new_address){
  ShiftCoin.methods.transfer(admin_account, 1).send({ from: new_address, gas: 900000  }).on("receipt", function(receipt) {
    if (receipt.status) {
      console.log("OK");
    } else {
      console.log("FAILED");
    }
  }).on("error", function(error) {
    console.log("Error: " + error);
  })
});


/*
  Watch transfer events
 */
ShiftCoin.events.Transfer({
  filter: {to: new_address},
}, function(error, event){
  console.log("From: " + event.returnValues.from);
  console.log("To: " + event.returnValues.to);
  console.log("Value: " + event.returnValues.value);
})
