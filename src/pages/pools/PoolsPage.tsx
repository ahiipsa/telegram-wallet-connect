import {BaseLayout} from "../../components/BaseLayout";
import {useQuery} from "@apollo/client";
import {useAccount, useDisconnect} from "wagmi";
import {Button, Typography} from "antd";
import {gql} from "../../__generated__/gql";
import {useMemo} from "react";
import {LoginPage} from "../../components/LoginPage";
import {Box} from "grommet";

interface Position {
  depositedToken0: string;
  depositedToken1: string;
  feeGrowthInside0LastX128: string,
  feeGrowthInside1LastX128: string
  token0: {
    id: string
  };
  token1: {
    id: string
  };
}

const GET_TOKEN_HOURS_DATA = gql(/* GraphQL */ `
    query TokensQuery($timestamp: Int) {
        tokenHourDatas(where: {periodStartUnix_gt: $timestamp})  {
            token {
                id,
                name,
            },
            priceUSD
        }
    }
`)

export const GET_POOLS = gql(/* GraphQL */ `
    query PositionsQuery($address: Bytes) {
      positions(where: {owner: $address}) {
          id,
          owner,
          liquidity,
          depositedToken0,
          depositedToken1,
          collectedFeesToken0,
          collectedFeesToken1,
          feeGrowthInside0LastX128,
          feeGrowthInside1LastX128,
          token0 {
              id
          },
          token1 {
              id
          }
      }
    }
`);

export function PoolsPage() {
  const { address, isConnected } = useAccount();

  if (!isConnected || !address) {
    return <LoginPage />
  }

  return (
    <BaseLayout>
      <TotalLiquidity address={address} />
    </BaseLayout>
  );
}

const timestamp = Math.round(Date.now() / 1000) - (140 * 60);

export function TotalLiquidity({address}: {address: string}) {

  const {loading, error, data} = useQuery(GET_POOLS, {variables: {address }});

  const tokensHourDatas = useQuery(GET_TOKEN_HOURS_DATA, {variables: {timestamp}});

  const { disconnect } = useDisconnect()

  const priceMap = useMemo(() => {

    if (!tokensHourDatas.data) {
      return {};
    }

    return tokensHourDatas.data.tokenHourDatas.reduce((acc, item) => {
      return {...acc, [item.token.id]: item.priceUSD};
    }, {} as {[key: string]: string});
  }, [tokensHourDatas]);

  if (loading) {
    return <BaseLayout>loading...</BaseLayout>
  }

  if (error) {
    return <BaseLayout>error: {error.message}</BaseLayout>
  }

  if (!data || data.positions.length === 0) {
    return (
      <BaseLayout>
        <Box gap="16px">
          <Typography.Text>{address}</Typography.Text>
          <Typography.Text strong>You have no liquidity pools</Typography.Text>
          <Button type="primary" href="https://swap.country/#/pools">Create pool</Button>
          <Button type="default" danger onClick={() => disconnect()}>Disconnect</Button>
        </Box>
      </BaseLayout>
    );
  }

  const getUsdPrice = (tokenId: string): string => {
    return priceMap[tokenId] || '0';
  }

  const calcUsdAmount = (tokenId: string, amount: string) => {
    const price = getUsdPrice(tokenId);
    return Number(price) * Number(amount);
  }

  const calculatePositionTotalLiquidityUsd = (position: Position) => {
    const amount0 = calcUsdAmount(position.token0.id, position.depositedToken0);
    const amount1 = calcUsdAmount(position.token1.id, position.depositedToken1);

    return amount0 + amount1;
  }

  const calculatePositionTotalRevenueUsd = (position: Position) => {
    const amount0 = calcUsdAmount(position.token0.id, position.feeGrowthInside0LastX128);
    const amount1 = calcUsdAmount(position.token1.id, position.feeGrowthInside1LastX128);

    return amount0 + amount1;
  }

  const calculateTotalLiquidityUsd = (positionList: Position[]) => {
    return positionList.reduce((acc, position) => {
      return acc + calculatePositionTotalLiquidityUsd(position);
    }, 0);
  }

  const calculateTotalRevenueUsd = (positionList: Position[]) => {
    return positionList.reduce((acc, position) => {
      return acc + calculatePositionTotalRevenueUsd(position)
    }, 0);
  }

  return (
    <Box gap="16px">
      <Typography.Text strong>
        Total liquidity: ${calculateTotalLiquidityUsd(data.positions)}
      </Typography.Text>

      <Typography.Text strong>
        Total revenue: ${calculateTotalRevenueUsd(data.positions)}
      </Typography.Text>

      <Button type="primary" href="https://swap.country/#/pools">Create pool</Button>
      <Button type="default" danger onClick={() => disconnect()}>Disconnect</Button>
    </Box>
  );
}