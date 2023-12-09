import { useCallback, useEffect } from "react";
import { DEFAULT_WALLET_CHAINS } from "../constants";
import { useCreateWalletOnCurrentChain } from "./WalletDetails";
import { Button, Form, Input, Select, Skeleton, Tabs } from "antd";
import { useNetwork } from "wagmi";
import { TxReceipt } from "~~/components/scaffold-eth";

export const AddWalletTabs: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <Tabs
      items={[
        { key: "Create CCIP Wallet", label: "Create CCIP Wallet", children: <CreateCCIPWallet onClose={onClose} /> },
        // { key: "Add Existing Wallet", label: "Add Existing Wallet", children: <AddExistingWallet /> },
      ]}
    />
  );
};

export const AddExistingWallet = () => {
  const [dataForm] = Form.useForm();

  return (
    <Form form={dataForm} labelCol={{ span: 24 }} requiredMark={false}>
      <Form.Item label="Wallet address * " name={"address"}>
        <Input placeholder="Wallet Address" />
      </Form.Item>
      <Form.Item label="Wallet Name * " name={"walletName"}>
        <Input placeholder="Link Address" />
      </Form.Item>
      <Form.Item label="Category" name={"walletCategory"}>
        <Select placeholder="Category" />
      </Form.Item>

      <div className="flex justify-end">
        <Button htmlType="submit">Create</Button>
      </div>
    </Form>
  );
};
export const CreateCCIPWallet: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [dataForm] = Form.useForm();
  const { chain } = useNetwork();
  const selectedChain = DEFAULT_WALLET_CHAINS.find(item => item.networkId === `${chain?.id}`);
  const {
    isSuccess,
    form,
    setForm,
    onSubmit,
    isLoading,
    deployedContractLoading,
    displayedTxResult,
    setDisplayedTxResult,
  } = useCreateWalletOnCurrentChain();
  const handleCancel = useCallback(() => {
    dataForm.resetFields();
    setForm({});
    setDisplayedTxResult(undefined);
    onClose();
  }, [dataForm, onClose, setDisplayedTxResult, setForm]);
  const handleSubmit = () => {
    onSubmit();
  };
  useEffect(() => {
    if (!isSuccess) return;
    handleCancel();
  }, [handleCancel, isSuccess]);
  return (
    <Skeleton loading={deployedContractLoading} active paragraph={{ rows: 5 }}>
      <div className="flex-grow basis-0">{displayedTxResult ? <TxReceipt txResult={displayedTxResult} /> : null}</div>

      <Form
        initialValues={{ _router: selectedChain?.router, _link: selectedChain?.linkAddress }}
        form={dataForm}
        onFinish={data => setForm(prev => ({ ...prev, ...data }))}
        labelCol={{ span: 24 }}
        requiredMark={false}
      >
        <Form.Item label="Router address * " name={"_router"} rules={[{ required: true }]}>
          <Input placeholder="Router Address" disabled />
        </Form.Item>
        <Form.Item label="Link address * " name={"_link"}>
          <Input placeholder="Link Address" disabled />
        </Form.Item>
        <Form.Item label="Owner Address * " name={"_owner"} rules={[{ required: true }, { whitespace: true }]}>
          <Input placeholder="Owner Address" />
        </Form.Item>

        <div className="flex justify-end gap-4">
          <Button onClick={handleCancel}>Cancel</Button>

          {Object.values(form).length !== 3 && <Button htmlType="submit">Create</Button>}
          {Object.values(form).length === 3 && (
            <Button onClick={handleSubmit} loading={isLoading}>
              Ok, Proceed
            </Button>
          )}
        </div>
      </Form>
    </Skeleton>
  );
};
