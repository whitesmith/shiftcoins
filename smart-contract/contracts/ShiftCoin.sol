pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract ShiftCoin is StandardToken {
	string public name = 'ShiftCoin';
	string public symbol = 'SC';
	uint8 public decimals = 0;
	uint public INITIAL_SUPPLY = 500;

	function ShiftCoin() public {
		totalSupply_ = INITIAL_SUPPLY;
		balances[msg.sender] = INITIAL_SUPPLY;
	}

}