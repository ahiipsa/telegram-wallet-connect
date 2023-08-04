import * as React from 'react'
import {Button} from "antd";
import {useConnect} from "wagmi";
import {walletConnectConnector} from "../modules/wagmi/wagmiConfig";
import {BaseLayout} from "./BaseLayout";

export const LoginPage: React.FunctionComponent = () => {
  const { connect } = useConnect({connector: walletConnectConnector});

  const handleConnect = () => {
    try {
      connect()
    } catch (ex) {
      console.log('### ex', ex);
    }
  }

  return <BaseLayout><Button type={'primary'} block onClick={handleConnect}>Connect Wallet</Button></BaseLayout>
}