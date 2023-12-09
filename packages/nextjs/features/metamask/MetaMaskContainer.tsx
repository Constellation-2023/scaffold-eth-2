"use client";

import React from "react";
import DashboardLayout from "../dashboard/components/DashboardLayout";
import { BrokenPiggyIcon } from "~~/components/assets/BrokenPiggyIcon";

const MetaMaskContainer = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col lg:gap-10 items-center -mt-10">
        <BrokenPiggyIcon />
      </div>
    </DashboardLayout>
  );
};

export default MetaMaskContainer;
