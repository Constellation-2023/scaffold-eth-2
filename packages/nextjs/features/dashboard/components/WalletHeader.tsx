import React from "react";
import { AddCategoryBtn } from "./AddCategory";
import { AddWalletBtn } from "./AddWallet";

// import { Checkbox } from "antd";

const WalletHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        <AddWalletBtn onSubmit={{ fn: data => console.log("I ws clicked", data) }} />
        <AddCategoryBtn onSubmit={{ fn: data => console.log("I ws clicked", data) }} />
      </div>
      {/* <Checkbox.Group
        options={[
          {
            label: "hide empty wallets",
            value: "hide empty wallets",
          },
          {
            label: "hide small balances",
            value: "hide small balances",
          },
          {
            label: "hide unsupported tokens",
            value: "hide unsupported tokens",
          },
        ]}
      /> */}
    </div>
  );
};

export default WalletHeader;
