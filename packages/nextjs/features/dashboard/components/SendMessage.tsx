import { DEFAULT_WALLET_CHAINS } from "../constants";
import { useSendMessageCrossChain } from "./WalletDetails";
import { Form, Input, Modal, Skeleton } from "antd";
import { Button, Select } from "antd";
import { TxReceipt } from "~~/components/scaffold-eth";
import { TModalProps } from "~~/types/general";
import { textInputValidationRules } from "~~/utils/formHelpers/validation";

enum EAddCategoryFormItemName {
  comment = "comment",
}
type TAddCategorySubmitData = {
  [EAddCategoryFormItemName.comment]: string;
};
type AddCategoryProps = {
  onSubmit?: { fn: (data: TAddCategorySubmitData) => void; isLoading?: boolean };
  selectedChain: string;
  contractAddress: string;
};
type TProps = TModalProps & AddCategoryProps;

export const SendMessage: React.FC<TProps> = ({ open, onClose, selectedChain, contractAddress }) => {
  // ______________

  const { form, setForm, onSubmit, isLoading, deployedContractLoading, displayedTxResult, setDisplayedTxResult } =
    useSendMessageCrossChain({ deployedContractAddress: contractAddress });

  const handleSubmit = () => {
    onSubmit();
  };
  const handleCancel = () => {
    setForm({});
    setDisplayedTxResult(undefined);
    onClose();
  };
  const [dataForm] = Form.useForm();

  return (
    <Modal
      title="Send Message"
      style={{ top: 20 }}
      open={open}
      onCancel={handleCancel}
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
          padding: "10px 24px 10px 24px",
        },
        body: {
          padding: "10px 24px 24px 24px",
          background: "#F7F9FC",
          margin: 0,
        },
        content: {
          padding: 0,
        },
      }}
      footer={
        <div className="flex justify-end gap-4">
          <Button onClick={handleCancel}>Cancel</Button>

          {Object.values(form).length !== 3 && <Button onClick={() => dataForm.submit()}>Create</Button>}
          {Object.values(form).length === 3 && (
            <Button onClick={handleSubmit} loading={isLoading}>
              Ok, Proceed
            </Button>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Skeleton loading={deployedContractLoading} active paragraph={{ rows: 14 }}>
          <Form
            disabled={Object.values(form).length === 3}
            labelCol={{ span: 24 }}
            requiredMark={false}
            form={dataForm}
            onFinish={data => {
              setForm(() => ({
                _destinationChainSelector: selectedChain,
                _receiver: data?._receiver,
                _text: data?._text,
              }));
            }}
          >
            <div className="flex flex-col gap-2">
              <Input.Group compact className="w-full">
                {" "}
                <Select
                  suffixIcon={null}
                  style={{ width: "10%" }}
                  disabled
                  value={selectedChain}
                  options={DEFAULT_WALLET_CHAINS.map(chain => ({
                    value: chain.chainId,

                    label: (
                      <div className="flex gap-2 items-center">
                        <span>{chain.icon}</span>
                        {/* <span className="capitalize">{chain.name}</span> */}
                      </div>
                    ),
                  }))}
                />
                <Form.Item label="Receiver" rules={textInputValidationRules} name="_receiver" noStyle>
                  <Input style={{ width: "90%" }} placeholder="Receiver" />
                </Form.Item>
              </Input.Group>

              <Form.Item name="_text" label="Message" rules={textInputValidationRules}>
                <Input.TextArea rows={3} placeholder="Please enter an appropriate message!" />
              </Form.Item>
              {displayedTxResult ? <TxReceipt txResult={displayedTxResult} /> : null}
            </div>
          </Form>
        </Skeleton>
      </div>
    </Modal>
  );
};
