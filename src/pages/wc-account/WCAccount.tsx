import { useAccount, useConnect } from 'wagmi'
import {walletConnectConnector} from "../../modules/wagmi/wagmiConfig";
import {Button} from "antd";
import {Account} from "./components/Account";
import {BaseLayout} from "../../components/BaseLayout";


export function WCAccount() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({connector: walletConnectConnector});

  const handleConnect = () => {

    try {
      connect()
    } catch (ex) {
      console.log('### ex', ex);
    }
  }

  if (isConnected && address) {
    return <BaseLayout><Account address={address} /></BaseLayout>
  }
  return <BaseLayout><Button type={'primary'} block onClick={handleConnect}>Connect Wallet</Button></BaseLayout>
}