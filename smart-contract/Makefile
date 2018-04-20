install:
	npm install -g truffle && npm install zeppelin-solidity

compile:
	truffle compile

start-dev:
	ganache-cli -p 7545

deploy-dev:
	truffle migrate --reset --network development

console-dev:
	truffle console --network development

deploy-stage:
	truffle migrate --reset --network stage

console-stage:
	truffle console --network stage
