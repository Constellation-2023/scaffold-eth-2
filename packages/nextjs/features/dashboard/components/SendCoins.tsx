import { DEFAULT_WALLET_CHAINS } from "../constants";
import { useSendTokensCrossChain } from "./WalletDetails";
import { Form, Input, InputNumber, Modal, Select, Skeleton } from "antd";
import { Button } from "antd";
import { useNetwork } from "wagmi";
import { TxReceipt } from "~~/components/scaffold-eth";
import { TModalProps } from "~~/types/general";
import {
  generalValidationRules,
  numberInputValidationRules,
  textInputValidationRules,
} from "~~/utils/formHelpers/validation";

enum EAddCategoryFormItemName {
  comment = "comment",
}
type TAddCategorySubmitData = {
  [EAddCategoryFormItemName.comment]: string;
};
type AddCategoryProps = {
  onSubmit: { fn: (data: TAddCategorySubmitData) => void; isLoading?: boolean };
  selectedChain: string;
  contractAddress: string;
};
type TProps = TModalProps & AddCategoryProps;
export const SendCoins: React.FC<TProps> = ({ open, onClose, selectedChain, contractAddress }) => {
  const [dataForm] = Form.useForm();
  const { form, setForm, onSubmit, isLoading, deployedContractLoading, displayedTxResult, setDisplayedTxResult } =
    useSendTokensCrossChain({ deployedContractAddress: contractAddress });

  const handleCancel = () => {
    setForm({});
    setDisplayedTxResult(undefined);
    onClose();
  };
  const handleSubmit = () => {
    onSubmit();
  };
  const { chain: currentConnentedChain } = useNetwork();
  return (
    <Modal
      title="Send Coins"
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

          {Object.values(form).length !== 5 && <Button onClick={() => dataForm.submit()}>Create</Button>}
          {Object.values(form).length === 5 && (
            <Button onClick={handleSubmit} loading={isLoading}>
              Ok, Proceed
            </Button>
          )}
        </div>
      }
    >
      <Skeleton loading={deployedContractLoading} active paragraph={{ rows: 14 }}>
        <div className="flex-grow basis-0">{displayedTxResult ? <TxReceipt txResult={displayedTxResult} /> : null}</div>
        <Form
          disabled={Object.values(form).length === 5}
          initialValues={{ _destinationChainSelector: selectedChain }}
          form={dataForm}
          onFinish={data => {
            setForm(() => ({
              _destinationChainSelector: selectedChain,
              _receiver: data?._receiver,
              _text: data?._text,
              _token: data?._token,
              _amount: BigInt(Math.round(Number(+data?._amount) * 10 ** 18)),
            }));
          }}
          labelCol={{ span: 24 }}
          requiredMark={false}
        >
          <Form.Item label="Receiver Address" name="_receiver" rules={textInputValidationRules}>
            <Input placeholder="receiver" onChange={e => setForm(prev => ({ ...prev, _receiver: e.target.value }))} />
          </Form.Item>
          <Form.Item
            label="Transaction Details"
            help={
              <div
                className="bg-green-400 flex items-center gap-2 text-white mt-2 mb-3 px-2 py-2 rounded-lg"
                style={{ background: "#E1FCEF", color: "#14804A" }}
              >
                <div
                  className="w-2 h-2 rounded-full bg-green-500"
                  style={{ background: "#14804A", width: "0.5rem", height: "0.5rem" }}
                />
                <span>to: {dataForm.getFieldValue("_receiver")}</span>
              </div>
            }
          >
            <Input.Group compact className="w-full">
              <Form.Item noStyle>
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
              </Form.Item>
              <Form.Item noStyle name="_token" rules={generalValidationRules}>
                <Select
                  placeholder="Select Coin"
                  style={{ width: "25%" }}
                  options={DEFAULT_WALLET_CHAINS.find(
                    item => item.networkId === `${currentConnentedChain?.id as number}`,
                  )?.ccipTokenLanes?.[selectedChain]?.supportedTokens.map(token => ({
                    label: token.symbol,
                    value: token.tokenAddress,
                  }))}
                />
              </Form.Item>
              <Form.Item noStyle name="_amount" rules={numberInputValidationRules}>
                <InputNumber style={{ width: "65%" }} placeholder="Amount" />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item label="Comment" name="_text" rules={textInputValidationRules}>
            <Input.TextArea placeholder="Write Here ...." rows={3} value={form["_text"]} />
          </Form.Item>
        </Form>
      </Skeleton>
    </Modal>
  );
};
