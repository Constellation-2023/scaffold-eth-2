import React, { useEffect, useState } from "react";
import { DEFAULT_WALLET_CHAINS } from "../constants";
import { TWalletChainData } from "../types";
import { SendCoins } from "./SendCoins";
import { SendMessage } from "./SendMessage";
import { Abi, AbiFunction } from "abitype";
import { Form, Input, Modal, Segmented, Select } from "antd";
import { TransactionReceipt } from "viem";
import { useContractRead, useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import { getInitialFormState, getParsedContractFunctionArgs, getParsedError } from "~~/components/scaffold-eth";
import { useDeployedContractInfo, useTransactor } from "~~/hooks/scaffold-eth";
import { TModalProps } from "~~/types/general";
import { notification } from "~~/utils/scaffold-eth";

type TWalletDetailProps = { address: string; data?: TWalletChainData };
type TProps = TModalProps & TWalletDetailProps;
const WalletDetails: React.FC<TProps> = ({ onClose, open, address, data }) => {
  return (
    <Modal
      title={data?.name}
      style={{ top: 20 }}
      open={open}
      onCancel={onClose}
      classNames={{
        header: "shadow-sm",
        body: "shadow-sm",
      }}
      styles={{
        header: {
          paddingBottom: "10px",
          padding: "10px 24px 10px 24px",
        },
        footer: {
          padding: "5px 24px 0px 24px",
          marginBottom: 0,
          marginTop: 0,
        },
        body: {
          padding: "32px 24px 32px 24px",
          background: "#F7F9FC",
          margin: 0,
        },
        content: {
          padding: 0,
        },
      }}
      footer={<WalletDetailActionForm contractAddress={address} />}
    >
      <WalletInsights address={address} data={data} />
    </Modal>
  );
};
const WalletInsights: React.FC<TWalletDetailProps> = ({ address }) => {
  return (
    <div className="flex flex-col gap-6">
      <Input value={address} disabled />
      {/* <div className="px-4 py-4  border-black border flex gap-6">
        <Avatar src="" size={80} />
        <div className="flex flex-col gap-4">
          <Typography.Title level={5}>
            <span className="font-semibold">{data?.name}</span>
          </Typography.Title>
          <div className="flex gap-2 items-center">
            <span className="font-semibold">Total now in USD: ${data?.total}</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-normal">
              Max-transaction: 46 Eth (${data?.transactionCount}) at {moment(data?.createdAt).format("h:mm:ss A")}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-normal">Has Active in Blockchains:</span>
            <Avatar.Group maxCount={5}>
              {data?.message.chains.map(item => (
                <Avatar
                  key={item}
                  size="small"
                  icon={<div className="mt-1">{DEFAULT_WALLET_CHAINS.find(chain => chain.key === item)?.icon}</div>}
                  className="items-center justify-center"
                  style={{ backgroundColor: "#fff" }}
                />
              ))}
            </Avatar.Group>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export const useSendMessageCrossChain = ({ deployedContractAddress }: { deployedContractAddress: string }) => {
  const [txValue, setTxValue] = useState<string | bigint>("");
  const writeTxn = useTransactor();
  const { chain } = useNetwork();

  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(
    "Wallet" as any,
    chain,
  );
  const abiFunction = (deployedContractData?.abi as unknown as AbiFunction[])?.find(
    item => item.name === "sendMessagePayLINK",
  ) as unknown as AbiFunction;
  const [form, setForm] = useState<Record<string, any>>(() => (abiFunction ? getInitialFormState(abiFunction) : {}));
  const {
    data: result,
    isLoading,
    writeAsync,
  } = useContractWrite({
    address: deployedContractAddress,
    functionName: abiFunction?.name,
    abi: [abiFunction] as Abi,
    args: getParsedContractFunctionArgs(form),
  });

  const onSubmit = async () => {
    if (writeAsync) {
      try {
        const makeWriteWithParams = () => writeAsync({ value: BigInt(txValue) });
        await writeTxn(makeWriteWithParams);
      } catch (e: any) {
        const message = getParsedError(e);
        notification.error(message);
      }
    }
  };
  const [displayedTxResult, setDisplayedTxResult] = useState<TransactionReceipt>();
  const { data: txResult } = useWaitForTransaction({
    hash: result?.hash,
  });
  useEffect(() => {
    setDisplayedTxResult(txResult);
  }, [txResult]);

  return {
    form,
    onSubmit,
    deployedContractLoading,
    isLoading,
    displayedTxResult,
    setDisplayedTxResult,
    setForm,
    setTxValue,
  };
};
export const useGetDeployedWalletOwnerCount = ({ deployedContractAddress }: { deployedContractAddress: string }) => {
  const { chain } = useNetwork();

  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(
    "Wallet" as any,
    chain,
  );
  const abiFunction = (deployedContractData?.abi as unknown as AbiFunction[])?.find(
    item => item.name === "ownersCount",
  ) as unknown as AbiFunction;
  const {
    data: result,
    isFetching,
    isError,
    refetch,
  } = useContractRead({
    address: deployedContractAddress,
    functionName: abiFunction?.name,
    abi: [abiFunction] as Abi,
    onError: error => {
      notification.error(error.message);
    },
  });

  return {
    result: result as string,
    deployedContractLoading,
    isFetching,
    refetch,
    isError,
  };
};
export const useGetDeployedWallets = () => {
  const { chain } = useNetwork();

  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(
    "WalletFactory" as any,
    chain,
  );
  const abiFunction = (deployedContractData?.abi as unknown as AbiFunction[])?.find(
    item => item.name === "getDeployedWallets",
  ) as unknown as AbiFunction;
  const {
    data: result,
    isFetching,
    refetch,
  } = useContractRead({
    address: deployedContractData?.address,
    functionName: abiFunction?.name,
    abi: [abiFunction] as Abi,
    onError: error => {
      notification.error(error.message);
    },
  });

  return {
    result: result as string[],
    deployedContractLoading,
    isFetching,
    refetch,
  };
};
export const useRemoveOwnerFromDeployedWallet = ({ deployedContractAddress }: { deployedContractAddress: string }) => {
  const [txValue, setTxValue] = useState<string | bigint>("");
  const writeTxn = useTransactor();
  const { chain } = useNetwork();

  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(
    "Wallet" as any,
    chain,
  );
  const abiFunction = (deployedContractData?.abi as unknown as AbiFunction[])?.find(
    item => item.name === "removeOwner",
  ) as unknown as AbiFunction;
  const [form, setForm] = useState<Record<string, any>>(() => (abiFunction ? getInitialFormState(abiFunction) : {}));
  const {
    data: result,
    isLoading,
    writeAsync,
    isSuccess,
  } = useContractWrite({
    address: deployedContractAddress,
    functionName: abiFunction?.name,
    abi: [abiFunction] as Abi,
    args: getParsedContractFunctionArgs(form),
  });

  const onSubmit = async () => {
    if (writeAsync) {
      try {
        const makeWriteWithParams = () => writeAsync({ value: BigInt(txValue) });
        await writeTxn(makeWriteWithParams);
      } catch (e: any) {
        const message = getParsedError(e);
        notification.error(message);
      }
    }
  };
  const [displayedTxResult, setDisplayedTxResult] = useState<TransactionReceipt>();
  const { data: txResult } = useWaitForTransaction({
    hash: result?.hash,
  });
  useEffect(() => {
    setDisplayedTxResult(txResult);
  }, [txResult]);

  return {
    onSubmit,
    deployedContractLoading,
    isLoading,
    displayedTxResult,
    setDisplayedTxResult,
    setForm,
    setTxValue,
    form,
    isSuccess,
  };
};
export const useAddOwnerToDeployedWallet = ({ deployedContractAddress }: { deployedContractAddress: string }) => {
  const [txValue, setTxValue] = useState<string | bigint>("");
  const writeTxn = useTransactor();
  const { chain } = useNetwork();

  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(
    "Wallet" as any,
    chain,
  );
  const abiFunction = (deployedContractData?.abi as unknown as AbiFunction[])?.find(
    item => item.name === "addOwner",
  ) as unknown as AbiFunction;
  const [form, setForm] = useState<Record<string, any>>(() => (abiFunction ? getInitialFormState(abiFunction) : {}));
  const {
    data: result,
    isLoading,
    writeAsync,
    isSuccess,
  } = useContractWrite({
    address: deployedContractAddress,
    functionName: abiFunction?.name,
    abi: [abiFunction] as Abi,
    args: getParsedContractFunctionArgs(form),
  });

  const onSubmit = async () => {
    if (writeAsync) {
      try {
        const makeWriteWithParams = () => writeAsync({ value: BigInt(txValue) });
        await writeTxn(makeWriteWithParams);
      } catch (e: any) {
        const message = getParsedError(e);
        notification.error(message);
      }
    }
  };
  const [displayedTxResult, setDisplayedTxResult] = useState<TransactionReceipt>();
  const { data: txResult } = useWaitForTransaction({
    hash: result?.hash,
  });
  useEffect(() => {
    setDisplayedTxResult(txResult);
  }, [txResult]);

  return {
    onSubmit,
    deployedContractLoading,
    isLoading,
    displayedTxResult,
    setDisplayedTxResult,
    setForm,
    setTxValue,
    form,
    isSuccess,
  };
};
export const useAllowlistDestinationChain = ({ deployedContractAddress }: { deployedContractAddress: string }) => {
  const [txValue, setTxValue] = useState<string | bigint>("");
  const writeTxn = useTransactor();
  const { chain } = useNetwork();

  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(
    "Wallet" as any,
    chain,
  );
  const abiFunction = (deployedContractData?.abi as unknown as AbiFunction[])?.find(
    item => item.name === "allowlistDestinationChain",
  ) as unknown as AbiFunction;
  const [form, setForm] = useState<Record<string, any>>(() => (abiFunction ? getInitialFormState(abiFunction) : {}));
  const {
    data: result,
    isLoading,
    writeAsync,
    isSuccess,
  } = useContractWrite({
    address: deployedContractAddress,
    functionName: abiFunction?.name,
    abi: [abiFunction] as Abi,
    args: getParsedContractFunctionArgs(form),
  });

  const onSubmit = async () => {
    if (writeAsync) {
      try {
        const makeWriteWithParams = () => writeAsync({ value: BigInt(txValue) });
        await writeTxn(makeWriteWithParams);
      } catch (e: any) {
        const message = getParsedError(e);
        notification.error(message);
      }
    }
  };
  const [displayedTxResult, setDisplayedTxResult] = useState<TransactionReceipt>();
  const { data: txResult } = useWaitForTransaction({
    hash: result?.hash,
  });
  useEffect(() => {
    setDisplayedTxResult(txResult);
  }, [txResult]);

  return {
    onSubmit,
    deployedContractLoading,
    isLoading,
    displayedTxResult,
    setDisplayedTxResult,
    setForm,
    setTxValue,
    form,
    isSuccess,
  };
};
export const useCreateWalletOnCurrentChain = () => {
  const [txValue, setTxValue] = useState<string | bigint>("");
  const writeTxn = useTransactor();
  const { chain } = useNetwork();

  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(
    "WalletFactory" as any,
    chain,
  );
  const abiFunction = (deployedContractData?.abi as unknown as AbiFunction[])?.find(
    item => item.name === "createWallet",
  ) as unknown as AbiFunction;
  const [form, setForm] = useState<Record<string, any>>(() => (abiFunction ? getInitialFormState(abiFunction) : {}));
  const {
    data: result,
    isLoading,
    writeAsync,
    isSuccess,
  } = useContractWrite({
    address: deployedContractData?.address,
    functionName: abiFunction?.name,
    abi: [abiFunction] as Abi,
    args: getParsedContractFunctionArgs(form),
  });

  const onSubmit = async () => {
    if (writeAsync) {
      try {
        const makeWriteWithParams = () => writeAsync({ value: BigInt(txValue) });
        await writeTxn(makeWriteWithParams);
      } catch (e: any) {
        const message = getParsedError(e);
        notification.error(message);
      }
    }
  };
  const [displayedTxResult, setDisplayedTxResult] = useState<TransactionReceipt>();
  const { data: txResult } = useWaitForTransaction({
    hash: result?.hash,
  });
  useEffect(() => {
    setDisplayedTxResult(txResult);
  }, [txResult]);

  return {
    onSubmit,
    deployedContractLoading,
    isLoading,
    displayedTxResult,
    setDisplayedTxResult,
    setForm,
    setTxValue,
    form,
    isSuccess,
  };
};
export const useSendTokensCrossChain = ({ deployedContractAddress }: { deployedContractAddress: string }) => {
  const [txValue, setTxValue] = useState<string | bigint>("");
  const writeTxn = useTransactor();
  const { chain } = useNetwork();

  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo(
    "Wallet" as any,
    chain,
  );
  const abiFunction = (deployedContractData?.abi as unknown as AbiFunction[])?.find(
    item => item.name === "sendMessageWithTokenPayLINK",
  ) as unknown as AbiFunction;
  const [form, setForm] = useState<Record<string, any>>(() => (abiFunction ? getInitialFormState(abiFunction) : {}));
  const {
    data: result,
    isLoading,
    writeAsync,
  } = useContractWrite({
    address: deployedContractAddress,
    functionName: abiFunction?.name,
    abi: [abiFunction] as Abi,
    args: getParsedContractFunctionArgs(form),
  });

  const onSubmit = async () => {
    if (writeAsync) {
      try {
        const makeWriteWithParams = () => writeAsync({ value: BigInt(txValue) });
        await writeTxn(makeWriteWithParams);
      } catch (e: any) {
        const message = getParsedError(e);
        notification.error(message);
      }
    }
  };
  const [displayedTxResult, setDisplayedTxResult] = useState<TransactionReceipt>();
  const { data: txResult } = useWaitForTransaction({
    hash: result?.hash,
  });
  useEffect(() => {
    setDisplayedTxResult(txResult);
  }, [txResult]);

  return {
    onSubmit,
    deployedContractLoading,
    isLoading,
    displayedTxResult,
    setDisplayedTxResult,
    setForm,
    setTxValue,
    form,
  };
};

const WalletDetailActionForm: React.FC<{ contractAddress: string }> = ({ contractAddress }) => {
  const [action, setAction] = useState<"Send Coins" | "Send Message">();
  const [form] = Form.useForm<{ chain: string; action: string }>();
  const { chain: currentConnentedChain } = useNetwork();
  const WALLET_CHAINS_TO_SELECT = DEFAULT_WALLET_CHAINS.filter(
    item => item.networkId !== `${currentConnentedChain?.id as number}`,
  );
  const [selectedChain, setSelectedChain] = useState<string>(WALLET_CHAINS_TO_SELECT[0].chainId);
  return (
    <>
      <SendCoins
        selectedChain={selectedChain}
        contractAddress={contractAddress}
        open={action === "Send Coins"}
        onClose={() => setAction(undefined)}
        onSubmit={{ fn: () => setAction(undefined) }}
      />
      <SendMessage
        contractAddress={contractAddress}
        selectedChain={selectedChain}
        open={action === "Send Message"}
        onClose={() => setAction(undefined)}
        onSubmit={{ fn: () => setAction(undefined) }}
      />
      <Form
        form={form}
        onFinish={values => {
          console.log(values, ".......");
        }}
        labelCol={{ span: 24 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4"
      >
        <Form.Item label="Choose Destination chain" className="lg:col-span-1">
          <Select
            placeholder="Select Chain"
            onSelect={value => setSelectedChain(value)}
            value={selectedChain}
            options={WALLET_CHAINS_TO_SELECT.map(chain => ({
              value: chain.chainId,

              label: (
                <div className="flex gap-2 items-center">
                  <span>{chain.icon}</span>
                  <span className="capitalize">{chain.name}</span>
                </div>
              ),
            }))}
          />
        </Form.Item>
        <Form.Item label="Choose Action" className="lg:col-span-1 flex justify-end">
          <div className="flex justify-start">
            <Segmented
              onSelect={() => form.submit()}
              options={[
                {
                  label: (
                    <span className="cursor-pointer" onClick={() => setAction("Send Coins")}>
                      Send Coins
                    </span>
                  ),
                  value: "Send Coins",
                },
                {
                  label: (
                    <span className="cursor-pointer" onClick={() => setAction("Send Message")}>
                      Send Message
                    </span>
                  ),
                  value: "Send Message",
                },
              ]}
              style={{ color: "#5E5ADB" }}
            />
          </div>
        </Form.Item>
      </Form>
    </>
  );
};

export const WalletDetailsBtn: React.FC<TWalletDetailProps & { children?: React.ReactNode }> = ({
  address,
  data,
  children,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <WalletDetails address={address} data={data} open={open} onClose={() => setOpen(false)} />
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>
    </>
  );
};

export default WalletDetails;
