# ShiftCoin

## Overview
This project is a blockchain backed prototype of ShiftCoins for the [ShiftAppens2018](https://shiftappens.com/) event. It allows you to deploy a private blockchain node, an ERC20 token smart-contract and a NodeJS server that receives commands from Slack and allows you to trade the ShiftCoin currency between users.

## Private ethereum cluster network
### Deploy local cluster
The ethereum scripts in the ethereum directory allow you to easily deploy a local private network. This network will run as docker containers.
Check the makefile for the most commun operations and examples commands on the javascript console on the node. The main commands are:

* `make init` - will start the network, create an account, unlock it and start mining. The mining rewards will be given to the created account.
* `make console` - will attach your terminal to the javascript/web3 console running in the node.
* `make stop` - will pause the containers.
* `make start` - will restart the containers.

### Monitoring
You can monitor your private netwokr through the netstats tool. When you create your network, go to 'localhost:3000' or `make open-netstats` to open the dashboard.

### Note
The ethereum node docker-compose configuration sets a `cpus: 2` cpu limit on the mining container. This will make the node mutch slower, but will keep your pc from frying. If you want to speed up the blockchain creation, or increase mining speed remove it.

## Application
### Local private node
In the geth directory you have the scripts to run a single ethereum private node which you can use for local development.

### NodeJS server
Also in the geth directory you have all the code you need to deploy a local NodeJS server that makes use of the Web3 library.
To run this server, make use of the regular npm commands, like `npm install` and `npm start`.
You can check the node code in the `src` directory.

## Smart Contract
The `smart-contract` directory is a truffle project which contains all the smart-contract code in solidity and the tools necessary to test it and deploy it. Take a look in particular to the `ShiftCoin.sol` file inside the contracts directory. It contais all the code you need to build the ERC20 token.
In order to compile and deploy this contract, take a look at the documentation for the truffle framework.

## Resources
### Private Network
This blog post will give you an introduction on running your own private network: https://hackernoon.com/heres-how-i-built-a-private-blockchain-network-and-you-can-too-62ca7db556c0

### Smart Contracts
In order to build and interact wil smart contracts you should use the [Truffle framework](https://github.com/trufflesuite/truffle). It will simplify the process of compiling and deploying smart contracts to the network.
Learn how write smart contracts through the [cryptozombies](https://cryptozombies.io/) tutorials.

### Token Standards
This post illustrates the creation of an ERC20 token using truffle: http://truffleframework.com/tutorials/robust-smart-contracts-with-openzeppelin
