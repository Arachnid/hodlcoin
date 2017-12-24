pragma solidity ^0.4.10;

import 'zeppelin-solidity/contracts/token/StandardToken.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';

contract HODLCoin is StandardToken {
  using SafeMath for *;

  event Deposit(address indexed account, uint etherValue, uint tokenValue);
  event Withdrawal(address indexed account, uint etherValue, uint tokenValue);

  string constant public name = "HODLCoin";
  string constant public symbol = "HODL";
  uint8 constant public decimals = 18;

  uint8 constant DEPOSIT_FEE = 2; // In percent
  uint8 constant MULTIPLIER = 100; // HODL coins per ether

  /**
   * @dev Returns the value in wei of the specified number of HODL tokens.
   * @param amount The number of HODL tokens the value is for.
   * @return The value in wei of the tokens.
   */
  function value(uint amount) public view returns(uint) {
    return amount.mul(this.balance).div(totalSupply);
  }

  function deposit() public payable {
    uint amount;
    // Allocate tokens proportional to the deposit and the current token price
    if(totalSupply > 0) {
      amount = totalSupply.mul(msg.value).div(this.balance - msg.value);
      // Subtract deposit fee
      amount -= amount.mul(DEPOSIT_FEE).div(100);
    } else {
      amount = msg.value.mul(MULTIPLIER);
    }

    totalSupply = totalSupply.add(amount);
    balances[msg.sender] = balances[msg.sender].add(amount);
    Deposit(msg.sender, msg.value, amount);
  }

  function() public payable {
    deposit();
  }

  function withdraw(uint tokens) public {
    var amount = value(tokens);
    totalSupply = totalSupply.sub(tokens);
    balances[msg.sender] = balances[msg.sender].sub(tokens);
    msg.sender.transfer(amount);
    Withdrawal(msg.sender, amount, tokens);
  }
}
