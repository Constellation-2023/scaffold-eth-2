import { useCallback, useEffect } from "react";
import { useAddOwnerToDeployedWallet } from "./WalletDetails";
import { Button, Form, Input, Modal, Skeleton } from "antd";
import { TxReceipt } from "~~/components/scaffold-eth";
import { TModalProps } from "~~/types/general";
import { textInputValidationRules } from "~~/utils/formHelpers/validation";

type TProps = TModalProps & {
  contractAddress: string;
};
export const WalletAddOwner: React.FC<TProps> = ({ onClose, open, contractAddress }) => {
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
  } = useAddOwnerToDeployedWallet({ deployedContractAddress: contractAddress });
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
    <Modal title="Add Owner to Wallet" style={{ top: 20 }} open={open} onCancel={handleCancel} footer={null}>
      <Skeleton loading={deployedContractLoading} active paragraph={{ rows: 5 }}>
        <div className="flex-grow basis-0">{displayedTxResult ? <TxReceipt txResult={displayedTxResult} /> : null}</div>

        <Form
          form={dataForm}
          onFinish={data => setForm(prev => ({ ...prev, ...data }))}
          labelCol={{ span: 24 }}
          requiredMark={false}
          disabled={Object.values(form).length === 1}
        >
          <Form.Item label="New Owner Address * " name={"newOwner"} rules={textInputValidationRules}>
            <Input placeholder="New Owner" />
          </Form.Item>
        </Form>
        <div className="flex justify-end gap-4">
          <Button onClick={handleCancel}>Cancel</Button>

          {Object.values(form).length !== 1 && <Button onClick={() => dataForm.submit()}>Create</Button>}
          {Object.values(form).length === 1 && (
            <Button onClick={handleSubmit} loading={isLoading}>
              Ok, Proceed
            </Button>
          )}
        </div>
      </Skeleton>
    </Modal>
  );
};
