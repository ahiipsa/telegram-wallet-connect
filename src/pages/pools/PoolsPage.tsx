import {BaseLayout} from "../../components/BaseLayout";
import {useQuery} from "@apollo/client";
import {GET_POOLS} from "../../uniswap/pool";
import {useAccount} from "wagmi";

export function PoolsPage() {

  const { address, isConnected } = useAccount();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const {loading, error, data} = useQuery(GET_POOLS, {variables: {address: address }});

  console.log('### data', data);
  console.log('### loading', loading);
  console.log('### error', error);

  return (
    <BaseLayout>
      <div></div>
    </BaseLayout>
  );
}