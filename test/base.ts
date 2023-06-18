import { ethers } from "hardhat"
import { utils, BigNumber, constants, Contract, ContractFactory } from "ethers"
import { assert, expect } from "chai"
import { FileSwap } from "../typechain-types"

let usdc: Contract
let matic: Contract
let klay: Contract
let usdt: Contract
let fileSwap: FileSwap
let deployer: any
let pairAddressUSDCMATIC: string
let pairAddressUSDCKLAY: string
let pairAddressUSDCUSDT: string
let pairUSDCMATIC: Contract
let pairUSDCKLAY: Contract
let pairUSDCUSDT: Contract

describe("FileSwap", () => {
  before(async () => {
    ;[deployer] = await ethers.getSigners()

    const tokenFactory = await ethers.getContractFactory("FreeERC20")
    usdc = await tokenFactory.deploy("USDC", "USDC")
    await usdc.deployed()
    console.log("USDC deployed to:", usdc.address)

    await usdc.mint(deployer.address, utils.parseEther("10000"))

    // ------------------ deploy tokens ------------------

    matic = await tokenFactory.deploy("MATIC", "MATIC")
    await matic.deployed()
    console.log("MATIC deployed to:", matic.address)

    klay = await tokenFactory.deploy("KLAY", "KLAY")
    await klay.deployed()
    console.log("KLAY deployed to:", klay.address)

    usdt = await tokenFactory.deploy("USDT", "USDT")
    await usdt.deployed()
    console.log("USDT deployed to:", usdt.address)

    // ------------------ mint tokens ------------------

    await matic.mint(deployer.address, utils.parseEther("10000"))
    await klay.mint(deployer.address, utils.parseEther("10000"))
    await usdt.mint(deployer.address, utils.parseEther("10000"))

    // ------------------ show deployer bal ------------------

    const usdcBal = await usdc.balanceOf(deployer.address)
    console.log("USDC balance:", utils.formatEther(usdcBal))

    const maticBal = await matic.balanceOf(deployer.address)
    console.log("MATIC balance:", utils.formatEther(maticBal))

    const klayBal = await klay.balanceOf(deployer.address)
    console.log("KLAY balance:", utils.formatEther(klayBal))

    const usdtBal = await usdt.balanceOf(deployer.address)
    console.log("USDT balance:", utils.formatEther(usdtBal))

    // ------------------ uniswapv2 tokens ------------------

    const factoryArtifact = require("@uniswap/v2-core/build/UniswapV2Factory.json")
    const routerArtifact = require("@uniswap/v2-periphery/build/UniswapV2Router02.json")
    const pairArtifact = require("@uniswap/v2-periphery/build/IUniswapV2Pair.json")

    const WETH9 = require("../scripts/WETH9.json")

    const Factory = new ContractFactory(
      factoryArtifact.abi,
      factoryArtifact.bytecode,
      deployer
    )
    const factory = await Factory.deploy(deployer.address)
    console.log("Factory deployed to:", factory.address)

    // ------------------ create pairs ------------------

    const tx1 = await factory.createPair(usdc.address, matic.address)
    await tx1.wait()
    pairAddressUSDCMATIC = await factory.getPair(usdc.address, matic.address)
    console.log("Pair USDC/MATIC address:", pairAddressUSDCMATIC)

    const tx2 = await factory.createPair(usdc.address, klay.address)
    await tx2.wait()
    pairAddressUSDCKLAY = await factory.getPair(usdc.address, klay.address)
    console.log("Pair USDC/KLAY address:", pairAddressUSDCKLAY)

    const tx3 = await factory.createPair(usdc.address, usdt.address)
    await tx3.wait()
    pairAddressUSDCUSDT = await factory.getPair(usdc.address, usdt.address)
    console.log("Pair USDC/USDT address:", pairAddressUSDCUSDT)

    pairUSDCMATIC = new Contract(
      pairAddressUSDCMATIC,
      pairArtifact.abi,
      deployer
    )
    pairUSDCKLAY = new Contract(pairAddressUSDCKLAY, pairArtifact.abi, deployer)
    pairUSDCUSDT = new Contract(pairAddressUSDCUSDT, pairArtifact.abi, deployer)

    const Weth = new ContractFactory(WETH9.abi, WETH9.bytecode, deployer)
    const weth = await Weth.deploy()
    console.log("WETH deployed to:", weth.address)

    const Router = new ContractFactory(
      routerArtifact.abi,
      routerArtifact.bytecode,
      deployer
    )
    const router = await Router.deploy(factory.address, weth.address)
    console.log("Router deployed to:", router.address)

    // ------------------ fileswap deploy ------------------

    const FileSwap = await ethers.getContractFactory("FileSwap")
    fileSwap = await FileSwap.deploy(usdc.address, router.address)
    await fileSwap.deployed()
    console.log("FileSwap deployed to:", fileSwap.address)

    // ------------------ approve tokens ------------------

    const approve1 = await usdc.approve(router.address, constants.MaxUint256)
    await approve1.wait()

    const approve2 = await matic.approve(router.address, constants.MaxUint256)
    await approve2.wait()

    const approve3 = await klay.approve(router.address, constants.MaxUint256)
    await approve3.wait()

    const approve4 = await usdt.approve(router.address, constants.MaxUint256)
    await approve4.wait()

    // ------------------ add liquidity ------------------

    const addLiquidityUSDCMATIC = await router.addLiquidity(
      usdc.address,
      matic.address,
      utils.parseEther("200"),
      utils.parseEther("170"),
      0,
      0,
      deployer.address,
      constants.MaxUint256
    )
    await addLiquidityUSDCMATIC.wait()

    const reserveUSDCMATIC = await pairUSDCMATIC.getReserves()
    console.log("USDC/MATIC reserves:", reserveUSDCMATIC)

    const addLiquidityUSDCKLAY = await router.addLiquidity(
      usdc.address,
      klay.address,
      utils.parseEther("50"),
      utils.parseEther("350"),
      0,
      0,
      deployer.address,
      constants.MaxUint256
    )
    await addLiquidityUSDCKLAY.wait()

    const reserveUSDCKLAY = await pairUSDCKLAY.getReserves()
    console.log("USDC/KLAY reserves:", reserveUSDCKLAY)

    const addLiquidityUSDCUSDT = await router.addLiquidity(
      usdc.address,
      usdt.address,
      utils.parseEther("200"),
      utils.parseEther("200"),
      0,
      0,
      deployer.address,
      constants.MaxUint256
    )
    await addLiquidityUSDCUSDT.wait()

    const reserveUSDCUSDT = await pairUSDCUSDT.getReserves()
    console.log("USDC/USDT reserves:", reserveUSDCUSDT)
  })
  it("pays tokens", async () => {
    console.log("------------------ pays tokens ------------------")

    console.log("ETH Balance", utils.formatEther(await deployer.getBalance()))
    console.log(
      "Matic Balance",
      utils.formatEther(await matic.balanceOf(deployer.address))
    )
    console.log(
      "KLAY Balance",
      utils.formatEther(await klay.balanceOf(deployer.address))
    )
    console.log(
      "USDT Balance",
      utils.formatEther(await usdt.balanceOf(deployer.address))
    )

    console.log(
      "USDC Balance",
      utils.formatEther(await usdc.balanceOf(deployer.address))
    )

    console.log(
      "Filecoin USDC Balance Before",
      utils.formatEther(await usdc.balanceOf(fileSwap.address))
    )

    await matic.approve(fileSwap.address, constants.MaxUint256)
    await klay.approve(fileSwap.address, constants.MaxUint256)
    await usdt.approve(fileSwap.address, constants.MaxUint256)

    const tx = await fileSwap.stake(
      [matic.address, klay.address, usdt.address],
      [utils.parseEther("17"), utils.parseEther("35"), utils.parseEther("20")],
      {
        gasLimit: 1000000,
      }
    )
    await tx.wait()

    console.log(
      "Filecoin USDC Balance After",
      utils.formatEther(await usdc.balanceOf(fileSwap.address))
    )

    const reserveUSDCMATIC = await pairUSDCMATIC.getReserves()
    console.log("USDC/MATIC reserves:", reserveUSDCMATIC)

    const reserveUSDCKLAY = await pairUSDCKLAY.getReserves()
    console.log("USDC/KLAY reserves:", reserveUSDCKLAY)

    const reserveUSDCUSDT = await pairUSDCUSDT.getReserves()
    console.log("USDC/USDT reserves:", reserveUSDCUSDT)

    console.log(
      "balances mapping matic",
      await fileSwap._balances(deployer.address, matic.address)
    )
    console.log(
      "balances mapping klay",
      await fileSwap._balances(deployer.address, klay.address)
    )
    console.log(
      "balances mapping usdt",
      await fileSwap._balances(deployer.address, usdt.address)
    )
    console.log(
      "balances mapping usdc",
      await fileSwap._balancesUSDC(deployer.address)
    )

    // ------------------ fileCoinExpensePaid ------------------

    const fileCoinExpensePaid = await fileSwap.fileCoinExpensesPaid(
      deployer.address,
      utils.parseEther("10")
    )
    await fileCoinExpensePaid.wait()

    console.log(
      "balances mapping usdc after file coin expense paid",
      await fileSwap._balancesUSDC(deployer.address)
    )
  })
})

// 20 usdt = 20 usdc
// 17 matic  = 20 usdc
// 35 klay = 5 usdc

// Stake(address[] memory _tokens, uint256[] memory _amounts)
