// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

error AddressIsZero(address token);

contract Exchange {
    address public tokenAddress;

    constructor(address _token) {
        if (_token == address(0)) {
            revert AddressIsZero(_token);
        }

        tokenAddress = _token;
    }

    function addLiquidity(uint256 _amount) public payable {
        IERC20 token = IERC20(tokenAddress);
        token.transferFrom(msg.sender, address(this), _amount);
    }

    function getReserve() public view returns (uint256) {
        IERC20 token = IERC20(tokenAddress);
        return token.balanceOf(address(this));
    }
}
