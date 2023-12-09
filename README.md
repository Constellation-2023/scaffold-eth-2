# 🏗 Bankxpert

<h4 align="center">
  <a href="https://bank-expert-ruby.vercel.app/debug">Contracts</a> |
  <a href="https://bank-expert-ruby.vercel.app/dashboard">Web Application</a>
</h4>

🧪 This is a banking application that enables users to create wallets(bank accounts) once authenticated. These accounts are smart contracts that use ccip to ensure that tokens and data can be sent and received cross-chain. The balances of ERC-20 tokens and native currencies held by the wallet in each chain(e.g sepolia, polygon,...) can also be seen at a glance from the list of wallets showcased by the user interface via a wallet table. The user is also capable of blocking and allowing what chains the wallet can send coins/data to via `allowDestinationChain`. These wallets also have the capabilty of being owned by multiple owners, and only said owners can perform actions like coin transfer on the wallet.

⚙️ TECH STACK: NextJS, RainbowKit, Hardhat, Wagmi, React Query, and Typescript.

- ✅ **Smart Contract**: Smart Contracts can be found in the `packages/hardhat/contracts folder`, and have been deployed to the networks the user will operate on via metamask. They are two smart contracts of concern to the application namely `Wallet Factory` and `Wallet`. The smart contracts were built, compiled, and deployed using the hardhat framework.
- 🔥 **Backend**: The backend was built using nextjs and the database was hosted on the `(tencent cloud platform)[https://www.tencentcloud.com/]`. The database schema generation, management, and connection was handled by prisma. The database schema can be found in `packages/nextjs/prisma/schema.prisma`
- 🔐 **Frontend**: This provides the user interface for user to interact with smart contracts and our backend. React query was used to make api interactions alonside axios. Rainbowkit and Wagmi were used to connect to the blockchain and interact with smart contracts


## Inspiration

Our journey began with a shared passion for cross-chain technology, specifically the innovative CCIP. Our team, comprising visionaries ZQ (CEO), Isaac (CTO), Alex (PM), and Pepe (developer), came together in the digital realms of Gather Town. The initial connection was facilitated by the visionary leadership of ZQ, who wasted no time in orchestrating the inception of our collaborative project.

## What it does

The early days of our project were marked by uncertainty, as we sought the perfect idea to integrate with CCIP. A few team members departed during this exploration phase, but the core team remained committed to the vision. Alex, our PM, stepped forward with a groundbreaking concept that resonated with the team.

Alex envisioned a fusion of traditional banking principles with blockchain technology. Recognizing that CCIP excelled in messaging, he proposed leveraging this strength to optimize the accounting processes for small companies. The idea was to create a centralized hub for managing multiple crypto wallets, offering a streamlined and convenient solution in a decentralized landscape.

Our project emerged as a comprehensive solution, aiming to enhance transparency in blockchain operations. We saw immense potential in integrating payment functionalities into the blockchain, benefiting public and charitable organizations in their financial reporting. This integration also justified the use of CCIP within our project.


## How We Built it

Acknowledging the support and resources provided by Chainlink, Tencent, and others, our gratitude knows no bounds. Educational materials and collaborative opportunities empowered us to transform our ideas into reality.

The journey commenced with Scaffold-eth, and with Tencent integration and a foray into Chainlink ccip, our understanding deepened. We, recognizing the significance of integrting ccip into smart contract implementation of wallets, delved into developing, and subsequently deploying them using the hardhat framework. 

Our story is one of innovation, collaboration, and dedication. From the early stages of conceptualization to the implementation of a transformative blockchain solution, we've navigated challenges, learned from industry giants, and built a project that reflects our shared vision for the future of cross-chain technology.

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/scaffold-eth/scaffold-eth-2.git
cd scaffold-eth-2
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.



## What the future holds

In the future we plan on implementating functionalities that will enable users transfer tokens other than the ccip-token supported via ccip cross-chain lanes (i.e other than CCIP-BNM or CCIP-LnM), allow users to add owners to different wallets, issue commands to wallets using messages for wallets to perform specific actions, .... The possibilities are endless !!!


