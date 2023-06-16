// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IExchange {
    function ethToTokenSwap(
        uint256 minTokens
    ) external payable returns (uint256);

    function ethToTokenTransfer(
        uint256 minTokens,
        address recipient
    ) external payable returns (uint256);
}
