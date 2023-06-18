import { ethers } from "hardhat"
import { utils, BigNumber, constants, Contract, ContractFactory } from "ethers"
import { assert, expect } from "chai"

let fileSwap: Contract
let usdc: Contract
let deployer: any
let router: Contract

const FreeERC20Artifact = require("../abi/FreeERC20.json")
const routerArtifact = require("@uniswap/v2-periphery/build/UniswapV2Router02.json")

describe("FileSwap", () => {
  before(async () => {
    ;[deployer] = await ethers.getSigners()

    usdc = new Contract("0x52735528D0a67be8123E4FaF16A493ff0381F21f", FreeERC20Artifact.abi, deployer)

    router = new Contract("0x0DA082accb1ed8d86a071c8B5E69257f17a1Ef2E", routerArtifact.abi, deployer)

    const FileSwap = await ethers.getContractFactory("FileSwap")
    fileSwap = await FileSwap.deploy(usdc.address, router.address)
    await fileSwap.deployed()
    console.log("FileSwap deployed to:", fileSwap.address)
  })
  it("deploys", async () => {})
})
