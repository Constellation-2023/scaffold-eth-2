import { DUMMY_WALLET_CHAIN_DATA } from "./dummy-data";
import { GeorliIcon } from "~~/components/assets/GeorliIcon";
import { OptimismIcon } from "~~/components/assets/OptimismIcon";
import { PolygonIcon } from "~~/components/assets/PolygonIcon";
import { SepoliaIcon } from "~~/components/assets/SepoliaIcon";

export const DEFAULT_WALLET_CHAINS: {
  key: string;
  networkId: string;
  chainId: string; //actually the chainSelector id ensure to refactor
  name: string;
  icon: React.ReactNode;
  router: string;
  linkAddress: string;

  ccipTokenLanes: { [key: string]: { name: string; supportedTokens: { symbol: string; tokenAddress: string }[] } };
}[] = [
  {
    key: "Sep",
    chainId: "16015286601757825753",
    networkId: "11155111",
    name: "Sepolia",
    icon: <SepoliaIcon />,
    router: "0xd0daae2231e9cb96b94c8512223533293c3693bf",
    linkAddress: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
    ccipTokenLanes: {
      "14767482510784806043": {
        name: "fuji",
        supportedTokens: [
          { symbol: "CCIP-BnM", tokenAddress: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05" },
          { symbol: "CCIP-LnM", tokenAddress: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1" },
          { symbol: "Link", tokenAddress: "0x779877A7B0D9E8603169DdbD7836e478b4624789" },
        ],
      },
      "2664363617261496610": {
        name: "Optimism Goerli",
        supportedTokens: [
          { symbol: "CCIP-BnM", tokenAddress: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05" },
          { symbol: "CCIP-LnM", tokenAddress: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1" },
        ],
      },
      "12532609583862916517": {
        name: "Mumbai",
        supportedTokens: [
          { symbol: "CCIP-BnM", tokenAddress: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05" },
          { symbol: "CCIP-LnM", tokenAddress: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1" },
        ],
      },
      "13264668187771770619": {
        name: "BnB Chain",
        supportedTokens: [
          { symbol: "CCIP-BnM", tokenAddress: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05" },
          { symbol: "CCIP-LnM", tokenAddress: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1" },
        ],
      },
      "5790810961207155433": {
        name: "Base Goerli",
        supportedTokens: [
          { symbol: "CCIP-BnM", tokenAddress: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05" },
          { symbol: "CCIP-LnM", tokenAddress: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1" },
        ],
      },
    },
  },
  {
    key: "Opt",
    chainId: "2664363617261496610",
    name: "Optimism Goerli",
    networkId: "420",
    icon: <OptimismIcon />, //TODO: Get the proper icons for networks
    router: "0xeb52e9ae4a9fb37172978642d4c141ef53876f26",
    linkAddress: "0xdc2CC710e42857672E7907CF474a69B63B93089f",
    ccipTokenLanes: {
      "14767482510784806043": {
        name: "fuji",
        supportedTokens: [
          { symbol: "CCIP-BnM", tokenAddress: "0xaBfE9D11A2f1D61990D1d253EC98B5Da00304F16" },
          { symbol: "CCIP-LnM", tokenAddress: "0x835833d556299cdec623e7980e7369145b037591" },
        ],
      },
      "16015286601757825753": {
        name: "Sepolia",
        supportedTokens: [
          { symbol: "CCIP-BnM", tokenAddress: "0xaBfE9D11A2f1D61990D1d253EC98B5Da00304F16" },
          { symbol: "CCIP-LnM", tokenAddress: "0x835833d556299cdec623e7980e7369145b037591" },
        ],
      },
      "12532609583862916517": {
        name: "Mumbai",
        supportedTokens: [
          { symbol: "CCIP-BnM", tokenAddress: "0xaBfE9D11A2f1D61990D1d253EC98B5Da00304F16" },
          { symbol: "CCIP-LnM", tokenAddress: "0x835833d556299cdec623e7980e7369145b037591" },
        ],
      },
      "13264668187771770619": {
        name: "BnB Chain",
        supportedTokens: [
          { symbol: "CCIP-BnM", tokenAddress: "0xaBfE9D11A2f1D61990D1d253EC98B5Da00304F16" },
          { symbol: "CCIP-LnM", tokenAddress: "0x835833d556299cdec623e7980e7369145b037591" },
        ],
      },
      "5790810961207155433": {
        name: "Base Goerli",
        supportedTokens: [
          { symbol: "CCIP-BnM", tokenAddress: "0xaBfE9D11A2f1D61990D1d253EC98B5Da00304F16" },
          { symbol: "CCIP-LnM", tokenAddress: "0x835833d556299cdec623e7980e7369145b037591" },
        ],
      },
    },
  },
  {
    key: "mumbai",
    chainId: "12532609583862916517",
    name: "Mumbai",
    networkId: "80001",
    icon: <PolygonIcon />,
    router: "0x70499c328e1e2a3c41108bd3730f6670a44595d1",
    linkAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    ccipTokenLanes: {
      "14767482510784806043": {
        name: "fuji",
        supportedTokens: [
          { symbol: "CCIP-BnM", tokenAddress: "0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40" },
          { symbol: "CCIP-LnM", tokenAddress: "0xc1c76a8c5bfde1be034bbcd930c668726e7c1987" },
          { symbol: "Link", tokenAddress: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB" },
        ],
      },
      "16015286601757825753": {
        name: "Sepolia",
        supportedTokens: [
          { symbol: "CCIP-BnM", tokenAddress: "0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40" },
          { symbol: "CCIP-LnM", tokenAddress: "0xc1c76a8c5bfde1be034bbcd930c668726e7c1987" },
        ],
      },
      "2664363617261496610": {
        name: "Optimism Goerli",
        supportedTokens: [
          { symbol: "CCIP-BnM", tokenAddress: "0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40" },
          { symbol: "CCIP-LnM", tokenAddress: "0xc1c76a8c5bfde1be034bbcd930c668726e7c1987" },
        ],
      },
      "13264668187771770619": {
        name: "BnB Chain",
        supportedTokens: [
          { symbol: "CCIP-BnM", tokenAddress: "0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40" },
          { symbol: "CCIP-LnM", tokenAddress: "0xc1c76a8c5bfde1be034bbcd930c668726e7c1987" },
        ],
      },
      "5790810961207155433": {
        name: "Base Goerli",
        supportedTokens: [
          { symbol: "CCIP-BnM", tokenAddress: "0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40" },
          { symbol: "CCIP-LnM", tokenAddress: "0xc1c76a8c5bfde1be034bbcd930c668726e7c1987" },
        ],
      },
    },
  },
  {
    key: "fuji",
    chainId: "14767482510784806043",
    name: "Fuji",
    networkId: "43113",
    icon: <GeorliIcon />,
    router: "0x554472a2720e5e7d5d3c817529aba05eed5f82d8",
    linkAddress: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
    ccipTokenLanes: {
      "12532609583862916517": {
        name: "Mumbai",
        supportedTokens: [
          { symbol: "CCIP-BnM", tokenAddress: "0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4" },
          { symbol: "CCIP-LnM", tokenAddress: "0x70f5c5c40b873ea597776da2c21929a8282a3b35" },
        ],
      },
      "16015286601757825753": {
        name: "Sepolia",
        supportedTokens: [
          { symbol: "CCIP-BnM", tokenAddress: "0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4" },
          { symbol: "CCIP-LnM", tokenAddress: "0x70f5c5c40b873ea597776da2c21929a8282a3b35" },
        ],
      },
      "2664363617261496610": {
        name: "Optimism Goerli",
        supportedTokens: [
          { symbol: "CCIP-BnM", tokenAddress: "0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4" },
          { symbol: "CCIP-LnM", tokenAddress: "0x70f5c5c40b873ea597776da2c21929a8282a3b35" },
        ],
      },
      "13264668187771770619": {
        name: "BnB Chain",
        supportedTokens: [
          { symbol: "CCIP-BnM", tokenAddress: "0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4" },
          { symbol: "CCIP-LnM", tokenAddress: "0x70f5c5c40b873ea597776da2c21929a8282a3b35" },
        ],
      },
      "5790810961207155433": {
        name: "Base Goerli",
        supportedTokens: [
          { symbol: "CCIP-BnM", tokenAddress: "0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4" },
          { symbol: "CCIP-LnM", tokenAddress: "0x70f5c5c40b873ea597776da2c21929a8282a3b35" },
        ],
      },
    },
  },

  // TODO: Populate later with ccipTokenLanes
  // {
  //   key: "bnb",
  //   chainId: "13264668187771770619",
  //   name: "BnB Chain",
  //   icon: <PolygonIcon />,
  //   router: "0x9527e2d01a3064ef6b50c1da1c0cc523803bcff2",
  // },
  // {
  //   key: "base",
  //   chainId: "5790810961207155433",
  //   name: "Base Goerli",
  //   icon: <PolygonIcon />,
  //   router: "0xa8c0c11bf64af62cdca6f93d3769b88bdd7cb93d",
  // },
];

export { DUMMY_WALLET_CHAIN_DATA };
