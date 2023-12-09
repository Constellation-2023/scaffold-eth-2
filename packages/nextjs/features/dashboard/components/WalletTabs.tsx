import { useState } from "react";
import { useGetDeployedWallets } from "./WalletDetails";
import WalletTableContainer from "./WalletTableContainer";
import { Avatar, Segmented, Tabs } from "antd";
// import { useSession } from "next-auth/react";
import { useNetwork } from "wagmi";
import { useGetWalletCategories } from "~~/hooks/wallet/category/useGetWalletCategories";

const WalletTabs = () => {
  // const { data: session } = useSession();

  const [selectedCoin, setSelectedCoin] = useState<string>("CCIP-BnM");
  const { result: deployedWallets, isFetching: isFetchingDeployedWallets } = useGetDeployedWallets();
  const { chain } = useNetwork();
  const { data: categories, isLoading } = useGetWalletCategories();
  // const { data: categories, isLoading } = useGetWalletCategories({ userId: session?.user.id });
  return (
    <Tabs
      tabBarExtraContent={
        <Segmented
          onChange={val => setSelectedCoin(val as unknown as string)}
          options={["CCIP-BnM", "CCIP-LnM", "Link"]}
        />
      }
      items={[
        {
          key: "All",
          label: <TabLabel amount={deployedWallets?.length} title={"All"} />,
          children: (
            <WalletTableContainer
              selectedCrossChainCoin={selectedCoin}
              addresses={deployedWallets}
              isLoading={isFetchingDeployedWallets}
            />
          ),
        },
        ...(categories?.data ?? []).map(category => ({
          key: category.name,
          label: <TabLabel amount={chain ? category?.wallets?.length : 0} title={category.name} />,
          children: (
            <WalletTableContainer
              selectedCrossChainCoin={selectedCoin}
              isLoading={isLoading}
              addresses={chain ? category.wallets.map(item => item.address) : []}
            />
          ),
        })),
      ]}
    />
  );
};

const TabLabel: React.FC<{ title: string; amount?: number }> = ({ title, amount }) => {
  return (
    <div className="flex gap-2 items-center">
      <span>{title}</span>
      <Avatar icon={`${amount ?? 0}`} size={20} shape="circle" />
    </div>
  );
};

export default WalletTabs;
