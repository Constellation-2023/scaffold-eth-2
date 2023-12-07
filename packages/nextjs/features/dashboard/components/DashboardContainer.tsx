"use client";

import React from "react";
import DashboardLayout from "./DashboardLayout";
import WalletHeader from "./WalletHeader";
import WalletTabs from "./WalletTabs";

const DashboardContainer = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col lg:gap-10">
        {/* controls */}
        <WalletHeader />
        {/* wallet tabs */}
        <WalletTabs />
      </div>
    </DashboardLayout>
  );
};

export default DashboardContainer;