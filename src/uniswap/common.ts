import {ethers, Contract} from "ethers";
import { BigNumber } from '@ethersproject/bignumber'
import { Currency, CurrencyAmount } from '@uniswap/sdk-core'

export const defaultProvider = new ethers.JsonRpcProvider('https://api.harmony.one');

import NonfungiblePositionManagerJson from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
import {NONFUNGIBLE_POSITION_MANAGER_ADDRESSES} from "./addresses";
import {SupportedChainId} from "./chains";
import {unwrappedToken} from "./utils/unwrappedToken";
import {Pool} from "@uniswap/v3-sdk";

const { abi: NFTPositionManagerABI } = NonfungiblePositionManagerJson


const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1)


export const getPositionFees = async ({owner, tokenId, chainId}: {owner: string, tokenId: string, chainId: number}) => {
  const positionManager = new Contract(
    NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
    NFTPositionManagerABI,
    defaultProvider
  )


  const results = await positionManager.collect.staticCallResult(
    {
      tokenId: tokenId,
      recipient: owner, // some tokens might fail if transferred to address(0)
      amount0Max: MAX_UINT128.toString(),
      amount1Max: MAX_UINT128.toString(),
    },
    { from: owner } // need to simulate the call as the owner
  )
  console.log('### results', results);
  console.log('### results.amount0', results.amount0);
  console.log('### results.amount1', results.amount1);

  return {amount0: results.amount0, amount1: results.amount1};
}
