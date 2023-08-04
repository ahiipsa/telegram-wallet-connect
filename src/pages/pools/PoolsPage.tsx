import {BaseLayout} from "../../components/BaseLayout";
import {useQuery} from "@apollo/client";
import {useAccount, useDisconnect} from "wagmi";
import {Button, Typography} from "antd";
import {gql} from "../../__generated__/gql";
import {useEffect, useMemo, useState} from "react";
import {LoginPage} from "../../components/LoginPage";
import {Box} from "grommet";
import {getPositionFees} from "../../uniswap/common";
import {BigNumber} from "@ethersproject/bignumber";
import {SupportedChainId} from "../../uniswap/chains";
import {ethers} from "ethers";

interface Position {
  id: string,
  owner: string,
  depositedToken0: string;
  depositedToken1: string;
  feeGrowthInside0LastX128: string,
  feeGrowthInside1LastX128: string
  token0: {
    id: string,
    decimals: string,
  };
  token1: {
    id: string
    decimals: string,
  };
}

interface PriceMap {
  [key: string]: string
}

const GET_TOKEN_HOURS_DATA = gql(/* GraphQL */ `
    query TokensQuery($timestamp: Int) {
        tokenHourDatas(where: {periodStartUnix_gt: $timestamp})  {
            token {
                id,
                name,
            },
            priceUSD,
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
              id,
              decimals,
          },
          token1 {
              id,
              decimals
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

  const [totalRevenue, setTotalRevenue] = useState(0);

  const tokensHourDatas = useQuery(GET_TOKEN_HOURS_DATA, {variables: {timestamp: timestamp}});

  const { disconnect } = useDisconnect()

  const priceMap: PriceMap = useMemo(() => {
    if (!tokensHourDatas.data) {
      return {};
    }

    return tokensHourDatas.data.tokenHourDatas.reduce((acc, item) => {
      return {...acc, [item.token.id]: item.priceUSD};
    }, {});
  }, [tokensHourDatas]);

  useEffect(() => {
    if (data && data.positions) {
      calculateTotalRevenueUsd(data.positions, priceMap).then((result) => {
        setTotalRevenue(result);
      });
    }
  }, [data, priceMap])

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

  const calcUsdAmount = (tokenId: string, amount: string, priceMap: PriceMap) => {
    const price = priceMap[tokenId] || '0';
    return Number(price) * Number(amount);
  }

  const calculatePositionTotalLiquidityUsd = (position: Position, priceMap: PriceMap) => {
    const amount0 = calcUsdAmount(position.token0.id, position.depositedToken0, priceMap);
    const amount1 = calcUsdAmount(position.token1.id, position.depositedToken1, priceMap);
    return amount0 + amount1;
  }

  const calculatePositionTotalRevenueUsd = async (position: Position, priceMap: PriceMap) => {
    const result = await getPositionFees({tokenId: position.id, chainId: SupportedChainId.HARMONY, owner: position.owner});

    const amount0 = ethers.formatUnits(result.amount0, Number(position.token0.decimals))
    const amount1 = ethers.formatUnits(result.amount1, Number(position.token1.decimals))

    const amount0Usd = calcUsdAmount(position.token0.id, amount0, priceMap);
    const amount1Usd = calcUsdAmount(position.token1.id, amount1, priceMap);

    return amount0Usd + amount1Usd;
  }

  const calculateTotalLiquidityUsd = (positionList: Position[], priceMap: PriceMap) => {
    return positionList.reduce((acc, position) => {
      return acc + calculatePositionTotalLiquidityUsd(position, priceMap);
    }, 0);
  }

  const calculateTotalRevenueUsd = (positionList: Position[], priceMap: PriceMap) => {
    return positionList.reduce( async (acc, position) => {
      return await acc + await calculatePositionTotalRevenueUsd(position, priceMap);
    }, Promise.resolve(0));
  }

  const totalLiquidity = calculateTotalLiquidityUsd(data.positions, priceMap);

  return (
    <Box gap="16px">
      <Typography.Text strong>
        Total liquidity: ${totalLiquidity.toFixed(2)}
      </Typography.Text>

      <Typography.Text strong>
        Total revenue: ${totalRevenue.toFixed(2)}
      </Typography.Text>

      <Button type="primary" href="https://swap.country/#/pools">Create pool</Button>
      <Button type="default" danger onClick={() => disconnect()}>Disconnect</Button>
    </Box>
  );
}