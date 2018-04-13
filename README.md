# ShiftCoin

# Private ethereum network
The ethereum scripts in the ethereum directory allow you to easily deploy a local private network. This network will run as docker containers.
Check the makefile for the most commun operations and examples commands on the javascript console on the node. The main commands are:

* `make init` - will start the network, create an account, unlock it and start mining. The mining rewards will be given to the created account.
* `make console` - will attach your terminal to the javascript/web3 console running in the node.
* `make stop` - will pause the containers.
* `make start` - will restart the containers.

## Monitoring
You can monitor your private netwokr through the netstats tool. When you create your network, go to 'localhost:3000' or `make open-netstats` to open the dashboard.

## Note
The ethereum node docker-compose configuration sets a `cpus: 1` cpu limit on the mining container. This will make the node mutch slower, but will keep your pc from frying. If you want to speed up the blockchain creation, or increase mining speed remove it.

## Resources
This blog post will give you an introduction on running your own private network: https://hackernoon.com/heres-how-i-built-a-private-blockchain-network-and-you-can-too-62ca7db556c0

# Smart Contracts
In order to build and interact wil smart contracts you should use the [Truffle framework](https://github.com/trufflesuite/truffle). It will simplify the process of compiling and deploying smart contracts to the network.

## Resources
This post illustrates the creation of an ERC20 token using truffle: http://truffleframework.com/tutorials/robust-smart-contracts-with-openzeppelin