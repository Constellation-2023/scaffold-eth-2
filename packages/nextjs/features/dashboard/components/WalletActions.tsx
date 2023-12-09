import { useState } from "react";
import { TWalletChainData } from "../types";
import { WalletAddOwner } from "./WalletAddOwner";
import { WalletAllowListDestinationChain } from "./WalletAllowListDestinationChain";
import WalletDetails from "./WalletDetails";
import { WalletRemoveOwner } from "./WalletRemoveOwner";
import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown } from "antd";

type TAction = "wallet-details" | "allowlistDestinationChain" | "add-owner" | "remove-owner";
const WalletActions: React.FC<{ address: string; data?: TWalletChainData; children?: React.ReactNode }> = ({
  address,
  children = <Button icon={<MoreOutlined rev={{}} />} type="text" size="small" />,
  data,
}) => {
  const [action, setAction] = useState<TAction>();
  const onClose = () => {
    setAction(undefined);
  };
  return (
    <>
      <WalletAddOwner open={action === "add-owner"} onClose={onClose} contractAddress={address} />
      <WalletRemoveOwner open={action === "remove-owner"} onClose={onClose} contractAddress={address} />
      <WalletAllowListDestinationChain
        open={action === "allowlistDestinationChain"}
        onClose={onClose}
        contractAddress={address}
      />
      {data && <WalletDetails address={address} onClose={onClose} open={action === "wallet-details"} data={data} />}
      <Dropdown
        menu={{
          items: [
            {
              onClick: () => setAction("wallet-details"),
              label: "Send Coins/Message",
              key: "Send Coins/Message",
            },
            {
              onClick: () => setAction("add-owner"),
              label: "Add Owner",
              key: "Add Owner",
            },
            {
              onClick: () => setAction("remove-owner"),
              label: "Remove Owner",
              key: "Remove Owner",
            },
            {
              onClick: () => setAction("allowlistDestinationChain"),
              label: "Activate/Deactivate Destination Chain",
              key: "Activate/Deactivate Destination Chain",
            },
          ],
        }}
        trigger={["click"]}
      >
        {children}
      </Dropdown>
    </>
  );
};

export default WalletActions;
