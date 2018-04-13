init:
	make start && sleep 10 && make create-account && make unlock-account && make start-mining

start:
	docker-compose up -d

stop:
	docker-compose stop

clean:
	docker-compose down && rm -rf ./tmp/*

console:
	docker exec -it ethereum_eth_1 geth attach /root/.ethereum/devchain/geth.ipc

logs:
	docker logs ethereum_eth_1 -f

open-netstats:
	google-chrome http://localhost:3000


create-account:
	docker exec -it ethereum_eth_1 geth --exec "personal.newAccount('password')" attach /root/.ethereum/devchain/geth.ipc

unlock-account:
	docker exec -it ethereum_eth_1 geth --exec "personal.unlockAccount(web3.eth.accounts[0], 'password')" attach /root/.ethereum/devchain/geth.ipc

start-mining:
	docker exec -it ethereum_eth_1 geth --exec "miner.start()" attach /root/.ethereum/devchain/geth.ipc

stop-mining:
	docker exec -it ethereum_eth_1 geth --exec "miner.stop()" attach /root/.ethereum/devchain/geth.ipc

transfer-ether:
	docker exec -it ethereum_eth_1 geth --exec "eth.sendTransaction({from:eth.accounts[0], to: \"$$ACCOUNT\", value: 25000000000000000})" attach /root/.ethereum/devchain/geth.ipc

get-balance-ether:
	docker exec -it ethereum_eth_1 geth --exec "eth.getBalance(\"$$ACCOUNT\")" attach /root/.ethereum/devchain/geth.ipc
