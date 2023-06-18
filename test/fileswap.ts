import { ethers } from "hardhat"
import { utils, BigNumber, constants, Contract, ContractFactory } from "ethers"
import { assert, expect } from "chai"
import { FileSwap } from "../typechain-types"

let usdc: Contract
let matic: Contract
let klay: Contract
let usdt: Contract
let fileSwap: Contract
let deployer: any
let pairUSDCMATIC: Contract
let pairUSDCKLAY: Contract
let pairUSDCUSDT: Contract

const FreeERC20Artifact = require("../abi/FreeERC20.json")
const FileSwapArtifact = require("../abi/FileSwap.json")
const pairArtifact = require("@uniswap/v2-periphery/build/IUniswapV2Pair.json")

// USDC deployed to: 0x52735528D0a67be8123E4FaF16A493ff0381F21f
// MATIC deployed to: 0x664088Ef1D8C5B156B8c8e1d25029c46D700E607
// KLAY deployed to: 0x088D03b0bd3F644C12Eb10528e829372C3eA0E6c
// USDT deployed to: 0x7f45Ad397595B71A89967a4971794ae4d0168F02
// Router deployed to: 0x0DA082accb1ed8d86a071c8B5E69257f17a1Ef2E
// FileSwap deployed to: 0x08850172B72189c0f35C8a5C04C898f6a92d50e9
// Pair USDC/MATIC address: 0x6362D0b3963258BB76EEeAFf5188FA11b59837DA
// Pair USDC/KLAY address: 0xc439A004C25b918F10E39c44C2AfC8fbe931b0Ff
// Pair USDC/USDT address: 0x52b166D4D49f728E8A75c869355e01F76d188986

describe("FileSwap", () => {
  before(async () => {
    ;[deployer] = await ethers.getSigners()
    usdc = new Contract("0x52735528D0a67be8123E4FaF16A493ff0381F21f", FreeERC20Artifact.abi, deployer)
    matic = new Contract("0x664088Ef1D8C5B156B8c8e1d25029c46D700E607", FreeERC20Artifact.abi, deployer)
    klay = new Contract("0x088D03b0bd3F644C12Eb10528e829372C3eA0E6c", FreeERC20Artifact.abi, deployer)
    usdt = new Contract("0x7f45Ad397595B71A89967a4971794ae4d0168F02", FreeERC20Artifact.abi, deployer)
    fileSwap = new Contract("0x68Cc2F54D7d40e3CC910B3eE4C549E1b073a22C8", FileSwapArtifact.abi, deployer)
    pairUSDCMATIC = new Contract("0x6362D0b3963258BB76EEeAFf5188FA11b59837DA", pairArtifact.abi, deployer)
    pairUSDCKLAY = new Contract("0xc439A004C25b918F10E39c44C2AfC8fbe931b0Ff", pairArtifact.abi, deployer)
    pairUSDCUSDT = new Contract("0x52b166D4D49f728E8A75c869355e01F76d188986", pairArtifact.abi, deployer)
  })
  it.skip("pays tokens", async () => {
    console.log("------------------ pays tokens ------------------")

    console.log("ETH Balance", utils.formatEther(await deployer.getBalance()))
    console.log("Matic Balance", utils.formatEther(await matic.balanceOf(deployer.address)))
    console.log("KLAY Balance", utils.formatEther(await klay.balanceOf(deployer.address)))
    console.log("USDT Balance", utils.formatEther(await usdt.balanceOf(deployer.address)))

    // ------------------ Stake ------------------

    console.log("stake happens")
    console.log("deployer before USDC Balance", utils.formatEther(await usdc.balanceOf(deployer.address)))
    await matic.approve(fileSwap.address, constants.MaxUint256)
    await klay.approve(fileSwap.address, constants.MaxUint256)
    await usdt.approve(fileSwap.address, constants.MaxUint256)

    const tx = await fileSwap.stake([matic.address, klay.address, usdt.address], [utils.parseEther("17"), utils.parseEther("35"), utils.parseEther("20")], {
      gasLimit: 10000000,
    })
    await tx.wait()

    console.log("FileSwap MATIC Balance", utils.formatEther(await matic.balanceOf(fileSwap.address)))
    console.log("FileSwap KLAY Balance", utils.formatEther(await klay.balanceOf(fileSwap.address)))
    console.log("FileSwap USDT Balance", utils.formatEther(await usdt.balanceOf(fileSwap.address)))

    console.log("deployer after USDC Balance", utils.formatEther(await usdc.balanceOf(deployer.address)))

    const reserveUSDCMATIC = await pairUSDCMATIC.getReserves()
    console.log("USDC/MATIC reserves:", reserveUSDCMATIC)

    const reserveUSDCKLAY = await pairUSDCKLAY.getReserves()
    console.log("USDC/KLAY reserves:", reserveUSDCKLAY)

    const reserveUSDCUSDT = await pairUSDCUSDT.getReserves()
    console.log("USDC/USDT reserves:", reserveUSDCUSDT)
  })
  it("filecoin expenses paid", async () => {
    console.log("balance usdc before", utils.formatEther(await fileSwap._balancesUSDC(deployer.address)))
    // const tx = await fileSwap.fileCoinExpensesPaid(
    //   deployer.address,
    //   utils.parseEther("10")
    // )
    // await tx.wait()

    const fileCoinExpensePaid = await fileSwap.fileCoinExpensesPaid(deployer.address, utils.parseEther("10"), {
      gasLimit: 10000000,
    })
    await fileCoinExpensePaid.wait()

    console.log("balance usdc after", utils.formatEther(await fileSwap._balancesUSDC(deployer.address)))
  })
})
