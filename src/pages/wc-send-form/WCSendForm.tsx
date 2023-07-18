import React from 'react';
import {Button, Input, InputNumber, Typography} from "antd";
import {Box} from "grommet";
import {sendFormStore} from "./SendFormStore";
import {parseEther, isAddress} from "viem";
import {useSendTransaction} from "wagmi";
import {observer} from "mobx-react";
import {BaseLayout} from "../../components/BaseLayout";
import {useNavigate} from "react-router-dom";

export const WCSendForm: React.FC = observer(() => {
  const navigate = useNavigate();

  const { isLoading, sendTransaction, isSuccess, data } = useSendTransaction({
    to: sendFormStore.address,
    value: sendFormStore.getEthAmount(),
  });

  const handleSend = () => {
    if (sendTransaction) {
      sendTransaction()
    }
  }

  console.log('### data', data);

  return <BaseLayout>
    <Box gap={'16px'}>
      <Input
        placeholder={'Address (0x...)'}
        name={'address'}
        value={sendFormStore.address}
        onChange={(e) => sendFormStore.address = e.target.value}
      />
      <InputNumber
        placeholder={'Amount'}
        name="amount"
        addonAfter={<Box>ONE</Box>}
        value={sendFormStore.amount}
        onChange={(value) => sendFormStore.amount = String(value)}
      />
    </Box>
    <Box margin={{ top: '16px' }} gap="16px">
      <Button
        type={'primary'}
        disabled={isLoading || !sendFormStore.isValid()}
        loading={isLoading}
        onClick={handleSend}>
        Confirm
      </Button>
      <Button onClick={() => navigate('/')}>
        Back
      </Button>
    </Box>
    {isSuccess &&
      <Box margin={{top: '16px'}} gap="16px">
        <Typography.Text type="success">Success</Typography.Text>
        <Typography.Text>{data?.hash}</Typography.Text>
      </Box>
    }
  </BaseLayout>;
});

