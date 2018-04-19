import Web3 from 'web3'
import config from './config'
/* connect through IPC instead of http */
//const net = require('net');
//const web3 = new Web3(config.network.ipc, net);

// connect to the blockchain network
const web3 = new Web3(config.network.host);

// Create contract instance
let ShiftCoin = new web3.eth.Contract(config.contract.abi, config.contract.address);

// Set owner/default account
const owner_account = config.owner.address;
const owner_password = config.owner.password;
const default_password = config.default_password;
web3.eth.defaultAccount = owner_account;

// Unlock owner account
web3.eth.personal.unlockAccount(owner_account, owner_password).then(function(success) {
  if (success) {
    console.log("Unlocked owner account");
  } else {
    console.log("Failed to unlock owner account")
  }
})

/*
  A user should use the command register to create his wallet.
 */
function register(new_username, new_id) {
  return web3.eth.personal.newAccount(default_password).then(function(new_address){
    console.log("Account created: " + new_address);
    return new_address
  }).then(function(new_address){
    ShiftCoin.methods.register(new_address, new_username, new_id)
      .send({ from: owner_account, gas: 90000000 })
      .on("receipt", function(receipt) {
        if (receipt.status) {
          console.log("OK");
          return new_address
        } else {
          console.log("FAILED");
          throw 'failed_to_register';
        }
    }).on("error", function(error) {
      console.log("ERROR: " + error);
      throw 'failed_to_register';
    });
  })
}

/*
  Helper function to translate from username to wallet address.
 */
function getAddress(username) {
  return ShiftCoin.methods.addressOf(username).call(function(error, result){
    if (error) {
      console.log(error);
      throw 'failed_to_get_address';
    } else {
      console.log(result);
      return result;
    }
  });
}

/*
  Helper function to check from a user_id if he is registered.
  Not very helpful...
 */
function isRegistered(user_id) {
  return ShiftCoin.methods.registered(user_id).call(function(error, result){
    if (error) {
      console.log(error);
      throw 'failed_to_check_registered';
    } else {
      console.log(result);
      return result;
    }
  });
}

/*
  A user should use the command balance to check how many SC he has.
 */
function getBalance(address) {
  return ShiftCoin.methods.balanceOf(new_address).call(function(error, result){
    if (error) {
      console.log(error);
      throw 'failed_to_get_balance';
    } else {
      console.log(result);
      return result;
    }
  });
}

/*
  A user should use the command ether to check how much ether he has.
  We probably wont use this.
 */
function getEtherBalance(address) {
  return web3.eth.getBalance(address).then(result => {
      return web3.utils.fromWei(result, 'ether');
  });
}

/*
  A user should use the command transfer with [user] [value] to transfer SC to a user.
  The username should be translated to the users wallet address using the getAddress function.
 */
function transfer(from_address, to_address, value) {
  return web3.eth.personal.unlockAccount(from_address, password).then(function(success) {
    if (success) {
      console.log("Unlocked account");
    } else {
      console.log("Failed to unlock account")
      throw 'failed_to_unlock_account';
    }
    return success
  }).then(function(success) {
    ShiftCoin.methods.transfer(to_address, value).send({ from: from_address, gas: 900000  }).on("receipt", function(receipt) {
      if (receipt.status) {
        console.log("OK");
      } else {
        console.log("FAILED");
        throw 'failed_to_transfer_shiftcoins';
      }
    }).on("error", function(error) {
      console.log("ERROR: " + error);
      throw 'failed_to_transfer_shiftcoins';
    })
  });
}

/*
  This function subscribes events and prints every time a transfer is successful to this address.
  I think we should leave this as a nice to have for now.
 */
function watchTransfers(address) {
  return ShiftCoin.events.Transfer({
    filter: {to: address},
  }, function(error, event){
    let e = {
      from: event.returnValues.from,
      to: event.returnValues.to,
      value: event.returnValues.value,
    }
    console.log(e);
    return e;
  })
}

export {transfer, getAddress, register, getEtherBalance}