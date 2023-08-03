import * as React from 'react';
import {Grommet} from 'grommet';
import {BrowserRouter} from "react-router-dom";
import { ApolloProvider } from '@apollo/client';
import {AppRoutes} from "./Routes";
import {WagmiConfigProvider} from "./modules/wagmi/WagmiConfigProvider";
import {apolloClient} from "./uniswap/pool";

function App() {
  return (
    <Grommet full>
      <ApolloProvider client={apolloClient}>
        <WagmiConfigProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </WagmiConfigProvider>
      </ApolloProvider>
    </Grommet>
  )
}

export default App;
