import * as React from 'react';
import {Button, Typography} from "antd";
import {Box} from "grommet";
import {parseEther, isAddress} from "viem";
import {useAccount, useSendTransaction} from "wagmi";
import {observer} from "mobx-react";
import {BaseLayout} from "../../components/BaseLayout";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";

export const WCConfirmTransaction: React.FC = observer(() => {
  const navigate = useNavigate();

  const {address, isConnected} = useAccount();

  React.useEffect(() => {
    if (!isConnected) {
      navigate('/')
    }
  }, [isConnected, navigate]);

  const [qrParams] = useSearchParams();

  const _amount = qrParams.get('amo' +
    'unt');
  const _address = qrParams.get('to');
  const [params, setParams] = React.useState({address: '', amount: BigInt(0)});

  React.useEffect(() => {
    if (_amount && _address && isAddress(_address)) {
      try {
        const weiAmount = parseEther(_amount);
        const address = _address;

        setParams({address, amount: weiAmount});
      } catch (ex) {

      }
    }
  }, [_amount, _address]);

  const { isLoading, sendTransaction, isSuccess, reset, isIdle, isError, error, data } = useSendTransaction({
    to: params.address,
    value: params.amount,
  });

  const handleSend = () => {
    if (sendTransaction) {
      sendTransaction()
    }
  }

  return (
    <BaseLayout>
      <Box fill="horizontal" gap="16px">
        <Box gap={'16px'}>
          <Typography.Text>
            <Typography.Text strong>From:</Typography.Text> <br /> {address}
          </Typography.Text>
          <Typography.Text>
            <Typography.Text strong>To:</Typography.Text> <br /> {params.address}
          </Typography.Text>
          <Typography.Text>
            <Typography.Text strong>Amount:</Typography.Text> {_amount} ONE
          </Typography.Text>
        </Box>
        <Box gap="16px">
          <Button
            type="primary"
            block
            disabled={isLoading}
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
  );
});

