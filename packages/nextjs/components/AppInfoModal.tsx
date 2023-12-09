import { Modal } from "antd";
import { TModalProps } from "~~/types/general";

type TProps = TModalProps;
export const AppInfoModal: React.FC<TProps> = ({ onClose, open }) => {
  return (
    <Modal title="Application Info" style={{ top: 20 }} open={open} onCancel={onClose} footer={null}>
      <div className="flex flex-col gap-4 text-center">
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
      </div>
    </Modal>
  );
};
