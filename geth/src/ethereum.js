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
web3.eth.personal.unlockAccount(owner_account, owner_password).then(success => {
  if (success) {
    console.log(">> Unlocked owner account.");
  } else {
    console.log(">> Failed to unlock owner account.");
  }
});

/*
  A user should use the command register to create his wallet.
 */
function register(username, new_id) {
  return web3.eth.personal.newAccount(default_password).then(address => {
    console.log(">> Account created: " + address);
    return address;
  }).then(address => ShiftCoin.methods.register(address, username, new_id).send({ from: owner_account, gas: 6721974 })
      .on("receipt", receipt => {
        if (!receipt.status) {
          console.log(">> Failed to register user. - transaction failed");
          return Promise.reject("registration failed.");
        }
      }).on("error", err => {
          console.log(">> Failed to register user. - transaction error");
          console.log(err.message);
      })
  );
}

/*
  Helper function to translate from username to wallet address.
 */
function getAddress(username) {
  return ShiftCoin.methods.addressOf(username).call().then((result, err) => {
    if (err || result === "0x0000000000000000000000000000000000000000") {
      return Promise.reject("username not found.");
    } else {
      return result;
    }
  });
}

/*
  A user should use the command ether to check how much ether he has.
 */
function getEtherBalance(address) {
    return web3.eth.getBalance(address).then(result => {
        return web3.utils.fromWei(result, 'ether');
    });
}

/*
  A user should use the command balance to check how many SC he has.
 */
function getBalance(address) {
    return ShiftCoin.methods.balanceOf(address).call().then((result, err) => {
        if (err) {
            return Promise.reject("failed to get balance.");
        } else {
            return result;
        }
    });
}

/*
  Helper function to check from a user_id if he is registered.
 */
function isRegistered(user_id) {
  return ShiftCoin.methods.registered(user_id).call().then((result, err) => {
    if (err) {
        return Promise.reject("failed to check if the user is registered.");
    } else {
      return result;
    }
  });
}

/*
  A user should use the command transfer with [user] [value] to transfer SC to a user.
 */
function transfer(from_address, to_address, value) {
  return web3.eth.personal.unlockAccount(from_address, default_password).then(success => {
    if (!success) {
      console.log(">> Failed to unlock account.");
      return Promise.reject("failed to unlock account");
    }
  }).then(tx => ShiftCoin.methods.transfer(to_address, value).send({ from: from_address, gas: 6721974  })
      .on("receipt", receipt => {
        if (!receipt.status) {
          console.log(">> Transfer failed - transaction failed");
          return Promise.reject("transfer failed");
        }
      }).on("error", err => {
          console.log(">> Transfer failed - transaction error");
          console.log(err.message);
      })
  );
}

/*
  This function subscribes events and prints every time a transfer is successful to this address.
 */
function watchTransfers(address, callback) {
  return ShiftCoin.events.Transfer({filter: {to: address}}, function(err, event) {
    if (err) {
      console.log(">> Failed to get event.");
      console.log(err.message);
    } else {
        callback({
            from: event.returnValues.from,
            to: event.returnValues.to,
            value: event.returnValues.value,
        });
    }
  });
}

export {transfer, getAddress, register, getEtherBalance, getBalance, watchTransfers}
