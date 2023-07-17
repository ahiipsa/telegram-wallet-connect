const config = {
  rpcUrl: 'https://api.harmony.one',
  walletConnect: {
    projectId: '',
  },
  chainParameters: {
      id: 1666600000, // '0x63564C40'
      name: 'Harmony Mainnet Shard 0',
      network: 'harmony',
      nativeCurrency: {
        decimals: 18,
        name: 'ONE',
        symbol: 'ONE',
      },
      rpcUrls: {
        default: {
          http: ['https://api.harmony.one'],
        },
        public: {
          http: ['https://api.harmony.one']
        }
      },
      blockExplorers: {
        default: { name: 'Explorer', url: 'https://explorer.harmony.one/' },
      },
      testnet: true,
    }
}

export default config
