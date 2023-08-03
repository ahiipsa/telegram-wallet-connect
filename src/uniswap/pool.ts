import { ApolloClient, InMemoryCache } from '@apollo/client'
import {gql} from "../__generated__/gql";
import config from "../config";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const GET_POOLS = gql(/* GraphQL */ `query PositionsQuery($address: Bytes!) {
  positions(where: {owner: $address}) {
    id,
      owner,
      liquidity,
      depositedToken0,
      depositedToken1,
      collectedFeesToken0,
      collectedFeesToken1,
      withdrawnToken0,
      feeGrowthInside0LastX128,
      feeGrowthInside1LastX128,
      tickUpper {
      id
    },
    tickLower {
      liquidityProviderCount
    },
    token0 {
      id,
        name,
        symbol,
    },
    token1 {
      id,
        name
    }
  }
}
`);

export const apolloClient = new ApolloClient({
  uri: config.graphqlHost,
  cache: new InMemoryCache(),
})