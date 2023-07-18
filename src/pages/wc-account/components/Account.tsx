import * as React from 'react';
import {useBalance, useDisconnect} from "wagmi";
import {Button, Typography} from "antd";
import {Box} from "grommet";
import {useNavigate} from "react-router-dom";

interface Props {
  address: `0x${string}`
}

export const Account: React.FunctionComponent<Props> = ({ address }) => {
  const { data, isError, isLoading } = useBalance({ address, watch: true });
  const { disconnect } = useDisconnect()

  const navigate = useNavigate();

  if (isLoading) return <div>Fetching balance…</div>
  if (isError) return <div>Error fetching balance</div>

  const goToSendForm = () => {
    navigate('/wc-send-form')
  }

  const handleDisconnect = () => {
    disconnect();
  }

  return (
    <Box gap={'16px'}>
      <Box>
        <Typography.Text>Balance: {data?.formatted} {data?.symbol}</Typography.Text>
      </Box>
      <Box>
        <Typography.Text>Address: {address}</Typography.Text>
      </Box>
      <Box>
        <Button type={'primary'} onClick={goToSendForm}>Send ONE</Button>
      </Box>
      <Button type="default" onClick={handleDisconnect}>Disconnect</Button>
    </Box>
  )
};

Account.displayName = 'Account';
