import * as React from 'react';
import {Button, Input, InputNumber, Typography} from "antd";
import {Box} from "grommet";
import {sendFormStore} from "./SendFormStore";
import {useSendTransaction} from "wagmi";
import {observer} from "mobx-react";
import {BaseLayout} from "../../components/BaseLayout";
import {useNavigate, useSearchParams} from "react-router-dom";

export const WCSendForm: React.FC = observer(() => {
  const navigate = useNavigate();

  const [qrParams] = useSearchParams();

  const amount = qrParams.get('amount');
  const address = qrParams.get('to');

  React.useEffect(() => {
    if (amount && address) {
      sendFormStore.amount = amount;
      sendFormStore.address = address;
    }
  }, [amount, address]);


  const { isLoading, sendTransaction, isSuccess, isError, error, reset, data } = useSendTransaction({
    to: sendFormStore.address,
    value: sendFormStore.getEthAmount(),
  });

  const handleSend = () => {
    if (sendTransaction) {
      sendTransaction()
    }
  }

  console.log('### data', data);

  return (
    <BaseLayout>
      <Box gap={'16px'} fill="horizontal">
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
            type="primary"
            block
            disabled={isLoading || !sendFormStore.isValid()}
            loading={isLoading}
            onClick={handleSend}>
            Confirm
          </Button>
          {isLoading &&
            <Button danger block onClick={() => {
              reset()
            }}>
              Reset
            </Button>
          }
          {!isLoading && <Button block onClick={() => navigate('/')}>
            Back
          </Button>}
        </Box>
        {isSuccess &&
          <Box margin={{top: '16px'}} gap="16px">
            <Typography.Text type="success">Success</Typography.Text>
            <Typography.Link href="https://explorer.harmony.one/tx/" target="_blank">{data?.hash}</Typography.Link>
          </Box>
        }
        {isError &&
          <Box margin={{top: '16px'}} gap="16px">
            <Typography.Text type="danger">Error</Typography.Text>
            <Typography.Text>{error?.message}</Typography.Text>
          </Box>
        }
      </Box>
    </BaseLayout>
  )
});

