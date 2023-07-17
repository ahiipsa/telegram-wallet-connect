import React from 'react';
import {Button, Input, InputNumber} from "antd";
import {Box} from "grommet";
import {sendFormStore} from "./SendFormStore";
import {parseEther} from "viem";
import {useSendTransaction} from "wagmi";
import {observer} from "mobx-react";

export const WCSendForm: React.FC = observer(() => {

  const { data, isLoading, isSuccess, isError, isIdle, sendTransaction } = useSendTransaction({
    to: sendFormStore.address,
    value: parseEther(sendFormStore.amount),
  });

  const handleSend = () => {
    if (sendTransaction) {
      sendTransaction()
    }
  }

  return <Box>
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
    <Box margin={{ top: '16px' }}>
      <Button
        type={'primary'}
        disabled={isLoading}
        onClick={handleSend}>
        Confirm
      </Button>
    </Box>
  </Box>;
});

