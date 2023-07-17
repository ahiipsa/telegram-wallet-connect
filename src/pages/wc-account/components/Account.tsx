import React from 'react';
import {useBalance, useDisconnect} from "wagmi";
import {Button} from "antd";
import {Box} from "grommet";
import {useNavigate} from "react-router-dom";

interface Props {
  address: string
}

export const Account: React.FC<Props> = ({ address }) => {
  const { data, isError, isLoading } = useBalance({ address: address, watch: true, });
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
        Balance: {data?.formatted} {data?.symbol}
      </Box>
      <Box>
        Address: {address}
      </Box>
      <Box>
        <Button type={'primary'} onClick={goToSendForm}>Send ONE</Button>
      </Box>
      <Button type="default" onClick={handleDisconnect}>Disconnect</Button>
    </Box>
  )
};

Account.displayName = 'Account';
