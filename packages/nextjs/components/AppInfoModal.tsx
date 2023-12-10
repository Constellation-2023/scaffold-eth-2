import { Modal } from "antd";
import { TModalProps } from "~~/types/general";

type TProps = TModalProps;
export const AppInfoModal: React.FC<TProps> = ({ onClose, open }) => {
  return (
    <Modal title="Application Info" style={{ top: 10 }} open={open} onCancel={onClose} footer={null}>
      <div className="flex flex-col text-center">
        <p>
          Our project is a hub for your crypto wallets. We want to make the blockchain even more transparent, so we see
          great potential in designating payments as a functionality in the blockchain. This will not only assist public
          and charitable companies in conducting public financial reporting but also justify the use of CCIP in the
          project.
        </p>
        <p>
          The project is equipped with features such as wallet creation, activating/deactivating destination chains,
          adding/removing wallet owners, and sending coins/messages from wallets. You can also see token balances of
          wallets across chains.
        </p>
        <div>
          <p className="font-semibold text-slate-800 text-lg underline">Steps to use Application</p>
          <ul>
            {[
              "Connect your wallet",
              "Create a wallet or ask to be added as an owner to an existing wallet!",
              `Fund the wallet you intend to use with link, this will be used to pay fees, as well as the token(CCIP-BnM or CCIP-LnM) you intend
              to send!`,
              `Click on the Actions button in the wallet you intend to use, and activate the destination chain you intend to interact with!`,
              `You can then proceed to send coins/messages from the wallet you intend to use!`,
            ].map((step, i) => (
              <li key={i}>
                <span className="font-bold text-slate-800">Step {i + 1}:</span> {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
};
