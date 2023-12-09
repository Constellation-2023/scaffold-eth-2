import { useCallback, useEffect } from "react";
import { DEFAULT_WALLET_CHAINS } from "../constants";
import { useAllowlistDestinationChain } from "./WalletDetails";
import { Button, Form, Modal, Select, Skeleton } from "antd";
import { useNetwork } from "wagmi";
import { TxReceipt } from "~~/components/scaffold-eth";
import { TModalProps } from "~~/types/general";
import { generalValidationRules } from "~~/utils/formHelpers/validation";

type TProps = TModalProps & {
  contractAddress: string;
};
export const WalletAllowListDestinationChain: React.FC<TProps> = ({ onClose, open, contractAddress }) => {
  const [dataForm] = Form.useForm();
  const {
    isSuccess,
    form,
    setForm,
    onSubmit,
    isLoading,
    deployedContractLoading,
    displayedTxResult,
    setDisplayedTxResult,
  } = useAllowlistDestinationChain({ deployedContractAddress: contractAddress });
  const handleCancel = useCallback(() => {
    dataForm.resetFields();
    setForm({});
    setDisplayedTxResult(undefined);
    onClose();
  }, [dataForm, onClose, setDisplayedTxResult, setForm]);
  const handleSubmit = () => {
    onSubmit();
  };
  const { chain: currentConnentedChain } = useNetwork();

  const WALLET_CHAINS_TO_SELECT = DEFAULT_WALLET_CHAINS.filter(
    item => item.networkId !== `${currentConnentedChain?.id as number}`,
  );
  useEffect(() => {
    if (!isSuccess) return;
    handleCancel();
  }, [handleCancel, isSuccess]);
  return (
    <Modal
      title="Activate/Deactivate Destination Chain "
      style={{ top: 20 }}
      open={open}
      onCancel={handleCancel}
      footer={null}
    >
      <Skeleton loading={deployedContractLoading} active paragraph={{ rows: 5 }}>
        <div className="flex-grow basis-0">{displayedTxResult ? <TxReceipt txResult={displayedTxResult} /> : null}</div>

        <Form
          disabled={Object.values(form).length === 2}
          form={dataForm}
          onFinish={data => setForm(prev => ({ ...prev, ...data }))}
          labelCol={{ span: 24 }}
          requiredMark={false}
        >
          <Form.Item
            label="Destination Chain Selector * "
            name={"_destinationChainSelector"}
            rules={generalValidationRules}
          >
            <Select
              placeholder="Destination Chain Selector"
              options={WALLET_CHAINS_TO_SELECT.map(item => ({ label: item.name, value: item.chainId }))}
            />
          </Form.Item>

          <Form.Item label="Is it Allowed?" name={"allowed"} rules={generalValidationRules}>
            <Select
              placeholder="Allowed?"
              options={[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ]}
            />
          </Form.Item>
        </Form>
        <div className="flex justify-end gap-4">
          <Button onClick={handleCancel}>Cancel</Button>

          {Object.values(form).length !== 2 && <Button onClick={() => dataForm.submit()}>Create</Button>}
          {Object.values(form).length === 2 && (
            <Button onClick={handleSubmit} loading={isLoading}>
              Ok, Proceed
            </Button>
          )}
        </div>
      </Skeleton>
    </Modal>
  );
};
