// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./interfaces/utils/IERC20.sol";
import "./interfaces/uniswapv2/IUniswapV2Router02.sol";
import "hardhat/console.sol";

contract FileSwap {
    enum Tokens {
        ETH,
        BNB,
        USDT,
        BUSD,
        DAI,
        USDC
    }

    IERC20 private immutable usdc;
    IUniswapV2Router02 private immutable uniswapV2Router;
    address private OWNER;

    mapping(address => mapping(address => uint256)) public _balances;
    mapping(address => uint256) public _balancesUSDC;

    constructor(address _usdc, address _uniswapV2Router) {
        usdc = IERC20(_usdc);
        uniswapV2Router = IUniswapV2Router02(_uniswapV2Router);
        OWNER = msg.sender;
    }

    function stake(address[] memory _tokens, uint256[] memory _amounts) external payable {
        console.log("Hello, world!");
        require(_tokens.length == _amounts.length, "Invalid input");
        for (uint256 i = 0; i < _tokens.length; i++) {
            if (_tokens[i] == address(0)) {
                require(msg.value == _amounts[i], "Invalid amount");
            } else {
                require(msg.value == 0, "Invalid amount");
                require(_tokens[i] != address(0), "Invalid token");
                require(_amounts[i] > 0, "Invalid amount");
                require(_amounts[i] <= IERC20(_tokens[i]).balanceOf(msg.sender), "Insufficient balance");
                require(IERC20(_tokens[i]).transferFrom(msg.sender, address(this), _amounts[i]), "Transfer failed");

                _balances[msg.sender][_tokens[i]] += _amounts[i];

                IERC20(_tokens[i]).approve(address(uniswapV2Router), _amounts[i]);
                if (_tokens[i] != address(usdc)) {
                    address[] memory path = new address[](2);
                    path[0] = _tokens[i];
                    path[1] = address(usdc);
                    uint256[] memory amounts = uniswapV2Router.swapExactTokensForTokens(_amounts[i], 0, path, address(this), block.timestamp);
                    _balancesUSDC[msg.sender] += amounts[1];
                } else {
                    _balancesUSDC[msg.sender] += _amounts[i];
                }
            }
        }
    }

    function fileCoinExpensesPaid(address _user, uint _amount) external {
        require(_amount <= _balancesUSDC[_user], "Insufficient balance");
        _balancesUSDC[_user] -= _amount;
    }

    modifier onlyOwner() {
        require(msg.sender == address(0), "Only owner");
        _;
    }

    function withdraw(address _token, uint256 _amount) external onlyOwner {
        require(_amount <= IERC20(_token).balanceOf(address(this)), "Insufficient balance");
        require(IERC20(_token).transfer(msg.sender, _amount), "Transfer failed");
    }

    function changeOwner(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        require(_newOwner != OWNER, "Already owner");
        OWNER = _newOwner;
    }
}
