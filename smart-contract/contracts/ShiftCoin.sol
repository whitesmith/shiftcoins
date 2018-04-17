pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract ShiftCoin is StandardToken, Ownable {
    string public name = 'ShiftCoin';
    string public symbol = 'SC';
    uint8 public decimals = 0;
    uint public INITIAL_SUPPLY = 50;

    mapping (string => address) player_map;
    mapping (string => bool) players;

    function ShiftCoin() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
    }

    function register(address new_address, string username, string user_id) public onlyOwner {
        require(players[user_id] == false);
        players[user_id] = true;
        player_map[username] = new_address;
        balances[new_address] = 1;
        new_address.send(1 ether);
    }

    function addressOf(string _player) public view returns (address _address) {
        return player_map[_player];
    }

    function registered(string _player) public view returns (bool) {
        return players[_player];
    }

    function addEth () public payable {}
}
