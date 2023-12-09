import React from "react";
import type { NextPage } from "next";
import MetaMaskContainer from "~~/features/metamask/MetaMaskContainer";

const MetaMask: NextPage = () => {
  return (
    <>
      <MetaMaskContainer />
    </>
  );
};

export default MetaMask;
