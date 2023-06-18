import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import dotenv from "dotenv"

dotenv.config()

const SH_ACCOUNT = process.env.SH_ACCOUNT || ""

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/Rr49vltqG5aszCcueirFALvNzVXkCL_J",
      accounts: [SH_ACCOUNT],
    },
  },
  mocha: {
    timeout: 20000000,
  },
}

export default config

// FileSwap
// USDC deployed to: 0x52735528D0a67be8123E4FaF16A493ff0381F21f
// MATIC deployed to: 0x664088Ef1D8C5B156B8c8e1d25029c46D700E607
// KLAY deployed to: 0x088D03b0bd3F644C12Eb10528e829372C3eA0E6c
// USDT deployed to: 0x7f45Ad397595B71A89967a4971794ae4d0168F02
// USDC balance: 10000.0
// MATIC balance: 10000.0
// KLAY balance: 10000.0
// USDT balance: 10000.0
// Factory deployed to: 0x48a912a161349d5527D16B9E1506b77c18c58F48
// Pair USDC/MATIC address: 0x6362D0b3963258BB76EEeAFf5188FA11b59837DA
// Pair USDC/KLAY address: 0xc439A004C25b918F10E39c44C2AfC8fbe931b0Ff
// Pair USDC/USDT address: 0x52b166D4D49f728E8A75c869355e01F76d188986
// WETH deployed to: 0x3b3c6E4E8D97966e3b9dFEAdF4ddcFe3b4B9a119
// Router deployed to: 0x0DA082accb1ed8d86a071c8B5E69257f17a1Ef2E
// FileSwap deployed to: 0x68Cc2F54D7d40e3CC910B3eE4C549E1b073a22C8
// USDC/MATIC reserves: [
//   BigNumber { value: "200000000000000000000" },
//   BigNumber { value: "170000000000000000000" },
//   1686928020,
//   reserve0: BigNumber { value: "200000000000000000000" },
//   reserve1: BigNumber { value: "170000000000000000000" },
//   blockTimestampLast: 1686928020
// ]
// USDC/KLAY reserves: [
//   BigNumber { value: "350000000000000000000" },
//   BigNumber { value: "50000000000000000000" },
//   1686928028,
//   reserve0: BigNumber { value: "350000000000000000000" },
//   reserve1: BigNumber { value: "50000000000000000000" },
//   blockTimestampLast: 1686928028
// ]
// USDC/USDT reserves: [
//   BigNumber { value: "200000000000000000000" },
//   BigNumber { value: "200000000000000000000" },
//   1686928038,
//   reserve0: BigNumber { value: "200000000000000000000" },
//   reserve1: BigNumber { value: "200000000000000000000" },
//   blockTimestampLast: 1686928038
// ]
// ------------------ pays tokens ------------------
// ETH Balance 0.777056507783662197
// Matic Balance 9830.0
// KLAY Balance 9650.0
// USDT Balance 9800.0
// FileSwap MATIC Balance 0.0
// FileSwap KLAY Balance 0.0
// FileSwap USDT Balance 0.0
// USDC/MATIC reserves: [
//   BigNumber { value: "200000000000000000000" },
//   BigNumber { value: "170000000000000000000" },
//   1686928020,
//   reserve0: BigNumber { value: "200000000000000000000" },
//   reserve1: BigNumber { value: "170000000000000000000" },
//   blockTimestampLast: 1686928020
// ]
// USDC/KLAY reserves: [
//   BigNumber { value: "350000000000000000000" },
//   BigNumber { value: "50000000000000000000" },
//   1686928028,
//   reserve0: BigNumber { value: "350000000000000000000" },
//   reserve1: BigNumber { value: "50000000000000000000" },
//   blockTimestampLast: 1686928028
// ]
// USDC/USDT reserves: [
//   BigNumber { value: "181867782122397017369" },
//   BigNumber { value: "220000000000000000000" },
//   1686928054,
//   reserve0: BigNumber { value: "181867782122397017369" },
//   reserve1: BigNumber { value: "220000000000000000000" },
//   blockTimestampLast: 1686928054
// ]
//     ✔ pays tokens (14266ms)

//   1 passing (3m)

//  ~/블벨/fileswap 
