"use client";

import React from "react";
import { DEFAULT_WALLET_CHAINS } from "../constants";
import { TWalletChainData } from "../types";
import WalletActions from "./WalletActions";
import { WalletDetailsBtn, useGetDeployedWalletOwnerCount } from "./WalletDetails";
import WalletTable from "./WalletTable";
import { Skeleton, Tag } from "antd";
import { useBalance } from "wagmi";
import { Address } from "~~/components/scaffold-eth";

// import moment from "moment";
// import { CalendarOutlined } from "@ant-design/icons";
// import { NoteIcon } from "~~/components/assets/NoteIcon";
// import { TetherIcon } from "~~/components/assets/TetherIcon";

// TODO : THIS WILL BE GOTTEN FROM A HOOK

const WalletTableContainer: React.FC<{ selectedCrossChainCoin: string; addresses?: string[]; isLoading?: boolean }> = ({
  selectedCrossChainCoin,
  addresses,
  isLoading,
}) => {
  return (
    <WalletTable
      isLoading={isLoading}
      data={addresses?.map((item, i) => ({
        key: i,
        name: `Wallet ${i + 1}`,
        address: item,
        createdAt: "2023-11-19",
        message: {
          total: 100,
          chains: ["ETH", "BSC"],
        },
        transactionCount: 50,
        chains: {
          ETH: 30,
          BSC: 20,
        },
        total: 200,
      }))}
      columns={[
        {
          key: "Name",

          title: (
            <div className="flex gap-2">
              <span>Name</span>
            </div>
          ),
          // defaultSortOrder: "descend",
          sorter: (a, b) => a.name.localeCompare(b.name),
          render: (_, record) => (
            <WalletDetailsBtn address={record.address} data={record}>
              <Tag>
                <span>{record.name}</span>
              </Tag>
            </WalletDetailsBtn>
          ),
        },
        {
          key: "Wallet",
          // ellipsis: true,

          title: (
            <div className="flex gap-2 uppercase">
              <span>WALLET</span>
            </div>
          ),
          render: (_, record) => <Address address={record.address} />,
        },
        {
          key: "Owner Count",
          // ellipsis: true,

          title: (
            <div className="flex gap-2 uppercase">
              <span>Owner Count</span>
            </div>
          ),
          render: (_, record) => <WalletOwnerCount address={record.address} />,
        },
        ...DEFAULT_WALLET_CHAINS.map(item => ({
          key: item.key,
          title: (
            <div className="flex gap-2 uppercase items-center">
              <span>{item.icon}</span>
              <span className="uppercase" style={{ textTransform: "uppercase" }}>
                {item.key}
              </span>
            </div>
          ),
          render: (_: unknown, record: TWalletChainData) => (
            <WalletBalance
              address={record.address}
              chainId={+item.networkId}
              token={
                Object.values(item.ccipTokenLanes)[0].supportedTokens.find(
                  token => token.symbol === selectedCrossChainCoin,
                )?.tokenAddress
              }
            />
          ),
        })),
        // {
        //   key: "Total",

        //   title: (
        //     <div className="flex gap-2 uppercase items-center">
        //       <span>
        //         <TetherIcon />
        //       </span>
        //       <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>Total</span>
        //     </div>
        //   ),
        //   render: (_, record) => <span className="font-bold text-gray-500">{record.total} $</span>,
        // },
        // {
        //   key: "Messages",

        //   title: (
        //     <div className="flex gap-2 uppercase items-center">
        //       <span>Messages</span>
        //     </div>
        //   ),
        //   render: (_, record) => (
        //     <div className="flex gap-2 uppercase items-center">
        //       <NoteIcon />

        //       <span>{record.message.total}</span>
        //       <Avatar.Group maxCount={2}>
        //         {record.message.chains.map(item => (
        //           <Avatar
        //             key={item}
        //             size="small"
        //             icon={<div className="mt-1">{DEFAULT_WALLET_CHAINS.find(chain => chain.key === item)?.icon}</div>}
        //             className="items-center justify-center"
        //             style={{ backgroundColor: "#fff" }}
        //           />
        //         ))}
        //       </Avatar.Group>
        //     </div>
        //   ),
        // },
        // {
        //   key: "TX",
        //   title: (
        //     <div className="flex gap-2 uppercase">
        //       <span>TX</span>
        //     </div>
        //   ),
        //   render: (_, record) => <span>{record.transactionCount}</span>,
        // },
        // {
        //   key: "Last Activity",
        //   ellipsis: false,
        //   width: 200,
        //   title: (
        //     <div className="flex gap-2 uppercase">
        //       <span>Last Activity</span>
        //     </div>
        //   ),
        //   defaultSortOrder: "descend",
        //   sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
        //   render: (_, record) => (
        //     <div className="flex gap-2 items-center">
        //       <CalendarOutlined rev={{}} className="text-sm" />
        //       <span>{moment(record.createdAt).format("DD MMM YYYY, hh:mm A")}</span>
        //     </div>
        //   ),
        // },
        {
          key: "___",
          title: "Actions",
          render: (_, record) => (
            <>
              <WalletActions address={record.address} data={record} />
            </>
          ),
        },
      ]}
    />
  );
};

type WalletBalProps = { address: string; chainId?: number; token?: string; watch?: boolean };
type WalletOwnerCountProps = { address: string };
const WalletOwnerCount: React.FC<WalletOwnerCountProps> = ({ address }) => {
  const { result, isFetching, isError } = useGetDeployedWalletOwnerCount({ deployedContractAddress: address });

  return (
    <div suppressHydrationWarning>
      {isError ? <span>N/A</span> : null}

      <Skeleton loading={isFetching} paragraph={{ rows: 1 }}>
        {result}
      </Skeleton>
    </div>
  );
};
const WalletBalance: React.FC<WalletBalProps> = ({ chainId, token, address, watch = false }) => {
  const { data, isError, isLoading } = useBalance({
    address,
    token,
    chainId,
    watch,
  });
  return (
    <div suppressHydrationWarning>
      {isError ? <span>N/A</span> : null}

      <Skeleton loading={isLoading} paragraph={{ rows: 1 }}>
        {(data && data?.formatted ? +data?.formatted : 0).toFixed(3)}
        {/* {data?.symbol} */}
      </Skeleton>
    </div>
  );
};

export default WalletTableContainer;
